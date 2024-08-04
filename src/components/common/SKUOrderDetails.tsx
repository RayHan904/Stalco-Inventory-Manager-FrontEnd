import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import Loader from "../layout/Loader";
import useLoading from "../../hooks/useLoading";
import { FilteredData, SkuSales, filterSKUOrderDetails, filterSKUOrderDetailsByWeek } from "../../utils/dataTransformationsByClient";
import LineChartComponent from "../charts/LineChartComponent";
import { DateRange } from "react-date-range";
import { useOrdersByClientDashboardData } from "../../contexts/OrdersByClientDashboardDataContext";
import DoubleBarChartComponent from "../charts/DoubleBarChartComponent";
import { Form } from 'react-bootstrap';


interface SKUOrderDetailsProps {
  selectedItem: string;
  details: SkuSales[];
  dateRange: DateRange
}

const SKUOrderDetails: React.FC<SKUOrderDetailsProps> = ({
  selectedItem,
  details,
dateRange,
}) => {
  const {isFilterdOrdersDataLoading, ordersByClientData } = useOrdersByClientDashboardData()

  const { isLoading, startLoading, stopLoading } = useLoading(); //while loading inventoryData
 const [ filteredDetails, setFilteredDetails] = useState<FilteredData | null>();
 const [showDaily, setShowDaily] = useState<boolean>(false); // for toggling between top10 units and orders 


 
 const dataToShow = {
   labels: filteredDetails?.dates ?? [""],
   datasets: [
     {
       label: "# of Orders",
       data: filteredDetails?.totalOrders ?? [0],
       backgroundColor: '#FF9F40',
       borderColor: '#FF9F40',
       hoverBackgroundColor: '#d48136',
       borderWidth: 2,
      },
      {
        label: "# of units",
        data: filteredDetails?.totalUnits ?? [0],
        backgroundColor: '#9966FF',
        borderColor: '#9966FF',
        hoverBackgroundColor: '#7d5fcc',
        borderWidth: 2,
      }]
    }
    
    
    const shouldShowLineChart = dataToShow && dataToShow.labels && dataToShow.labels.length >= 20;
    
 useEffect(() => {
    const asyncFilter = async () => {
      startLoading();
        const result = ordersByClientData &&  (showDaily? filterSKUOrderDetails(details, dateRange.startDate.toString(), dateRange.endDate.toString(),selectedItem) : filterSKUOrderDetailsByWeek(details, dateRange.startDate.toString(), dateRange.endDate.toString(),selectedItem));
        setFilteredDetails(result);
        stopLoading();
    };

    asyncFilter();
}, [selectedItem,showDaily ]);
    
  return (
    <div>
      <div className="mb-2" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between" }}>
        <div>
          <h2>{selectedItem}</h2>
          <ListGroup>

    <ListGroup.Item>
      Total Orders: {filteredDetails && filteredDetails.summary.totalOrders }
    </ListGroup.Item>
    <ListGroup.Item>
  Average units per Order: {filteredDetails && filteredDetails.summary.avgUnitsPerOrder.toFixed(2)}
</ListGroup.Item>
    <ListGroup.Item>
      Total Units Processed: {filteredDetails && filteredDetails.summary.totalUnits }
    </ListGroup.Item>
    {filteredDetails?.summary.retailer &&     <ListGroup.Item>
      Retailer: {filteredDetails && filteredDetails.summary.retailer }
    </ListGroup.Item>}

</ListGroup>

        </div>
      </div>
      {isLoading && isFilterdOrdersDataLoading  ? <Loader/> : <>
                  <Form.Group>
                        <div className="inline-checkbox">
                          <Form.Check
                            type="switch"
                            label="Daily"
                            checked={showDaily}
                            onChange={() => setShowDaily(!showDaily)}
                          />
                        </div>
                      </Form.Group>
            <div style={{ display: "flex", justifyContent: "center", height: "30rem" }}>
                      {isLoading && isFilterdOrdersDataLoading ? (
                <div><Loader dims={75} /></div>
            ) : shouldShowLineChart && dataToShow ? (
                <LineChartComponent lineChart={dataToShow} />
            ) : dataToShow ? (
                <DoubleBarChartComponent doubleBarChart={dataToShow} />
            ) : null}

          </div>
    </>

      }

    </div>
  );
};

export default SKUOrderDetails;
