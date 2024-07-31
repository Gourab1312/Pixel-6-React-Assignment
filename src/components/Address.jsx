import React from "react";
import Loader from "./Loader";

const states = ["Maharastra", "West Bengal", "Karnataka"];
const cities = ["Kolkata", "Pune", "Bangalore"];

function Address({
  address,
  allAddressLength,
  index,
  postcodeLoading,
  onChange,
  onRemove,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Address</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          value={address.addressLine1}
          onChange={(e) => onChange(index, "addressLine1", e.target.value)}
          placeholder="Address Line 1"
          required
          className="mt-1 px-4 py-2.5 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <input
          type="text"
          value={address.addressLine2}
          onChange={(e) => onChange(index, "addressLine2", e.target.value)}
          placeholder="Address Line 2"
          className="mt-1 px-4 py-2.5 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <div className="relative">
          <input
            type="text"
            value={address.postcode}
            onChange={(e) => onChange(index, "postcode", e.target.value)}
            placeholder="Postcode"
            required
            className="mt-1 px-4 py-2.5 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {postcodeLoading && <Loader />}
        </div>
        <div className="relative">
          <select
            value={address.state}
            onChange={(e) => onChange(index, "state", e.target.value)}
            required
            className="appearance-none bg-white mt-1 px-4 py-2.5 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="" disabled>
              Select State
            </option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
            <img className="h-2 w-3" src={'/dropdown-icon.png'} />
          </div>
        </div>
        <div className="relative">
          <select
            value={address.city}
            onChange={(e) => onChange(index, "city", e.target.value)}
            required
            className="appearance-none bg-white mt-1 px-4 py-2.5 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="" disabled>
              Select City
            </option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
            <img className="h-2 w-3" src={'/dropdown-icon.png'} />
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={allAddressLength <= 1}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default Address;
