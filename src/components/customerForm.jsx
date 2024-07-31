import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useCustomerContext } from "../context/CustomerContext";
import { verifyPAN, getPostcodeDetails } from "../utils/api";
import {
  validatePAN,
  validateEmail,
  validateMobile,
  validatePostcode,
} from "../utils/validators";
import Address from "./Address";

function CustomerForm() {
  const { dispatch, state } = useCustomerContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const [customer, setCustomer] = useState({
    pan: "",
    fullName: "",
    email: "",
    mobile: "",
    addresses: [
      { addressLine1: "", addressLine2: "", postcode: "", state: "", city: "" },
    ],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (validatePAN(customer.pan)) {
      verifyPAN(customer.pan).then((response) => {
        if (response.isValid) {
          setCustomer((prev) => ({ ...prev, fullName: response.fullName }));
        }
      });
    }
  }, [customer.pan]);

  useEffect(() => {
    if (id) {
      const customerToEdit = state.customers.find(c => c.id === parseInt(id));
      if (customerToEdit) {
        setCustomer(customerToEdit);
      }
    }
  }, [id, state.customers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...customer.addresses];
    newAddresses[index][field] = value;
    setCustomer((prev) => ({ ...prev, addresses: newAddresses }));

    if (field === "postcode" && validatePostcode(value)) {
      getPostcodeDetails(value).then((response) => {
        if (response.status === "Success") {
          newAddresses[index].state = response.state[0].name;
          newAddresses[index].city = response.city[0].name;
          setCustomer((prev) => ({ ...prev, addresses: newAddresses }));
        }
      });
    }
  };

  const addAddress = () => {
    if (customer.addresses.length < 10) {
      setCustomer((prev) => ({
        ...prev,
        addresses: [
          ...prev.addresses,
          {
            addressLine1: "",
            addressLine2: "",
            postcode: "",
            state: "",
            city: "",
          },
        ],
      }));
    }
  };

  const removeAddress = (index) => {
    if (customer.addresses.length > 1) {
      const newAddresses = customer.addresses.filter((_, i) => i !== index);
      setCustomer((prev) => ({ ...prev, addresses: newAddresses }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!validatePAN(customer.pan)) newErrors.pan = "Invalid PAN";
    if (customer.fullName.length > 140)
      newErrors.fullName = "Full Name must be 140 characters or less";
    if (!validateEmail(customer.email)) newErrors.email = "Invalid Email";
    if (!validateMobile(customer.mobile))
      newErrors.mobile = "Invalid Mobile Number";
    customer.addresses.forEach((address, index) => {
      if (!address.addressLine1)
        newErrors[`addressLine1_${index}`] = "Address Line 1 is required";
      if (!validatePostcode(address.postcode))
        newErrors[`postcode_${index}`] = "Invalid Postcode";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setTimeout(() => {
        if (id) {
          dispatch({
            type: "UPDATE_CUSTOMER",
            payload: { ...customer, id: parseInt(id) },
          });
        } else {
          dispatch({
            type: "ADD_CUSTOMER",
            payload: { ...customer, id: Date.now() },
          });
        }
        setLoading(false);
        navigate('/customer-list');
      }, 1000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-md flex flex-col items-between justify-center"
    >
    <h1 className="text-2xl lg:text-4xl mb-4 lg:mb-10 w-full text-center">{id ? 'Edit Customer' : 'Add Customer'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="pan"
            className="block text-sm font-medium text-gray-700"
          >
            PAN:
          </label>
          <input
            type="text"
            id="pan"
            name="pan"
            value={customer.pan}
            onChange={handleInputChange}
            maxLength="10"
            required
            className="mt-1 px-4 py-2.5 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.pan && (
            <span className="text-red-600 text-sm">{errors.pan}</span>
          )}
        </div>
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name:
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={customer.fullName}
            onChange={handleInputChange}
            maxLength="140"
            required
            className="mt-1 px-4 py-2.5 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.fullName && (
            <span className="text-red-600 text-sm">{errors.fullName}</span>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={customer.email}
            onChange={handleInputChange}
            required
            className="mt-1 px-4 py-2.5 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.email && (
            <span className="text-red-600 text-sm">{errors.email}</span>
          )}
        </div>
        <div>
          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-gray-700"
          >
            Mobile:
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={customer.mobile}
            onChange={handleInputChange}
            required
            className="mt-1 px-4 py-2.5 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {errors.mobile && (
            <span className="text-red-600 text-sm">{errors.mobile}</span>
          )}
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {customer.addresses.map((address, index) => (
          <Address
            key={index}
            address={address}
            allAddressLength={customer.addresses.length}
            index={index}
            onChange={handleAddressChange}
            onRemove={() => removeAddress(index)}
          />
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={addAddress}
          disabled={customer.addresses.length >= 10}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add Address
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : (id ? "Update Customer" : "Save Customer")}
        </button>
      </div>
    </form>
  );
}

export default CustomerForm;
