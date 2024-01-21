import React, { useEffect, useRef, useState } from 'react'
import { FaIndianRupeeSign, FaCircleExclamation, FaArrowLeft, FaUpload, FaCircleXmark, FaBoxOpen, FaMedal, FaSquare, FaWarehouse } from 'react-icons/fa6';
import Input from '../Input';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';

const UploadProduct = (props) => {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [validated, setValidated] = useState({ sizes: props.product?.sizes || [], description: props.product?.description || '' });
  const [image, setImage] = useState({ link: false, file: false, image: '' });
  const imageSrc = function () {
    if (image.file) {
      return URL.createObjectURL(image.image);
    }
    else if (image.link) {
      return image.image;
    }
    else return false;
  }();
  let [submitBtnActive, setSubmitBtnActive] = useState(true);

  useEffect(() => {
    if (props.edit) {
      setImage({ file: false, link: true, image: props.product.productImage });
    }
  }, [props]);

  const onSubmit = (data) => {
    if (image === '') {
      // imageError.current.innerHTML = 'Please Upload product image !';
      toast('Please select your beautiful belt image');
    }
    else if (validated.sizes.length === 0) toast('Select the sizes which you are available')
    else if (!validated.description) toast("Provide a description for this product");
    else {
      // converting image to base64 format
      data.productImage = image.image;
      data.description = descriptionRef.current.value;
      data.sellerId = props.signedIn._id;
      data.sellerName = props.signedIn.username;
      data.sizes = validated.sizes;
      if (props.edit) updateProduct(data);
      else uploadProduct(data);
    }
  }

  // Submitting modified data from onSubmit function.
  async function uploadProduct(data) {
    if (!submitBtnActive) {
      toast('Please wait till previous request finishes processing')
      return;
    }
    setSubmitBtnActive(false);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    try {
      const res = await axios({
        method: 'POST',
        url: '/upload-product',
        withCredentials: true,
        headers: {
          Authorization: props.getAuthHeader()
        },
        data: formData
      })
      toast('Product Uploaded. Please wait for admin verification');
      delete data.sellerId;
      delete data.sellerName;
      data._id = res.data.id;
      data.createdAt = res.data.creationTime;
      data.verified = false;
      data.productImage = res.data.image
      props.addProduct(data);
      props.changeTab('products');
    }
    catch (err) {
      if (err.response.status === 403) toast(err.response.data.message);
      else {
        toast(err.response.data.message);
        props.signOutUser();
      }
    }
    setSubmitBtnActive(true);
  }

  async function updateProduct(data) {
    if (!submitBtnActive) {
      toast('Please wait till previous request finishes processing!')
      return;
    }
    setSubmitBtnActive(false);
    data._id = props.product._id;
    const formData = new FormData();
    if (image.file) {
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
    }
    try {
      let updatedProduct = await axios({
        method: 'PUT',
        url: `/update-product/${data.id}`,
        withCredentials: true,
        headers: {
          Authorization: props.getAuthHeader()
        },
        data: image.file ? formData : data,
      })
      delete data.sellerId;
      delete data.sellerName;
      data.createdAt = updatedProduct.data.createdAt;
      data.verified = updatedProduct.data.verified;
      data.productImage = updatedProduct.data.productImage.url;
      props.updateProductState(data);
      toast('Product Updated!');
      cancelEdit();
    }
    catch (err) {
      if (err.response.status === 403) toast(err.response.data.message);
      else {
        toast(err.response.data.message);
        props.signOutUser();
      }
    }
    setSubmitBtnActive(true);
  }

  const onError = (err) => {
    if (image === '') {
      toast('Please select your belt image')
      // imageError.current.innerHTML = 'Please Upload product image !';
    }
  }

  const descriptionRef = useRef(null);

  // Handling image input changes
  const getImage = (e) => {
    if (e.target.value === "") {
      return;
    }
    setImage({ link: false, file: true, image: e.target.files[0] });
  }

  // Handle belt size checkbox changes
  function sizeChange(e) {
    if (e.target.checked) {
      setValidated((prev) => ({ ...prev, sizes: [...prev.sizes, parseInt(e.target.value)] }));
    }
    else {
      setValidated((prev) => ({ ...prev, sizes: prev.sizes.filter(size => size !== parseInt(e.target.value)) }));
    }
  }

  function descriptionChange(e) {
    if (e.target.value === '') {
      setValidated((prev) => ({ ...prev, description: false }))
    }
    else setValidated((prev) => ({ ...prev, description: true }))
  }

  function cancelEdit() {
    props.setEdit(false);
  }

  return (
    <>
      {props.product && <div className='p-5 ps-2 flex space-x-2 text-amber-900 hover:cursor-pointer' onClick={cancelEdit}><FaArrowLeft className='my-auto' /><span className='my-auto'>Back to product list</span></div>}
      <div className='p-5 shadow-[0_0px_10px_rgba(0,0,0,0.25)]'>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <div className='mb-10'>
            <h2 className='text-2xl font-bold text-amber-900 mb-4'>{props.edit ? 'Edit Product' : 'Product Details'}</h2>
            <div className='grid grid-cols-1 gap-4'>

              {image.file || image.link
                ?
                <div className='relative mb-4'>
                  <img className='sm:w-1/2 lg:w-1/3 mx-auto' src={imageSrc} alt="couldn't load" loading='lazy' />
                  <div className='absolute top-0 right-0 text-amber-900 text-2xl hover:cursor-pointer' onClick={() => setImage({ link: false, file: false, image: '' })}><FaCircleXmark /></div>
                </div>
                :
                <div className='h-80 p-5 border-2 border-amber-900 border-dashed flex justify-center mb-4'>
                  <label htmlFor='product-image-picker' className='flex space-x-3 p-2 bg-amber-900 text-white rounded-lg h-fit my-auto hover:cursor-pointer'>
                    <FaUpload className='my-auto' />
                    <span className='my-auto'>Upload Image</span>
                  </label>
                  <input type="file" id='product-image-picker' className='hidden' name="image" accept="image/png, image/jpeg, image/jpg" onChange={getImage} />
                </div>
              }

              <Input
                placeholder="Product Name"
                name="name"
                icon=<FaBoxOpen />
                register={register}
                message="Product Name is Required"
                errMessage={errors.name?.message}
                defaultValue={props.product?.name}
              />
              <Input
                placeholder="Brand"
                name="brand"
                icon=<FaMedal />
                register={register}
                message="Brand Name is Required"
                errMessage={errors.brand?.message}
                defaultValue={props.product?.brand}
              />
              <Input
                placeholder="Price"
                name="price"
                icon=<FaIndianRupeeSign />
                register={register}
                message="Price is Required"
                errMessage={errors.price?.message}
                defaultValue={props.product?.price}
                type='number'
                minimumLength={2}
                length={5}
              />
              <Input
                placeholder="Material"
                name="material"
                icon=<FaSquare />
                register={register}
                message="Material is Required"
                errMessage={errors.material?.message}
                defaultValue={props.product?.material}
              />
              <Input
                placeholder="Stock"
                name="stock"
                icon=<FaWarehouse />
                register={register}
                message="Stock is Required"
                errMessage={errors.stock?.message}
                defaultValue={props.product?.stock}
                type='number'
                regEx={/^[1-9][0-9]?$|^100$/}
              />

              <div className='flex flex-col bg-gray-200 rounded-t-lg'>
                <div className='flex justify-between'>
                  <span className='text-amber-900 font-medium p-3 rounded-t-lg'>Size</span>
                  {validated.sizes.length === 0 && <span className='my-auto px-2 text-red-700'><FaCircleExclamation /></span>}
                </div>
                <ul className='bg-gray-100 text-gray-600 text-sm flex flex-col sm:flex-row py-4 border border-gray-200'>
                  <li className='my-auto mx-2'>
                    <input type='checkbox' name='size' id='28' value={28} onChange={sizeChange} defaultChecked={props.product && props.product.sizes ? props.product.sizes.includes(28) : false} />
                    <label className='pl-2' htmlFor="28">28</label>
                  </li>
                  <li className='my-auto mx-2'>
                    <input type='checkbox' name='size' id='32' value={32} onChange={sizeChange} defaultChecked={props.product && props.product.sizes ? props.product.sizes.includes(32) : false} />
                    <label className='pl-2' htmlFor="32">32</label>
                  </li>
                  <li className='my-auto mx-2'>
                    <input type='checkbox' name='size' id='36' value={36} onChange={sizeChange} defaultChecked={props.product && props.product.sizes ? props.product.sizes.includes(36) : false} />
                    <label className='pl-2' htmlFor="36">36</label>
                  </li>
                  <li className='my-auto mx-2'>
                    <input type='checkbox' name='size' id='40' value={40} onChange={sizeChange} defaultChecked={props.product && props.product.sizes ? props.product.sizes.includes(40) : false} />
                    <label className='pl-2' htmlFor="40">40</label>
                  </li>
                  <li className='my-auto mx-2'>
                    <input type='checkbox' name='size' id='44' value={44} onChange={sizeChange} defaultChecked={props.product && props.product.sizes ? props.product.sizes.includes(44) : false} />
                    <label className='pl-2' htmlFor="44">44</label>
                  </li>
                </ul>
              </div>
              {/* <div className='flex flex-col bg-gray-200 rounded-t-lg'>
              <span className='text-amber-900 font-medium p-3 rounded-t-lg'>Colors</span>
              <ul className='bg-gray-100 text-gray-600 text-sm flex flex-col sm:flex-row py-4 border border-gray-200'>
                <li className='my-auto mx-2'><input type='checkbox' name='black' id='black' /><label className='pl-2' htmlFor="black">Black</label></li>
                <li className='my-auto mx-2'><input type='checkbox' name='brown' id='brown' /><label className='pl-2' htmlFor="brown">Brown</label></li>
                <li className='my-auto mx-2'><input type='checkbox' name='white' id='white' /><label className='pl-2' htmlFor="white">White</label></li>
                </ul>
              </div> */}
              <div className='flex flex-col bg-gray-200 rounded-t-lg'>
                <div className='flex justify-between'>
                  <span className='text-amber-900 font-medium p-3 rounded-t-lg'>Description</span>
                  {!validated.description && <span className='my-auto px-2 text-red-700'><FaCircleExclamation /></span>}
                </div>
                <textarea onChange={descriptionChange} ref={descriptionRef} type='text' placeholder="Product Description" className='p-2 text-sm sm:text-base border border-gray-300 outline-none w-full bg-gray-100 text-amber-900 resize-none' rows="2" defaultValue={props.product?.description || ''} />
              </div>
            </div>
          </div>
          {props.edit ? (
            <button className={`${!submitBtnActive && 'button-loading'} h-10 w-full bg-amber-900 py-2 text-white rounded-lg`}>{!submitBtnActive ? '' : 'Update Product'}</button>
          )
            :
            <button className={`${!submitBtnActive && 'button-loading'} h-10 w-full bg-amber-900 py-2 text-white rounded-lg`}>{!submitBtnActive ? '' : 'Upload Product'}</button>
          }
        </form>
      </div>
    </>
  )
}

export default UploadProduct