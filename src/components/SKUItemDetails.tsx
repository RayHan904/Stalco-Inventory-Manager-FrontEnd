import React from 'react';
import { Col, Form, FormControl, ListGroup, Button } from 'react-bootstrap';
import Loader from './Loader';
import PieChartComponent from './PieChartComponent';
import { ReplenishmentData } from '../hooks/useReplenishment';


interface SKUItemDetailProps {
    selectedItem: string;
    details: Record<string, any>;
    isReplenishmentLoading: boolean;
    inputValue: string;
    setInputValue: (value: string) => void;
    errorMessage: string | null;
    handleThresholdButtonClick: () => void;
    SKUReplenishmentData?: ReplenishmentData | null
}

const SKUItemDetails: React.FC<SKUItemDetailProps> = ({
    selectedItem,
    details,
    isReplenishmentLoading,
    inputValue,
    setInputValue,
    errorMessage,
    handleThresholdButtonClick,
    SKUReplenishmentData
}) => {
    let claysonData: number = 0;
    let whlData: number = 0;

    const detailItems = details[selectedItem] ? Object.entries(details[selectedItem]) : [];
    detailItems.forEach(([key, value]) => {
        if (typeof value === 'number') {
            if (key === 'Clayson') {
                claysonData = value;
            } else {
                whlData = value;
            }
        }
    });

    return (
        <Col lg={9} md={8} sm={6} xs={12} style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div>
                {selectedItem ? (
                    <div className="mb-2" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: "space-between" }}>
                        <div>
                            <h2>{selectedItem}</h2>
                            <ListGroup>
                                {detailItems.map(([key, value]) => (
                                    <ListGroup.Item key={key}>
                                        {key}: {formatValueForDisplay(value)}
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item>
                                    Clayson's Percentage: {calculatePercentage(claysonData, claysonData + whlData).toFixed(2)}%
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    WHL's Percentage: {calculatePercentage(whlData, claysonData + whlData).toFixed(2)}%
                                </ListGroup.Item>
                            </ListGroup>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                            {isReplenishmentLoading ? (
                                <div className='m-4'><Loader dims={50} /></div>
                            ) : (
                                <Form className="p-3">
                                    <Form.Group controlId="thresholdInput">
                                        <Form.Label>Threshold</Form.Label>
                                        <FormControl
                                            placeholder={SKUReplenishmentData?.threshold?.toString() || "Enter a number"}
                                            aria-label="Item Threshold"
                                            value={inputValue}
                                            onChange={(e) => setInputValue(e.target.value)}
                                            className={errorMessage ? 'is-invalid' : ''} 
                                        />
                                        {errorMessage && <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>}
                                        <Button variant="primary" className="mt-2" onClick={handleThresholdButtonClick}>
                                            {SKUReplenishmentData ? "UPDATE" : "ADD"}
                                        </Button>
                                    </Form.Group>
                                </Form>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>Select an item to view details</p>
                )}
                {selectedItem && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        height: '30rem'
                    }}>
                        <PieChartComponent pieChartData={{ data: [claysonData, whlData] }} />
                    </div>
                )}
            </div>
        </Col>
    );
};

function formatValueForDisplay(value: unknown): React.ReactNode {
    if (typeof value === 'string' || typeof value === 'number') {
        return value;
    } else if (value === null || value === undefined) {
        return 'N/A';
    } else {
        return JSON.stringify(value); // Ensures that objects and arrays are displayed as strings
    }
}

function calculatePercentage(value: number, total: number): number {
    return (value / total) * 100;
}

export default SKUItemDetails;
