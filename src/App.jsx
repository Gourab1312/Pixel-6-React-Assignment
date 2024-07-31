import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { CustomerProvider } from "./context/CustomerContext";
import CustomerForm from "./components/customerForm";
import CustomerList from './components/customerList'

function App() {
  return (
    <CustomerProvider>
      <div className="App min-h-screen w-full flex justify-center items-center">
        <Routes>
          <Route path="/" element={<CustomerForm />} />
          <Route path="/edit-customer/:id" element={<CustomerForm />} />
          <Route path="/customer-list" element={<CustomerList />} />
        </Routes>
      </div>
    </CustomerProvider>
  );
}

export default App;
