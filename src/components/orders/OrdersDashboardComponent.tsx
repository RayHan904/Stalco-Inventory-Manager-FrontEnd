import React, { useEffect } from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
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
export interface regionShipped {
    client_id: string;
    date: string;
    total_orders: number;
    country: string;
    state_province: string;
}
export interface regionShipped {
    client_id: string;
    date: string;
    total_orders: number;
    country: string;
    state_province: string;
}

export interface Dataset {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    hoverBackgroundColor: string;
    borderWidth: number;
}

export interface DynamicData {
    totalOrders? :number,
    totalUs? :number,
    totalCa? :number,
    totalInternal? :number,
    totalIntl? :number,
    overallAvgQtyPerOrder? :number ,
    labels: string[];
    datasets: Dataset[];
}
export interface ByCarrierDynamicData {
    totalOrders? :number,
    totalUSPS? :number,
    totalDHL? :number,
    totalCP? :number,
    totalFEDEX? :number,
    totalUPS? :number,
    totalOthers? :number,
    overallAvgQtyPerOrder? :number ,
    labels: string[];
    datasets: Dataset[];
}

export interface Top10BarChartData {
    labels: string[];
    title: string;
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
    borderWidth: number;
    indexAxis: string;
    height: string;
    minHeight?: string;
}
export interface top10CountriesData {
    labels: string[];
    title: string;
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
    borderWidth: number;
    indexAxis: string;
    height: string;
    minHeight?: string;
}
export interface top10StatesData {
    labels: string[];
    title: string;
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
    borderWidth: number;
    indexAxis: string;
    height: string;
    minHeight?: string;
}

export interface WHLvsClaysonData {
    labels: string[];
    title: string;
    data: number[];
    minHeight: string;
}
export interface WhiteLabelData {
    labels: string[];
    title: string;
    data: number[];
}

