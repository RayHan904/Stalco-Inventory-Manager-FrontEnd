import React from "react";
import { ListGroup, InputGroup, FormControl } from "react-bootstrap";
import { BsX } from "react-icons/bs";
import Loader from "../layout/Loader";

interface SKUListProps {
  items: string[];
  selectedItem: string;
  searchTerm: string;
  isLoading: boolean;
  listShow: boolean;
  onSelect: (item: string) => void;
  setListShow: (item: boolean) => void;
  onSearch: (term: string) => void;
  onClearSearch: () => void;
}

const SKUList: React.FC<SKUListProps> = ({
  items,
  selectedItem,
  searchTerm,
  isLoading,
  listShow,
  setListShow,
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
          onFocus={() => setListShow(true)}
          onChange={(e) => {
            onSearch(e.target.value);
            setListShow(true);
          }}
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
            height: window.innerWidth <= 768 ? (listShow ? "30vh" : 0) : "100%",
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
