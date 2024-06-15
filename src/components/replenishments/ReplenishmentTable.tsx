import React from 'react';
import { Table } from 'react-bootstrap';
import { ReplenishmentData } from '../../hooks/useReplenishment';



interface ReplenishmentTableProps {
  replenishmentData: ReplenishmentData[];
}

const ReplenishmentTable: React.FC<ReplenishmentTableProps> = ({ replenishmentData }) => (
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>Client Name</th>
        <th>SKU</th>
        <th>Threshold</th>
        <th>Quantity to Replenish</th>
      </tr>
    </thead>
    <tbody>
      {replenishmentData.map((item, index) => (
        <tr key={index}>
          <td>{item.clientName}</td>
          <td>{item.sku}</td>
          <td>{item.threshold}</td>
          <td>{item.qtyToReplenish}</td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default ReplenishmentTable;
