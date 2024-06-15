import React, { ChangeEvent } from "react";
import { Form } from "react-bootstrap";
import { CustomerData } from "../../services/api";

interface CustomerSelectProps {
  customers: CustomerData[] | null;
  onSelect: (customer: CustomerData) => void;
}

const CustomerSelect: React.FC<CustomerSelectProps> = ({ customers, onSelect }) => {
    const handleSelect = (event: ChangeEvent) => {
        const target = event.target as HTMLSelectElement;
        const selectedCustomerString = target.value;
        const selectedCustomerObject = JSON.parse(selectedCustomerString);
    onSelect(selectedCustomerObject);
    console.log(selectedCustomerObject);

  };

  return (
    <Form.Group controlId="selectCustomer">
      <Form.Control as="select" onChange={handleSelect}>
        <option value="">Select a Customer...</option>
        {customers && customers.map((customer) => (
          <option key={customer.customerId} value={JSON.stringify(customer)}>
            {customer.companyName}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default CustomerSelect;
