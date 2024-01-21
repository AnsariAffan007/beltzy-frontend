import React from 'react'
import { FaArrowLeft } from 'react-icons/fa6';

const AdminProducts = (props) => {

  function setSellersTab() {
    props.returnToSellers();
  }

  async function verificationChange(id, e) {
    let checked = e.target.checked;
    e.target.disabled = true;
    let valid = await props.productVerificationChange(id, checked, props.sellerId);
    if (!valid) e.target.checked = !checked;
    e.target.disabled = false;
  }

  return (
    <>
      <div className='p-5 ps-2 flex space-x-2 text-amber-900 hover:cursor-pointer' onClick={setSellersTab}><FaArrowLeft className='my-auto' /><span className='my-auto'>Back to seller list</span></div>
      <div id='products' className='block overflow-x-auto'>
        <table id='products-table' className='w-full border-collapse table-auto whitespace-nowrap overflow-x-auto border-2 border-slate-100'>
          <thead className='bg-slate-100 text-left'>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Material</th>
              <th>Price</th>
              <th>Sizes</th>
              <th>Stock</th>
              <th>Sold</th>
              <th>Description</th>
              <th>Verified</th>
            </tr>
          </thead>
          <tbody>
            {props.products.map((product, index) => (
              <tr key={index} className=''>
                <td className='text-amber-700'><a href={product.productImage} rel='noreferrer' target='_blank'>View</a></td>
                {/* <td>{product.productImage}</td> */}
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.material}</td>
                <td>{product.price}</td>
                <td>
                  {product.sizes.sort().map((size, index) => {
                    if (index === product.sizes.length - 1) return <span key={index}>{size}</span>
                    else return <span key={index}>{size}, </span>
                  })}
                </td>
                <td>{product.stock}</td>
                <td>{product.sold}</td>
                <td>{product.description}</td>
                <td>
                  <div className='flex justify-center'>
                    <label className="switch">
                      <input type="checkbox" defaultChecked={product.verified} onChange={(e) => { verificationChange(product._id, e) }} />
                      <span className="slider"></span>
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default AdminProducts