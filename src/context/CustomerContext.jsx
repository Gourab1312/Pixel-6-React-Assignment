import React, { createContext, useContext, useReducer, useEffect } from 'react';

//creating the context to globally get the customers data
const CustomerContext = createContext();

//function to get the data from the localstorage if any
function loadCustomersFromLocalStorage() {
  const storedCustomers = localStorage.getItem('customers');
  return storedCustomers ? JSON.parse(storedCustomers) : [];
}

// main reducer function that sets the customers array on load, adds, updates and delete customers
// Each customer is basically represented as objects in the array customers.
function customerReducer(state, action) {
  let newState;
  switch (action.type) {
    case 'SET_CUSTOMERS':
      newState = { ...state, customers: action.payload };
      break;
    case 'ADD_CUSTOMER':
      newState = { ...state, customers: [...state.customers, action.payload] };
      break;
    case 'UPDATE_CUSTOMER':
      newState = {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.id ? action.payload : customer
        ),
      };
      break;
    case 'DELETE_CUSTOMER':
      newState = {
        ...state,
        customers: state.customers.filter(customer => customer.id !== action.payload),
      };
      break;
    default:
      return state;
  }
  
  // Saving the udpated customers array to after each of the action type defined above happens
  localStorage.setItem('customers', JSON.stringify(newState.customers));
  return newState;
}


export function CustomerProvider({ children }) {
  const [state, dispatch] = useReducer(customerReducer, { customers: loadCustomersFromLocalStorage() });

// Load data from localStorage on initial render
useEffect(() => {
  // This effect will run on mount and ensure that the state is synchronized with localStorage
  dispatch({ type: 'SET_CUSTOMERS', payload: loadCustomersFromLocalStorage() });
}, []);

  return (
    <CustomerContext.Provider value={{ state, dispatch }}>
      {children}
    </CustomerContext.Provider>
  );
}

export const useCustomerContext = () => useContext(CustomerContext);