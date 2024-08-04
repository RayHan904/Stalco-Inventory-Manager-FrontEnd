import React from 'react';
import InfoCardComponent from '../common/InfoCardComponent';

interface SummaryProps {
    summary: {
        totalOrders: number;
        totalUnits: number;
        avgUnits: number | string;
    }
}

interface OrdersByClientSummaryProps {
    summary: SummaryProps['summary'];
    width?: string;
}

const OrdersByClientSummary: React.FC<OrdersByClientSummaryProps> = ({ summary, width = "100%" }) => {
    const totalOrders = summary?.totalOrders || 0;
    const totalUnits = summary?.totalUnits || 0;
    const avgUnits = summary?.avgUnits || 0;

    return (
        <>
            <InfoCardComponent cardTitle="Total Orders" text={totalOrders.toLocaleString()} width={width} />
            <InfoCardComponent cardTitle="Total Units Processed" text={totalUnits.toLocaleString()} width={width} />
            <InfoCardComponent cardTitle="Avg units per order" text={avgUnits.toLocaleString()} width={width} />
        </>
    );
};

export default OrdersByClientSummary;
