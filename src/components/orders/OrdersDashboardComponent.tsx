import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { addDays } from 'date-fns';

import StackedBarChartComponent from '../charts/StackedBarChartComponent';
import LineChartComponent from '../charts/LineChartComponent';
import BarChartComponent from '../charts/BarChartComponent';
import DoughnutChartComponent from '../charts/DoughnutChartComponent';
import InfoCardComponent from '../common/InfoCardComponent';
import FilterComponent from './FilterComponent';
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

    const WHLvsClaysonData = {
        labels: ['Clayson', 'WHL'],
        label: '# of orders',
        data: [103000, 49000],
        minHeight: '20rem'
    };

    const RegionData = {
        labels: ['US', 'Canada', "INTL", "Internal"],
        label: '# of orders',
        backgroundColor: ['#FFCE56', '#4BC0C0', '#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#e6b453', '#3ba3a3', '#d35671', '#2d8ccd'],
        data: [103000, 49000, 500, 53],
        minHeight: '20rem'
    };

    const getRandomValue = () => Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000;

    const dynamicData = {
        labels: Array.from({ length: 30 }, (_, index) => `Q${index + 1}`),
        datasets: [

            {
                label: "# of units (Internal)",
                data: Array.from({ length: 30 }, () => getRandomValue()),
                backgroundColor: '#4BC0C0',
                hoverBackgroundColor: '#3ba3a3',
                borderWidth: 3,
            },
            {
                label: "# of units (INTL)",
                data: Array.from({ length: 30 }, (_, index) => (index + 1) * 7),
                backgroundColor: '#FFCE56',
                hoverBackgroundColor: '#e6b453',
                borderWidth: 3,
            },
            {
                label: "# of units (CA)",
                data: Array.from({ length: 30 }, () => getRandomValue()),
                backgroundColor: '#36A2EB',
                hoverBackgroundColor: '#2d8ccd',
                borderWidth: 3,
            },

            {
                label: "# of units (US)",
                data: Array.from({ length: 30 }, () => getRandomValue()),
                backgroundColor: '#FF6384',
                hoverBackgroundColor: '#d35671',
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
    const facilityOptions = ['Clayson', 'WHL'];

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


    const Top10BarchartData = {
        labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        label: "Top 10 - # of Orders Confirmed by Customer",
        data: [130, 190, 183, 139, 149, 230, 173, 149, 210, 170],
        backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40'
        ],
        hoverBackgroundColor: [
            '#d35671', '#2d8ccd', '#d4b446', '#3b9b9b', '#7d5fcc',
            '#d48136'
        ],
        borderWidth: 1,
        indexAxis: 'y',
        height: '20rem'
    }

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

    const dataLabelTop10 = true;

    const isArranged = true;
    return (
        <Container>

            <Row>
                <Col md={3}>
                    <FilterComponent
                        customerNamesOptions={customerNamesOptions}
                        selectedCustomerNames={selectedCustomerNames}
                        handleSelectCustomerNames={handleSelectCustomerNames}
                        regionsOptions={regionsOptions}
                        facilityOptions={facilityOptions}
                        selectedRegions={selectedRegions}
                        handleSelectRegions={handleSelectRegions}
                        countryOptions={countryOptions}
                        selectedCountries={selectedCountries}
                        handleSelectCountries={handleSelectCountries}
                        stateOptions={stateOptions}
                        selectedStates={selectedStates}
                        handleSelectStates={handleSelectStates}
                        customStyles={customStyles}
                    />
                </Col>


                <Col xs={12} md={9}>
                    {dynamicData.labels.length >= 45 ? (
                        <LineChartComponent lineChart={dynamicData} />
                    ) : (
                        <StackedBarChartComponent stackedBarChart={dynamicData} />
                    )}
                </Col>
            </Row>
            {/* 
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
                <Col xs={12} md={9}>
             
                    {dynamicData.labels.length >= 45 ?  <LineChartComponent lineChart={dynamicData} /> : <StackedBarChartComponent stackedBarChart={dynamicData} />}
               
                </Col>
            </Row> */}


            <Row style={{ display: 'flex', justifyContent: 'space-between', margin:"1rem 0" }}>
                <Col xs={6} md={2} >
                    <InfoCardComponent cardTitle='Total Orders' text='100,000' width='100%' />
                </Col>
                <Col xs={6} md={2}>
                    <InfoCardComponent cardTitle='US' text='65,000' width='100%' />
                </Col>
                <Col xs={6} md={2}>
                    <InfoCardComponent cardTitle='Canada' text='30,000' width='100%' />
                </Col>
                <Col xs={6} md={2}>
                    <InfoCardComponent cardTitle='INTL ' text='4,000' width='100%' />
                </Col>
                <Col xs={6} md={2}>
                    <InfoCardComponent cardTitle='Internal ' text='1,000' width='100%' />
                </Col>
            </Row>
            <hr />
            <Row className="custom-row">
                <Col xs={12} sm={6} md={4} lg={3} className="custom-col">
                    <BarChartComponent barChartData={Top10BarchartData} dataLabel={dataLabelTop10} isArranged={isArranged} />
                </Col>
                <Col xs={12} sm={6} md={4} lg={3} className="custom-col">
                    <DoughnutChartComponent doughnutChartData={{ data: [1000, 150] }} />
                </Col>
                <Col xs={12} sm={6} md={4} lg={3} className="custom-col">
                    <BarChartComponent barChartData={WHLvsClaysonData} />
                </Col>
                <Col xs={12} sm={6} md={4} lg={3} className="custom-col">
                    <BarChartComponent barChartData={RegionData} />
                </Col>
            </Row>

        </Container>
    );
};

export default OrdersDashboardComponent;
