import React, { useState } from 'react';
import Select from 'react-select';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays } from 'date-fns';
import CheckboxOption from './CheckboxOption'; // Import the custom option component
import MultiValue from './MultiValue'; // Import the custom MultiValue component
import MyDateRangePicker from './DateRangePicker';
import StackedBarChartComponent from '../charts/StackedBarChartComponent';
import LineChartComponent from '../charts/LineChartComponent';
// import MapChart from './MapChart';

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

    // const dynamicData = {
    //     labels: [
    //       '2024-06-1', '2024-06-2', '2024-06-3', '2024-06-4', '2024-06-5', '2024-06-6', '2024-06-7', '2024-06-8', '2024-06-9', '2024-06-10',
    //       '2024-06-11', '2024-06-12', '2024-06-13', '2024-06-14', '2024-06-15', '2024-06-16', '2024-06-17', '2024-06-18', '2024-06-19', '2024-06-20',
    //       '2024-06-21', '2024-06-22', '2024-06-23', '2024-06-24', '2024-06-25', '2024-06-26', '2024-06-27', '2024-06-28', '2024-06-29', '2024-06-30'
    //     ],
    //     datasets: [
    //       {
    //         label: "# of units (US)",
    //         data: [
    //           10, 20, 30, 40, 50, 90, 45, 60, 70, 80,
    //           15, 25, 35, 45, 55, 95, 50, 65, 75, 85,
    //           12, 22, 32, 42, 52, 92, 47, 67, 77, 87
    //         ],
    //         backgroundColor: '#FF6384',
    //         hoverBackgroundColor: '#d35671',
    //         borderWidth: 1,
    //       },
    //       {
    //         label: "# of units (CA)",
    //         data: [
    //           20, 30, 40, 50, 200, 100, 25, 70, 80, 90,
    //           30, 40, 50, 60, 210, 110, 30, 75, 85, 95,
    //           25, 35, 45, 55, 205, 105, 27, 72, 82, 92
    //         ],
    //         backgroundColor: '#36A2EB',
    //         hoverBackgroundColor: '#2d8ccd',
    //         borderWidth: 1,
    //       },
    //       {
    //         label: "# of units (INTL)",
    //         data: [
    //           30, 40, 50, 60, 100, 150, 22, 80, 90, 100,
    //           40, 50, 60, 70, 110, 160, 32, 85, 95, 105,
    //           35, 45, 55, 65, 105, 155, 27, 87, 97, 107
    //         ],
    //         backgroundColor: '#FFCE56',
    //         hoverBackgroundColor: '#e6b453',
    //         borderWidth: 1,
    //       },
    //       {
    //         label: "# of units (Internal)",
    //         data: [
    //           40, 50, 60, 70, 0, 34, 98, 90, 100, 110,
    //           50, 60, 70, 80, 10, 44, 108, 95, 105, 115,
    //           45, 55, 65, 75, 5, 39, 103, 97, 107, 117
    //         ],
    //         backgroundColor: '#4BC0C0',
    //         hoverBackgroundColor: '#3ba3a3',
    //         borderWidth: 1,
    //       }
    //     ],
    //   };
      
    const getRandomValue = () => Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;

      const dynamicData = {
        labels: Array.from({ length: 100 }, (_, index) => `Q${index + 1}`),
        datasets: [
          {
            label: "# of units (US)",
            data: Array.from({ length: 100 }, () => getRandomValue()),
            backgroundColor: '#FF6384',
            hoverBackgroundColor: '#d35671',
            borderWidth: 3,
          },
          {
            label: "# of units (CA)",
            data: Array.from({ length: 100 }, () => getRandomValue()),
            backgroundColor: '#36A2EB',
            hoverBackgroundColor: '#2d8ccd',
            borderWidth: 3,
          },
          {
            label: "# of units (INTL)",
            data: Array.from({ length: 100 }, (_, index) => (index + 1) * 7),
            backgroundColor: '#FFCE56',
            hoverBackgroundColor: '#e6b453',
            borderWidth: 3,
          },
          {
            label: "# of units (Internal)",
            data: Array.from({ length: 100 }, () => getRandomValue()),
            backgroundColor: '#4BC0C0',
            hoverBackgroundColor: '#3ba3a3',
            borderWidth: 3,
          }
        ],
      };
      const mapData = [
        { id: "California", value: 100 },
        { id: "New York", value: 75 },
        { id: "Texas", value: 50 },
        // Add more states/provinces
      ];
      
      // Example output of dynamicData for visualization:
      console.log(dynamicData);
      
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
             
                    {dynamicData.labels.length >= 45 ?  <LineChartComponent lineChart={dynamicData} /> : <StackedBarChartComponent stackedBarChart={dynamicData} />}
               
                </Col>
            </Row>
            <hr/>
            <Row>
                <Col>
                {/* <MapChart  /> */}
                </Col>
            </Row>
        </Container>
    );
};

export default OrdersDashboardComponent;
