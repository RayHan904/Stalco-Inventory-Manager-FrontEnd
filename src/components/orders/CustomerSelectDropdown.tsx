import React, { useState, ChangeEvent } from "react";
import { Button, ButtonGroup, Dropdown, Form } from "react-bootstrap";
import { CustomerData } from "../../services/api";

interface CheckboxMenuProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  "aria-labelledby"?: string;
  onSelectNone: () => void;
}

const CheckboxMenu = React.forwardRef<HTMLDivElement, CheckboxMenuProps>(
  ({ children, style, className, "aria-labelledby": labeledBy, onSelectNone }, ref) => {
    return (
      <div ref={ref} style={style} className={`${className || ""} CheckboxMenu`} aria-labelledby={labeledBy}>
        <div className="d-flex flex-column" style={{ maxHeight: "calc(100vh - 50px)", overflow: "auto" }}>
          <ul className="list-unstyled flex-shrink mb-0">{children}</ul>
          <div className="dropdown-item border-top pt-2 pb-0">
            <ButtonGroup size="sm">
              <Button variant="link" onClick={onSelectNone}>
                Select None
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    );
  }
);

interface CheckDropdownItemProps {
  children: React.ReactNode;
  id: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;  // Adjusted to match standard event handler signature
}

const CheckDropdownItem = React.forwardRef<HTMLDivElement, CheckDropdownItemProps>(
  ({ children, id, checked, onChange }, ref) => {
    return (
      <Form.Group ref={ref} className="dropdown-item mb-0" controlId={id}>
        <Form.Check
          type="checkbox"
          label={children}
          checked={checked}
          onChange={onChange}  // Use directly, no binding here
        />
      </Form.Group>
    );
  }
);



interface CheckboxDropdownProps {
  items: CustomerData[] | null;
}

export const CheckboxDropdown: React.FC<CheckboxDropdownProps> = ({ items = null }) => {
  const [checkboxItems, setCheckboxItems] = useState<CustomerData[] | null>(items);

  const handleChecked = (key: string, e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const updatedItems = checkboxItems?.map(item =>
      item.customerId.toString() === key ? { ...item, checked: target.checked } : item
    );
    setCheckboxItems(updatedItems ?? null);
  };

  const handleSelectNone = () => {
    const updatedItems = checkboxItems?.map(item => ({ ...item, checked: false }));
    setCheckboxItems(updatedItems ?? null);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">Properties</Dropdown.Toggle>
      <Dropdown.Menu as={CheckboxMenu} onSelectNone={handleSelectNone}>
        {checkboxItems?.map(item => (
          <Dropdown.Item
            key={item.customerId}
            as="div" // Temporarily treat as div or handle rendering manually to test event passing
          >
            <CheckDropdownItem
              id={item.customerId.toString()}
              checked={true}
              onChange={(e) => handleChecked(item.customerId.toString(), e as ChangeEvent<HTMLInputElement>)} // Casting here if necessary
            >
              {item.companyName}
            </CheckDropdownItem>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
  
};
