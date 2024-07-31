import React from 'react';
import loader from '/loader.svg';

const Loader = () => {
  return (
    <img className='h-[1.875rem] w-[1.875rem] object-contain absolute right-2 top-1/2 transform -translate-y-1/2' src={loader} alt="Logo" />
  )
}

export default Loader