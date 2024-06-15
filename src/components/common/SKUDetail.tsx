import React from "react";
import { ListGroup } from "react-bootstrap";
import Loader from "../layout/Loader";
import PieChartComponent from "../charts/PieChartComponent";
import { ReplenishmentData } from "../../hooks/useReplenishment";
import { SKUInfoData } from "../../services/api";
import SKUDetailForm from "./SKUDetailForm";

interface SKUDetailProps {
  selectedItem: string;
  details: { [key: string]: number };
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


    
  let claysonData = 0;
  let whlData = 0;
  
  return (
    <div>
      <div className="mb-2" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
        <div>
          <h2>{selectedItem}</h2>
          <ListGroup>
  {Object.entries(details).map(([key, value]) => {
    if (key === "Clayson") {
      claysonData = value;
    } else {
      whlData = value;
    }
    return (
      <ListGroup.Item key={key}>
        {key}: {typeof value === "number" ? value.toLocaleString() : value}
      </ListGroup.Item>
    );
  })}
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
            <SKUDetailForm
              label="Threshold"
              placeholder="Enter threshold value"
              value={thresholdFieldValue}
              errorMessage={errMsgThreshold}
              onChange={onThresholdChange}
              onSubmit={onThresholdSubmit}
              buttonText={SKUReplenishmentData ? "UPDATE" : "ADD"}
            />
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
          {isSkuInfoLoading ? (
            <div className="m-4">
              <Loader dims={50} />
            </div>
          ) : (
            <SKUDetailForm
            label="Qty per Pallet"
            placeholder="Enter Qty per pallet"
            value={qtyPerPalletFieldValue}
            errorMessage={errMsgQtyPerPallet}
            onChange={onQtyPerPalletChange}
            onSubmit={onQtyPerPalletSubmit}
            buttonText={selectedSkuInfoData ? "UPDATE" : "ADD"}
          />
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
