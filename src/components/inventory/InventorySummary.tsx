import React from 'react';
import InfoCardComponent from '../common/InfoCardComponent';

interface SummaryProps {
    summary: {
        Total: number;
        Clayson: number;
        WHL: number;
    }
}

interface InventorySummaryProps {
    summary: SummaryProps['summary'];
    width?: string;
}

const InventorySummary: React.FC<InventorySummaryProps> = ({ summary, width = "100%" }) => {
    const total = summary?.Total || 0;
    const claysonCount = summary?.Clayson || 0;
    const whlCount = summary?.WHL || 0;

    return (
        <>
            <InfoCardComponent cardTitle="Total Inventory" text={total.toLocaleString()} width={width} />
            <InfoCardComponent cardTitle="WHL Total" text={whlCount.toLocaleString()} perc={`${((whlCount / total) * 100).toFixed(2)}%`} width={width} />
            <InfoCardComponent cardTitle="Clayson Total" text={claysonCount.toLocaleString()} perc={`${((claysonCount / total) * 100).toFixed(2)}%`} width={width} />
        </>
    );
};

export default InventorySummary;
