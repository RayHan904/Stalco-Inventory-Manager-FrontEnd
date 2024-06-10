import React from "react";
import { Form, FormControl, Button } from "react-bootstrap";

interface SKUDetailFormProps {
  label: string;
  placeholder: string;
  value: string;
  errorMessage: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  buttonText: string;
}

const SKUDetailForm: React.FC<SKUDetailFormProps> = ({
  label,
  placeholder,
  value,
  errorMessage,
  onChange,
  onSubmit,
  buttonText,
}) => {
  return (
    <Form className="p-3">
      <Form.Group controlId="commonFormInput">
        <Form.Label>{label}</Form.Label>
        <FormControl
          placeholder={placeholder}
          aria-label={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={errorMessage ? "is-invalid" : ""}
        />
        {errorMessage && (
          <Form.Control.Feedback type="invalid">
            {errorMessage}
          </Form.Control.Feedback>
        )}
        <Button variant="primary" className="mt-2" onClick={onSubmit}>
          {buttonText}
        </Button>
      </Form.Group>
    </Form>
  );
};

export default SKUDetailForm;
