import React from "react";
import { ListGroup, Form, FormControl, Button } from "react-bootstrap";
import Loader from "./Loader";
import PieChartComponent from "./PieChartComponent";
import { ReplenishmentData } from "../hooks/useReplenishment";
import { SKUInfoData } from "../services/api";

interface SKUDetailProps {
  selectedItem: string;
  details: { [key: string]: number };
  claysonData: number;
  whlData: number;
  thresholdFieldValue: string;
  qtyPerPalletFieldValue: string;
  errMsgThreshold: string;
  errMsgQtyPerPallet: string;
  isReplenishmentLoading: boolean;
  isSkuInfoLoading: boolean;
  SKUReplenishmentData: ReplenishmentData | null;
  selectedSkuInfoData: SKUInfoData | null;
  onThresholdChange: (value: string) => void;
  onQtyPerPalletChange: (value: string) => void;
  onThresholdSubmit: () => void;
  onQtyPerPalletSubmit: () => void;
}

const SKUDetail: React.FC<SKUDetailProps> = ({
  selectedItem,
  details,
  claysonData,
  whlData,
  thresholdFieldValue,
  qtyPerPalletFieldValue,
  errMsgThreshold,
  errMsgQtyPerPallet,
  isReplenishmentLoading,
  isSkuInfoLoading,
  SKUReplenishmentData,
  selectedSkuInfoData,
  onThresholdChange,
  onQtyPerPalletChange,
  onThresholdSubmit,
  onQtyPerPalletSubmit,
}) => {
  return (
    <div>
      <div className="mb-2" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
        <div>
          <h2>{selectedItem}</h2>
          <ListGroup>
            {Object.entries(details).map(([key, value]) => (
              <ListGroup.Item key={key}>
                {key}: {typeof value === "number" ? value.toLocaleString() : value}
              </ListGroup.Item>
            ))}
            <>
              <ListGroup.Item>
                Clayson's Percentage: {((claysonData / (claysonData + whlData)) * 100).toFixed(2)}%
              </ListGroup.Item>
              <ListGroup.Item>
                WHL's Percentage: {((whlData / (claysonData + whlData)) * 100).toFixed(2)}%
              </ListGroup.Item>
            </>
          </ListGroup>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
          {isReplenishmentLoading ? (
            <div className="m-4">
              <Loader dims={50} />
            </div>
          ) : (
            <Form className="p-3">
              <Form.Group controlId="thresholdInput">
                <Form.Label>Threshold</Form.Label>
                <FormControl
                  placeholder={SKUReplenishmentData?.threshold?.toString() || "Enter threshold value"}
                  aria-label="Item Threshold"
                  value={thresholdFieldValue}
                  onChange={(e) => onThresholdChange(e.target.value)}
                  className={errMsgThreshold ? "is-invalid" : ""}
                />
                {errMsgThreshold && (
                  <Form.Control.Feedback type="invalid">{errMsgThreshold}</Form.Control.Feedback>
                )}
                <Button variant="primary" className="mt-2" onClick={onThresholdSubmit}>
                  {SKUReplenishmentData ? "UPDATE" : "ADD"}
                </Button>
              </Form.Group>
            </Form>
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
          {isSkuInfoLoading ? (
            <div className="m-4">
              <Loader dims={50} />
            </div>
          ) : (
            <Form className="p-3">
              <Form.Group controlId="qtyPerPalletInput">
                <Form.Label>Qty per Pallet</Form.Label>
                <FormControl
                  placeholder={selectedSkuInfoData?.qtyPerPallet?.toString() || "Enter Qty per pallet"}
                  aria-label="Qty per pallet"
                  value={qtyPerPalletFieldValue}
                  onChange={(e) => onQtyPerPalletChange(e.target.value)}
                  className={errMsgQtyPerPallet ? "is-invalid" : ""}
                />
                {errMsgQtyPerPallet && (
                  <Form.Control.Feedback type="invalid">{errMsgQtyPerPallet}</Form.Control.Feedback>
                )}
                <Button variant="primary" className="mt-2" onClick={onQtyPerPalletSubmit}>
                  {selectedSkuInfoData ? "UPDATE" : "ADD"}
                </Button>
              </Form.Group>
            </Form>
          )}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", height: "30rem" }}>
        <PieChartComponent pieChartData={{ data: [claysonData, whlData] }} />
      </div>
    </div>
  );
};

export default SKUDetail;
