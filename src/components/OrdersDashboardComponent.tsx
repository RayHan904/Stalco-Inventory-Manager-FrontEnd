import React, { useState } from 'react';
import Select from 'react-select';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays } from 'date-fns';
import CheckboxOption from './CheckboxOption'; // Import the custom option component
import MultiValue from './MultiValue'; // Import the custom MultiValue component
import MyDateRangePicker from './DateRangePicker';

const OrdersDashboardComponent: React.FC = () => {
    const [selectedCustomerNames, setSelectedCustomerNames] = useState<any[]>([]);
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<any[]>([]);
    const [selectedStates, setSelectedStates] = useState<any[]>([]);
    const [dateRange, setDateRange] = useState<any>([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: 'selection',
        },
    ]);

    const customerNamesOptions = [
        { value: 'Biovation Labs, LLC', label: 'Biovation Labs, LLC' },
        { value: 'CK', label: 'Cuddle And Kind' },
        { value: 'Orbio', label: 'Orbio World' },
        { value: 'LUS', label: 'LUS' },
        { value: 'XYNG', label: 'Xyngular' },
        // Add more customer names here
    ];

    const regionsOptions = ['US', 'CA', 'INTL', 'INTERNAL'];

    const countryOptions = [
        { value: 'US', label: 'United States' },
        { value: 'CA', label: 'Canada' },
        { value: 'IND', label: 'India' },
        // Add more countries here
    ];

    const stateOptions = [
        { value: 'CA', label: 'California' },
        { value: 'ON', label: 'Ontario' },
        { value: 'HYD', label: 'Hyderabad' },
        // Add more states here
    ];

    const handleSelectCustomerNames = (selectedOptions: any) => {
        setSelectedCustomerNames(selectedOptions);
    };

    const handleSelectRegions = (region: string) => {
        setSelectedRegions((prev) =>
            prev.includes(region)
                ? prev.filter((r) => r !== region)
                : [...prev, region]
        );
    };

    const handleSelectCountries = (selectedOptions: any) => {
        setSelectedCountries(selectedOptions);
    };

    const handleSelectStates = (selectedOptions: any) => {
        setSelectedStates(selectedOptions);
    };

    const handleDateRangeChange = (ranges: any) => {
        setDateRange([ranges.selection]);
    };

    const customStyles = {
        multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: '#007bff', // Bootstrap primary blue
            color: 'white',
        }),
        multiValueLabel: (provided: any) => ({
            ...provided,
            color: 'white',
        }),
        multiValueRemove: (provided: any) => ({
            ...provided,
            color: 'white',
            ':hover': {
                backgroundColor: '#0056b3', // Bootstrap primary dark blue
                color: 'white',
            },
        }),
    };

    return (
        <Container>
            <Row>
                <Col md={3}>
                    <Row className="sub-row" md={12}>
                    <Form.Label>Date Range</Form.Label>
         <MyDateRangePicker/>
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
                                components={{ Option: CheckboxOption, MultiValue }}
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
                                components={{ Option: CheckboxOption, MultiValue }}
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
                                components={{ Option: CheckboxOption, MultiValue }}
                                styles={customStyles}
                            />
                        </Form.Group>
                    </Row>
                    <Row className="sub-row" md={12}>
                        <Button style={{width:'50%', margin:'0 auto'}}>Apply Filter</Button>
                    </Row>
                </Col>
                <Col md={9}>
                    <h1>Chart Component</h1>
                    {/* Add your chart component here */}
                </Col>
            </Row>
        </Container>
    );
};

export default OrdersDashboardComponent;
