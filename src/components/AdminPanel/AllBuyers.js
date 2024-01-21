import React from 'react'
import User from './User'

const AllUsers = () => {
  return (
    <section id='users-container' className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      <User />
      <User />
      <User />
      <User />
      <User />
      <User />
      <User />
      <User />
      <User />
      <User />
      <User />
      <User />
      <User />
    </section>
  )
}

export default AllUsers