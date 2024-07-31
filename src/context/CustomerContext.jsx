import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CustomerContext = createContext();

function loadCustomersFromLocalStorage() {
  const storedCustomers = localStorage.getItem('customers');
  return storedCustomers ? JSON.parse(storedCustomers) : [];
}

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
  
  // Save to localStorage after each action
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