import React from 'react'
import { FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa6'

const Footer = () => {
  return (
    <section id='footer' className='mt-auto p-7 bg-amber-100 text-amber-900'>
      <div className='flex justify-center mb-3'>
        <a className='mx-2' href='https://www.linkedin.com/in/affan-ansari-95b58b24a/' target='__blank'>
          <FaLinkedinIn />
        </a>
        <a className='mx-2' href='https://www.instagram.com/spdcbr_titan/?next=%2F' target='__blank'>
          <FaInstagram />
        </a>
        <a className='mx-2' href='https://www.youtube.com/channel/UCtrssLJ6cVY2DUb0mC1NxGw' target='__blank'>
          <FaYoutube />
        </a>
      </div>
      <div className='text-center'>@ 2024 Mohammed Affan Ansari</div>
    </section>
  )
}

export default Footer