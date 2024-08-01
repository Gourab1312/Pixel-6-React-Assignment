import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCustomerContext } from "../context/CustomerContext";
import { verifyPAN, getPostcodeDetails } from "../utils/api";
import {
  validatePAN,
  validateEmail,
  validateMobile,
  validatePostcode,
} from "../utils/validators";
import Address from "./Address";
import Loader from "./Loader";

function CustomerForm() {
  //getting dispatch and state from the global context
  const { dispatch, state } = useCustomerContext();
  // using navigate to go the customers list page when the form is submitted successfully and using id to check whether the component is being used for adding a customer or editing an existing customer (in the second case, it should have a valid id)
  const navigate = useNavigate();
  const { id } = useParams();
  // keeping all the properties that a customer item in the customers array should have
  const [customer, setCustomer] = useState({
    pan: "",
    fullName: "",
    email: "",
    mobile: "",
    addresses: [
      { addressLine1: "", addressLine2: "", postcode: "", state: "", city: "" },
    ],
  });
  // defining the erros and loading state, loading is for submit button of the form
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [panLoading, setPanLoading] = useState(false);
  const [postcodeLoading, setPostcodeLoading] = useState(false);

  // using the verifyPAN function from the utils and also handling the loading in the pan input using this useeffect
  // we are also using a set time out here to basically show the loader, else it was happening so fast that it was looking like a glitch, same for the postcode input field
  useEffect(() => {
    if (validatePAN(customer.pan)) {
      setPanLoading(true);
      verifyPAN(customer.pan).then((response) => {
        if (response.isValid) {
          setTimeout(() => {
            setCustomer((prev) => ({ ...prev, fullName: response.fullName }));
            setPanLoading(false);
          }, 1000);
        }
      });
    }
  }, [customer.pan]);

  // we are judging that if this component is being used for edit or add, if edit, we are prefilling all the inputs and selects for the user
  useEffect(() => {
    if (id) {
      const customerToEdit = state.customers.find((c) => c.id === parseInt(id));
      if (customerToEdit) {
        setCustomer(customerToEdit);
      }
    }
  }, [id, state.customers]);

  // this function is used for all the inputs and select elements, it takes the event that triggers it's call and manipulates the customer state using the name of the property that triggerd it at the first place and spreading all the prev customer data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

// we are handling addresses along with that prefilling the state and city select elements if the field is postcode
  const handleAddressChange = (index, field, value) => {
    const newAddresses = [...customer.addresses];
    newAddresses[index][field] = value;
    setCustomer((prev) => ({ ...prev, addresses: newAddresses }));

    if (field === "postcode" && validatePostcode(value)) {
      setPostcodeLoading(true);
      getPostcodeDetails(value).then((response) => {
        setTimeout(() => {
          if (response.status === "Success") {
            newAddresses[index].state = response.state[0].name;
            newAddresses[index].city = response.city[0].name;
            setCustomer((prev) => ({ ...prev, addresses: newAddresses }));
          }
          setPostcodeLoading(false);
        }, 1000);
      });
    }
  };

  // function to define the basic structure of an address object and add it when the user clicks on the add address button
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

  // function to filter out the address that the user wants to remove
  const removeAddress = (index) => {
    if (customer.addresses.length > 1) {
      const newAddresses = customer.addresses.filter((_, i) => i !== index);
      setCustomer((prev) => ({ ...prev, addresses: newAddresses }));
    }
  };

  // on the submit button this is validating every form field using the validators defined in the validators form and if everything is allright then only it is submitting the form
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

  //on submitting the form
  // first we are validting using the above function
  // then we are checking if id is present then action type would be update, else add
  // then we are handing the loading state of the submit button
  // then we are navigating to the customers list page
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
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
      navigate("/customer-list");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-4 my-4 bg-white shadow-lg rounded-md flex flex-col items-between justify-start md:justify-center"
    >
      <h1 className="text-2xl lg:text-4xl mb-4 lg:mb-10 w-full text-center">
        {id ? "Edit Customer" : "Add Customer"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="pan"
            className="block text-sm font-medium text-gray-700"
          >
            PAN:
          </label>
          <div className="relative">
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
            {panLoading && <Loader />}
          </div>
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
            postcodeLoading={postcodeLoading}
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
          {loading ? "Saving..." : id ? "Update Customer" : "Add Customer"}
        </button>
      </div>
    </form>
  );
}

export default CustomerForm;
