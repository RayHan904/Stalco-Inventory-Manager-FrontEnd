import React from 'react';
import { Row, Form, Button, Col } from 'react-bootstrap';
import Select, { StylesConfig, MultiValue } from 'react-select';
import MyDateRangePicker from './DateRangePicker';
import CustomOption from './CustomOption';
import MultiValueComponent from './MultiValue';
import { useOrdersDashboardData } from '../../contexts/OrdersDashboardDataContext';

export interface OptionType {
  value: string;
  label: string;
}

interface FilterComponentProps {
  customerNamesOptions?: OptionType[];
  regionsOptions?: string[];
  countryOptions?: OptionType[];
  stateOptions?: OptionType[];
  customStyles: StylesConfig<OptionType, true>;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  customerNamesOptions = [{ value: 'null', label: 'NONE' }],
  regionsOptions =['US', 'CA', 'INTL', 'INTERNAL'],

  customStyles,
}) => {

  const {
    selectedCustomerNames,
    selectedRegions,

    handleCarrierToggle,
    handleCountryToggle,
    handleDailyToggle,
    isCarrier,
    isCountry,
    isDaily,
    dateRange,
    handleApplyFilter,
    handleSelectCustomerNames,
    handleSelectRegions,

    handleDateRangeChange,
    setApiCallToggle,
  } = useOrdersDashboardData();
  const selectAllOption = { value: 'select-all', label: 'Select All' };



  const handleSelectAllChange = (
    selectedOptions: MultiValue<OptionType>,
    options: OptionType[],
    handler: (selected: MultiValue<OptionType>) => void
  ) => {
    const isSelectAllSelected = selectedOptions.some(option => option.value === 'select-all');
    const areAllOptionsSelected = selectedOptions.length === options.length + 1;

    if (isSelectAllSelected) {
      if (areAllOptionsSelected) {
        handler([]);
      } else {
        handler([selectAllOption, ...options]);
      }
    } else {
      handler(selectedOptions.filter(option => option.value !== 'select-all'));
    }
  };

  const getSelectedOptions = (
    selectedOptions: MultiValue<OptionType>,
    options: OptionType[]
  ): MultiValue<OptionType> => {
    const allSelected = selectedOptions.length === options.length;
    if (allSelected && !selectedOptions.some(option => option.value === 'select-all')) {
      return [selectAllOption, ...options];
    }
    if (!allSelected && selectedOptions.some(option => option.value === 'select-all')) {
      return selectedOptions.filter(option => option.value !== 'select-all');
    }
    return selectedOptions;
  };

  return (
    <>
      <Row className="sub-row" md={12}>
        <Form.Label>Date Range</Form.Label>
        <MyDateRangePicker dateRange={dateRange} handleDateRangeChange={handleDateRangeChange} setApiCallToggle={setApiCallToggle} />
      </Row>
      <Row className="sub-row" md={12}>
        <Form.Group>
          <Form.Label>Customer Names</Form.Label>
          <Select
            isMulti
            options={[selectAllOption, ...customerNamesOptions]}
            value={getSelectedOptions(selectedCustomerNames, customerNamesOptions)}
            onChange={(selectedOptions) => handleSelectAllChange(selectedOptions, customerNamesOptions, handleSelectCustomerNames)}
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
            components={{ Option: CustomOption, MultiValue: MultiValueComponent }}
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
                disabled= {isCarrier}
                key={region}
                label={region}
                value={region}
                checked={isCarrier ? true :selectedRegions.includes(region)}
                onChange={() => handleSelectRegions(region)}
              />
            ))}
          </div>
        </Form.Group>
      </Row>
      <Row className="sub-row" md={12}>
        <Col>
        <Form.Group>
          <div className="inline-checkbox">
              <Form.Check
                type="switch"
                label="By Carrier"
                checked={isCarrier}
                onChange={() => handleCarrierToggle(!isCarrier)}
              />
          </div>
        </Form.Group>
        </Col>
        <Col>
        <Form.Group>
          <div className="inline-checkbox">
              <Form.Check
                type="switch"
                label="Daily"
                checked={isDaily}
                onChange={() => handleDailyToggle(!isDaily)}
              />
          </div>
        </Form.Group>
        </Col>

      </Row>
      <Row className="sub-row" md={12}>
        <Form.Group>
          <div className="inline-checkbox">
              <Form.Check
                type="switch"
                label="by Country"
                checked={isCountry}
                onChange={() => handleCountryToggle(!isCountry)}
              />
          </div>
        </Form.Group>
        </Row>
      {/* <Row className="sub-row" md={12}>
        <Form.Group>
          <Form.Label>Country</Form.Label>
          <Select
            isMulti
            options={[selectAllOption, ...countryOptions]}
            value={getSelectedOptions(selectedCountries, countryOptions)}
            onChange={(selectedOptions) => handleSelectAllChange(selectedOptions, countryOptions, handleSelectCountries)}
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
            components={{ Option: CustomOption, MultiValue: MultiValueComponent }}
            styles={customStyles}
          />
        </Form.Group>
      </Row>
      <Row className="sub-row" md={12}>
        <Form.Group>
          <Form.Label>State</Form.Label>
          <Select
            isMulti
            options={[selectAllOption, ...stateOptions]}
            value={getSelectedOptions(selectedStates, stateOptions)}
            onChange={(selectedOptions) => handleSelectAllChange(selectedOptions, stateOptions, handleSelectStates)}
            hideSelectedOptions={false}
            closeMenuOnSelect={false}
            components={{ Option: CustomOption, MultiValue: MultiValueComponent }}
            styles={customStyles}
          />
        </Form.Group>
      </Row> */}
      <Row className="sub-row" md={12}>
        <Button onClick={handleApplyFilter} style={{ width: '50%', margin: '0 auto' }}>Apply Filter</Button>
      </Row>
    </>
  );
};

export default FilterComponent;
