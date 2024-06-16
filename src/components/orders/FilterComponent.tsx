import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Select, { StylesConfig, MultiValue } from 'react-select';
import MyDateRangePicker from './DateRangePicker';
import CheckboxOption from './CheckboxOption';
import MultiValueComponent from './MultiValue';

interface OptionType {
  value: string;
  label: string;
}

interface FilterComponentProps {
  customerNamesOptions: OptionType[];
  selectedCustomerNames: MultiValue<OptionType>;
  handleSelectCustomerNames: (selectedOptions: MultiValue<OptionType>) => void;
  regionsOptions: string[];
  facilityOptions: string[];
  selectedRegions: string[];
  handleSelectRegions: (region: string) => void;
  countryOptions: OptionType[];
  selectedCountries: MultiValue<OptionType>;
  handleSelectCountries: (selectedOptions: MultiValue<OptionType>) => void;
  stateOptions: OptionType[];
  selectedStates: MultiValue<OptionType>;
  handleSelectStates: (selectedOptions: MultiValue<OptionType>) => void;
  customStyles: StylesConfig<OptionType, true>;

}

const FilterComponent: React.FC<FilterComponentProps> = ({
  customerNamesOptions,
  selectedCustomerNames,
  handleSelectCustomerNames,
  regionsOptions,
  facilityOptions,
  selectedRegions,
  handleSelectRegions,
  countryOptions,
  selectedCountries,
  handleSelectCountries,
  stateOptions,
  selectedStates,
  handleSelectStates,
  customStyles,
}) => {
  return (
    <>
        <Row className="sub-row" md={12}>
          <Form.Label>Date Range</Form.Label>
          <MyDateRangePicker />
        </Row>
        <Row className="sub-row" md={12}>
          <Form.Group>
            <Form.Label>Customer Names</Form.Label>
            <Select
              isMulti
              options={customerNamesOptions}
              value={selectedCustomerNames}
              onChange={handleSelectCustomerNames}
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              components={{ Option: CheckboxOption, MultiValue: MultiValueComponent }}
              styles={customStyles}
            />
          </Form.Group>
        </Row>
        <Row className="sub-row" md={12}>
          <Form.Group>
            <Form.Label>Ship to Region</Form.Label>
            <div className="inline-checkbox">
              {regionsOptions.map((region) => (
                <Form.Check
                  type="checkbox"
                  key={region}
                  label={region}
                  value={region}
                  checked={selectedRegions.includes(region)}
                  onChange={() => handleSelectRegions(region)}
                />
              ))}
            </div>
          </Form.Group>
        </Row>
        {/* <Row className="sub-row" md={12}>
          <Form.Group>
            <Form.Label>Shipping Facility</Form.Label>
            <div className="inline-checkbox">
              {facilityOptions.map((facility) => (
                <Form.Check
                  type="checkbox"
                  key={facility}
                  label={facility}
                  value={facility}
                  checked={selectedRegions.includes(facility)}
                  onChange={() => handleSelectRegions(facility)}
                />
              ))}
            </div>
          </Form.Group>
        </Row> */}
        <Row className="sub-row" md={12}>
          <Form.Group>
            <Form.Label>Country</Form.Label>
            <Select
              isMulti
              options={countryOptions}
              value={selectedCountries}
              onChange={handleSelectCountries}
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              components={{ Option: CheckboxOption, MultiValue: MultiValueComponent }}
              styles={customStyles}
            />
          </Form.Group>
        </Row>
        <Row className="sub-row" md={12}>
          <Form.Group>
            <Form.Label>State</Form.Label>
            <Select
              isMulti
              options={stateOptions}
              value={selectedStates}
              onChange={handleSelectStates}
              hideSelectedOptions={false}
              closeMenuOnSelect={false}
              components={{ Option: CheckboxOption, MultiValue: MultiValueComponent }}
              styles={customStyles}
            />
          </Form.Group>
        </Row>
        <Row className="sub-row" md={12}>
          <Button style={{ width: '50%', margin: '0 auto' }}>Apply Filter</Button>
        </Row>

    </>
  );
};

export default FilterComponent;
