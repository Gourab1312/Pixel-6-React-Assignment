import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomerContext } from '../context/CustomerContext';

function CustomerList() {
  const { state, dispatch } = useCustomerContext();
  const navigate = useNavigate();

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_CUSTOMER', payload: id });
  };

  const handleEdit = (id) => {
    navigate(`/edit-customer/${id}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-md">
      <h2 className="text-2xl mb-4">Customer List</h2>
      <button
        onClick={() => navigate('/')}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add New Customer
      </button>
      <ul>
        {state.customers.map(customer => (
          <li key={customer.id} className="border-b py-2">
            <p>{customer.fullName} - {customer.email}</p>
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
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomerList;