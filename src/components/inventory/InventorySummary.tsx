import React from 'react';
import InfoCardComponent from '../common/InfoCardComponent';

interface SummaryProps {
    summary: {
        Total: number;
        Clayson: number;
        WHL: number;
    } 
}

const InventorySummary: React.FC<{ summary: SummaryProps['summary'] }> = ({ summary }: { summary: SummaryProps['summary'] }) => {
    const total = summary?.Total || 0;
    const claysonCount = summary?.Clayson || 0;
    const whlCount = summary?.WHL || 0;
    return (
        <>
            <InfoCardComponent cardTitle="Total Inventory" text={total.toLocaleString()} />
            <InfoCardComponent cardTitle="WHL Total" text={whlCount.toLocaleString()}  perc={`${((whlCount / total) * 100).toFixed(2)}%`} />
            <InfoCardComponent cardTitle="Clayson Total" text={claysonCount.toLocaleString()} perc={`${((claysonCount / total) * 100).toFixed(2)}%`} />
        </>
    );
};

export default InventorySummary;