const OrdersDashboardComponent: React.FC = () => {

    const {
        dynamicData,
        byCarrierDynamicData,
        top10OrdersConfimredByCustomer,
        countryShipped,
        stateShipped,
        displayCarriersInfo,
        isDisplayByCountry,
        WHLvsClaysonData,
        WhiteLabelData,
        isFilterdOrdersDataLoading,
        ordersData, 
        isOrdersDataLoading

      } = useOrdersDashboardData();





  useEffect(() => {

}, [ordersData]);
    

    const Top10BarchartData = {
        labels: top10OrdersConfimredByCustomer? top10OrdersConfimredByCustomer.labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        title: top10OrdersConfimredByCustomer? top10OrdersConfimredByCustomer.title : "# of orders",
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
    const Top10CountriesData = {
        labels: countryShipped? countryShipped.labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        title: countryShipped? countryShipped.title : "# of orders",
        data: countryShipped? countryShipped.data: [130, 190, 183, 139, 149, 230, 173, 149, 210, 170],
        backgroundColor: [
             '#FFCE56'
        ],
        hoverBackgroundColor: [ '#d4b446',
           
        ],
        borderWidth: 1,
        indexAxis: 'y',
        height: '20rem'
    }
    const Top10StatesData = {
        labels: stateShipped? stateShipped.labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        title: stateShipped? stateShipped.title : "# of orders",
        data: stateShipped? stateShipped.data: [130, 190, 183, 139, 149, 230, 173, 149, 210, 170],
        backgroundColor: [
            '#FF9F40'
       ],
       hoverBackgroundColor: [ '#d48136',
          
       ],
        borderWidth: 1,
        indexAxis: 'y',
        height: '20rem'
    }


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
    const isLoading = isOrdersDataLoading || isFilterdOrdersDataLoading;
    const dataToShow = displayCarriersInfo ? byCarrierDynamicData : dynamicData;
    const shouldShowLineChart = dataToShow && dataToShow.labels && dataToShow.labels.length >= 32;

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
    <Row className="sub-row" md={12}>
    <ListGroup>
    <ListGroup.Item>
      Total Inventory Sold: 
    </ListGroup.Item>
    <ListGroup.Item>
      Average Units per Order:  {dynamicData ? dynamicData.overallAvgQtyPerOrder?.toFixed(2) : "-"}
    </ListGroup.Item>
    </ListGroup>
    </Row>
</Col>




<Col xs={12} md={9}>
            {isLoading ? (
                <div><Loader dims={75} /></div>
            ) : shouldShowLineChart && dataToShow ? (
                <LineChartComponent lineChart={dataToShow} />
            ) : dataToShow ? (
                <StackedBarChartComponent stackedBarChart={dataToShow} />
            ) : null}
        </Col>
            </Row>
 {!displayCarriersInfo ? <Row style={{ display: 'flex', justifyContent: 'space-between', margin:"1rem 0" }}>
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
            </Row> : <Row style={{ display: 'flex', justifyContent: 'space-between', margin:"1rem 0" }}>
                <Col xs={6} md={2} >
                    <InfoCardComponent cardTitle='Total Orders' text={byCarrierDynamicData ? byCarrierDynamicData.totalOrders : "-"} width='100%' />
                </Col>
                <Col xs={6} md={2}>
                    <InfoCardComponent cardTitle='USPS' text={byCarrierDynamicData ? byCarrierDynamicData.totalUSPS : "-"} width='100%' />
                </Col>
                <Col xs={6} md={2}>
                    <InfoCardComponent cardTitle='DHL' text={byCarrierDynamicData ? byCarrierDynamicData.totalDHL : "-"} width='100%' />
                </Col>
                <Col xs={6} md={2}>
                    <InfoCardComponent cardTitle='Canada Post ' text={byCarrierDynamicData ? byCarrierDynamicData.totalCP : "-"} width='100%' />
                </Col>
                <Col xs={6} md={2}>
                    <InfoCardComponent cardTitle='Others ' text={byCarrierDynamicData ? ((byCarrierDynamicData.totalFEDEX ?? 0) + (byCarrierDynamicData.totalOthers ?? 0) + (byCarrierDynamicData.totalUPS ?? 0)) : "-"} width='100%' />
                </Col>
            </Row> }
            
            <hr />
            <Row className="custom-row">
                <Col xs={12} sm={6} md={4} lg={3} className="custom-col">

                    {
                        isOrdersDataLoading || isFilterdOrdersDataLoading? <Loader dims={50}/> : <BarChartComponent barChartData={Top10BarchartData ? Top10BarchartData : {}} dataLabel={dataLabelTop10} isArranged={isArranged} truncateLabels={true} />
                    }
                    
                </Col>
                <Col xs={12} sm={6} md={4} lg={3} className="custom-col">
                    {
                        isOrdersDataLoading || isFilterdOrdersDataLoading? <Loader dims={50}/> : <DoughnutChartComponent doughnutChartData={WhiteLabelData ? WhiteLabelData : {}} />
                    }
                </Col>
                <Col xs={12} sm={6} md={4} lg={3} className="custom-col">
                    {
                        isOrdersDataLoading || isFilterdOrdersDataLoading? <Loader dims={50}/> : <BarChartComponent barChartData={WHLvsClaysonData ? WHLvsClaysonData : {}}  />
                    }
                </Col>
                {/* <Col xs={12} sm={6} md={4} lg={3} className="custom-col">

                    {
                        isOrdersDataLoading || isFilterdOrdersDataLoading? <Loader dims={50}/> : <BarChartComponent barChartData={Top10CountriesData ? Top10CountriesData : {}} dataLabel={dataLabelTop10} isArranged={isArranged} />
                    }
                    
                </Col> */}
                <Col xs={12} sm={6} md={4} lg={3} className="custom-col">
                    {
                        isOrdersDataLoading || isFilterdOrdersDataLoading? <Loader dims={50}/> : <BarChartComponent barChartData={isDisplayByCountry ? Top10CountriesData : Top10StatesData} dataLabel={dataLabelTop10} isArranged={isArranged} />
                    }
                    
                </Col>
            </Row>

        </Container>
    );
};

export default OrdersDashboardComponent;
