import React from 'react';
import { Col, InputGroup, FormControl, ListGroup } from 'react-bootstrap';
import Loader from './Loader';
import { BsX } from 'react-icons/bs';
import './css/SKUItems.css';


interface SKUItemProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    clearSearch: () => void;
    isLoading: boolean;
    filteredItems: string[];
    selectedItem: string;
    handleSKUSelect: (item: string) => void;
}


const SKUItems: React.FC<SKUItemProps> = ({
    searchTerm,
    setSearchTerm,
    clearSearch,
    isLoading,
    filteredItems,
    selectedItem,
    handleSKUSelect
}) => {
    return (
        <Col lg={3} md={4} sm={6} xs={12} className="sku-items-container">
            <h2>SKUs</h2>
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <InputGroup.Text onClick={clearSearch} style={{ cursor: 'pointer' }}>
                    <BsX />
                </InputGroup.Text>
            </InputGroup>
            {isLoading ? (
                <div className="loader-container">
                    <Loader />
                </div>
            ) : (
                <ListGroup className="sku-list">
                    {filteredItems.map(item => (
                        <ListGroup.Item
                            key={item}
                            action
                            active={selectedItem === item}
                            onClick={() => handleSKUSelect(item)}
                        >
                            {item}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Col>
    );
};


export default SKUItems;