import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerContext } from '../context/CustomerContext';

function CustomerList() {
  const { state, dispatch } = useCustomerContext();
  const navigate = useNavigate();

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_CUSTOMER', payload: id });
  };

  //using navigate from react router dom, to go the edit page with the dynamic id and serve the prefilled customerForm component
  const handleEdit = (id) => {
    navigate(`/edit-customer/${id}`);
  };

  return (
    <div className="mx-auto p-4 bg-white w-full flex justify-center items-center">
    <div className='flex-col items-between justify-start md:justify-center w-full lg:w-3/5 px-6 lg:px-12 shadow-lg rounded-md'>
      <h2 className="text-2xl lg:text-4xl mb-4 lg:mb-10 w-full text-center">Customer List</h2>
      <ul className='w-full'>
        {state.customers.map((customer, index) => (
          <li key={customer.id} className={`py-3 flex justify-between items-center ${index !== state.customers.length - 1 ? 'border-b' : ''}`}>
            <p>{customer.fullName} - {customer.email}</p>
            <div className='flex justify-start items-center gap-1'>
            <button
              onClick={() => handleEdit(customer.id)}
              className="mr-2 bg-yellow-500 text-white px-2 py-1 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(customer.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Delete
            </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={() => navigate('/')}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded mt-4 lg:mt-10"
      >
        Add New Customer
      </button>
      </div>
    </div>
  );
}

export default CustomerList;