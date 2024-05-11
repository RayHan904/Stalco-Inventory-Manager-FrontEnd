import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, InputGroup, FormControl, Form, Button } from 'react-bootstrap';
import { BsX } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useSelectedCustomer } from '../contexts/SelectedCustomerContext';
import { useLoading } from '../contexts/LoadingContext';
import { addSKUReplenishment, fetchInventory, updateSKUReplenishment, deleteSKUReplenishment } from "../services/api";

import PieChartComponent from '../components/PieChartComponent';
import BarChartComponent from '../components/BarChartComponent';
import Loader from '../components/Loader';
import InventorySummary from '../components/InventorySummary';
import useReplenishment, { ReplenishmentData } from '../hooks/useReplenishment';
import { validateThreshold } from '../validations/thresholdValidations';
import SKUItems from '../components/SKUItems';
import SKUItemDetails from '../components/SKUItemDetails';

const CustomerDashboard: React.FC = () => {
    const { selectedCustomer } = useSelectedCustomer();
    const { isLoading, startLoading, stopLoading } = useLoading();
    const [inventoryData, setInventoryData] = useState<{ summary: { [key: string]: number }, detail: { [key: string]: { [key: string]: number } } } | null>(null);
    const [selectedItem, setSelectedItem] = useState<string>("");  //selected SKU from the list
    const [SKUReplenishmentData, setSKUReplenishmentData] = useState<ReplenishmentData | null>(null); //replenishment data of selected SKU.
    const [searchTerm, setSearchTerm] = useState<string>('');  // Searching from list of SKUs
    const [inputValue, setInputValue] = useState<string >('');  //Threshold value
    const [errorMessage, setErrorMessage] = useState(""); //for input validation


    const { replenishmentData, isReplenishmentLoading,  setReplenishmentData } = useReplenishment();

    const navigate = useNavigate();

    const validateAndFormatData = () => {
        const validationError = validateThreshold(inputValue.toString());
        if (validationError) {
            setErrorMessage(validationError);
            return null;
        } else {
            setErrorMessage("")
        }
    
        if (!selectedItem || !selectedCustomer) {
            console.error('Error: Selected item or customer is null or undefined.');
            return null;
        }
    
        return {
            sku: selectedItem,
            clientId: selectedCustomer.customerId.toString(),
            clientName: selectedCustomer.companyName.toString(),
            threshold: inputValue
        };
    };
    
    const updateReplenishmentData = async () => {
        // Retrieve current threshold for the selected item
        const currentItem = replenishmentData?.find(d => d.sku === selectedItem);
    
        // Check if inputValue is the same as the current threshold
        if (currentItem?.threshold === inputValue) {
            toast.info('No changes detected in SKU Threshold.');
            return; // Exit if the current threshold is the same as the input value
        }
    
        // Proceed with deletion or update based on the inputValue
        if (parseInt(inputValue) === 0) {
            await deleteSKUReplenishment(selectedItem);
            toast.success('SKU Threshold deleted successfully.');
            setReplenishmentData(prevData => prevData?.filter(d => d.sku !== selectedItem) || null);
            setSKUReplenishmentData(null);
            setInputValue("");
        } else {
            await updateSKUReplenishment(selectedItem, inputValue);
            toast.success('SKU Threshold updated successfully.');
            setReplenishmentData(prevData =>
                prevData?.map(d => d.sku === selectedItem ? { ...d, threshold: inputValue } : d) || null
            );
        }
    };
    
    
    const addReplenishmentData = async (data: ReplenishmentData) => {
        await addSKUReplenishment(data);
        toast.success('New SKU Threshold added successfully.');
        setReplenishmentData(prevData => prevData ? [...prevData, data] : [data]);
        setSKUReplenishmentData(data);
    };
    

    const handleThresholdButtonClick = async () => {
        const data = validateAndFormatData();
        if (!data) return;
    
        try {
            if (SKUReplenishmentData) {
                await updateReplenishmentData();
            } else {
                await addReplenishmentData(data);
            }
        } catch (error) {
            console.error('Error occurred:', error);
            toast.error("Error occurred");
        }
    };
    

    const handleSKUSelect = (item: string): void => {
        setSelectedItem(item);
        setErrorMessage("")
        setInputValue("")
        if (replenishmentData) {
            const filteredSKUData: ReplenishmentData | null = replenishmentData.find(data => data.sku === item) || null;
            setSKUReplenishmentData(filteredSKUData);
           if(filteredSKUData) setInputValue(filteredSKUData?.threshold.toString())
            console.log(SKUReplenishmentData)
        }

    };

    useEffect(() => {
        const fetchData = async () => {
            startLoading();
            try {
                const data = await fetchInventory(selectedCustomer?.customerId);
                setInventoryData(data);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Error fetching data:")
                navigate("/")
            } finally {
                stopLoading();
            }
        };
        fetchData();
    }, [selectedCustomer]);

    const details = inventoryData?.detail || {};
    const summary = inventoryData?.summary || {};

    const filteredItems = Object.keys(details).filter(item =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const clearSearch = () => {
        setSearchTerm('');
    };

    const claysonCount = summary.Clayson || 0;
    const whlCount = summary.WHL || 0;

    let claysonData = 0;
    let whlData = 0;

    const barChartData = {
        data: [claysonCount, whlCount],
    };
    return (
        <Container fluid style={{ minHeight: '85vh' }}>

            <Row style={{ height: '30vh', overflowY: 'auto' }}>
                <h1>{selectedCustomer?.companyName}</h1>
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                        <Col md={6} sm={3}>
                            <InventorySummary summary={summary as { Total: number; Clayson: number; WHL: number; }} />
                        </Col>
                        <Col md={6} style={{ maxHeight: '24vh' }} >
                            <BarChartComponent barChartData={barChartData} />
                        </Col>
                    </>
                )}
            </Row>
            <hr />
            <Row>
                <SKUItems
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    clearSearch={clearSearch}
                    isLoading={isLoading}
                    filteredItems={filteredItems}
                    selectedItem={selectedItem}a
                    handleSKUSelect={handleSKUSelect}
                />
                <SKUItemDetails
                    selectedItem={selectedItem}
                    details={details}
                    isReplenishmentLoading={isReplenishmentLoading}
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    errorMessage={errorMessage}
                    handleThresholdButtonClick={handleThresholdButtonClick}
                    SKUReplenishmentData={null} // Example data
                />
            </Row>
        </Container>
    );
};

export default CustomerDashboard;
