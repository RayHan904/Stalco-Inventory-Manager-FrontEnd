import React from "react";
import { ListGroup, InputGroup, FormControl } from "react-bootstrap";
import { BsX } from "react-icons/bs";
import Loader from "./Loader";

interface SKUListProps {
  items: string[];
  selectedItem: string;
  searchTerm: string;
  isLoading: boolean;
  onSelect: (item: string) => void;
  onSearch: (term: string) => void;
  onClearSearch: () => void;
}

const SKUList: React.FC<SKUListProps> = ({
  items,
  selectedItem,
  searchTerm,
  isLoading,
  onSelect,
  onSearch,
  onClearSearch,
}) => {
  return (
    <>
      <h2>SKUs</h2>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search..."
          value={searchTerm}
          onFocus={() => onSearch(searchTerm)}
          onChange={(e) => onSearch(e.target.value)}
        />
        <InputGroup.Text onClick={onClearSearch} style={{ cursor: "pointer" }}>
          <BsX />
        </InputGroup.Text>
      </InputGroup>
      {isLoading ? (
        <div className="m-5">
          <Loader />
        </div>
      ) : (
        <ListGroup
          style={{
            height: window.innerWidth <= 768 ? "30vh" : "100%",
            overflowY: "auto",
          }}
        >
          {items.map((item) => (
            <ListGroup.Item
              key={item}
              action
              active={selectedItem === item}
              onClick={() => onSelect(item)}
            >
              {item}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
};

export default SKUList;
