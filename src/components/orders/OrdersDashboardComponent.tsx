import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import StackedBarChartComponent from '../charts/StackedBarChartComponent';
import LineChartComponent from '../charts/LineChartComponent';
import BarChartComponent from '../charts/BarChartComponent';
import DoughnutChartComponent from '../charts/DoughnutChartComponent';
import InfoCardComponent from '../common/InfoCardComponent';
import FilterComponent from './FilterComponent';
import { useOrdersDashboardData } from '../../contexts/OrdersDashboardDataContext';
import Loader from '../layout/Loader';
import useOrdersData from '../../hooks/useOrdersData';

export interface Order {
    client_id: string;
    date: string;
    total_orders: number;
    canada: number;
    us: number;
    intl: number;
    internal: number;
    usps: number; 
    dhl: number;
    fedex: number;
    ups: number;
    canada_post: number;
    other_carriers: number;
    avg_qty_per_order: string;
}

export interface Dataset {
    label: string;
    data: number[];
    backgroundColor: string;
    hoverBackgroundColor: string;
    borderWidth: number;
}

export interface DynamicData {
    totalOrders? :number,
    totalUs? :number,
    totalCa? :number,
    totalInternal? :number,
    totalIntl? :number,
    labels: string[];
    datasets: Dataset[];
}

export interface Top10BarChartData {
    labels: string[];
    label: string;
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
    borderWidth: number;
    indexAxis: string;
    height: string;
    minHeight?: string;
}

const OrdersDashboardComponent: React.FC = () => {

    const {
        dynamicData,
        top10OrdersConfimredByCustomer,
        isFilterdOrdersDataLoading,
        ordersData, 
        isOrdersDataLoading

      } = useOrdersDashboardData();

    const {  } = useOrdersData();




  useEffect(() => {

}, [ordersData]);
    




    const Top10BarchartData = {
        labels: top10OrdersConfimredByCustomer? top10OrdersConfimredByCustomer.labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        label: "Top 10 - # of Orders Confirmed by Customer",
        data: top10OrdersConfimredByCustomer? top10OrdersConfimredByCustomer.data: [130, 190, 183, 139, 149, 230, 173, 149, 210, 170],
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
console.log("TYPE of static!", Top10BarchartData)

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
        customerNamesOptions={ordersData?.dbData.filterOptions?.customerNameOptions }
        countryOptions={ordersData?.dbData.filterOptions?.countryOptions }
        stateOptions={ordersData?.dbData.filterOptions?.stateOptions }
        customStyles={customStyles}
    />
</Col>




<Col xs={12} md={9}>

    {isOrdersDataLoading || isFilterdOrdersDataLoading? <div><Loader dims={75}/> </div> : dynamicData && dynamicData.labels.length >= 31 ? (
        <LineChartComponent {...(dynamicData ? { lineChart: dynamicData } : {})} />
    ) : (
        <StackedBarChartComponent {...(dynamicData ? { stackedBarChart: dynamicData } : {})} />
    )}
</Col>
            </Row>

            <Row style={{ display: 'flex', justifyContent: 'space-between', margin:"1rem 0" }}>
                <Col xs={6} md={2} >
                    <InfoCardComponent cardTitle='Total Orders' text={dynamicData ? dynamicData.totalOrders : "-"} width='100%' />
                </Col>
                <Col xs={6} md={2}>
                    <InfoCardComponent cardTitle='US' text={dynamicData ? dynamicData.totalUs : "-"} width='100%' />
                </Col>
                <Col xs={6} md={2}>
                    <InfoCardComponent cardTitle='Canada' text={dynamicData ? dynamicData.totalCa : "-"} width='100%' />
                </Col>
                <Col xs={6} md={2}>
                    <InfoCardComponent cardTitle='INTL ' text={dynamicData ? dynamicData.totalIntl : "-"} width='100%' />
                </Col>
                <Col xs={6} md={2}>
                    <InfoCardComponent cardTitle='Internal ' text={dynamicData ? dynamicData.totalInternal : "-"} width='100%' />
                </Col>
            </Row>
            <hr />
            <Row className="custom-row">
                <Col xs={12} sm={6} md={4} lg={3} className="custom-col">

                    {
                        isOrdersDataLoading || isFilterdOrdersDataLoading? <Loader dims={50}/> : <BarChartComponent barChartData={Top10BarchartData ? Top10BarchartData : {}} dataLabel={dataLabelTop10} isArranged={isArranged} />
                    }
                    
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
