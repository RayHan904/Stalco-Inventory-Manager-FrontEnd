import React from 'react';
import InfoCardComponent from '../common/InfoCardComponent';

interface SummaryProps {
    summary: {
        Total: number;
        Clayson: number;
        WHL: number;
    } 
}

const UtilizationSummary: React.FC<{ summary: SummaryProps['summary'] }> = ({ summary }: { summary: SummaryProps['summary'] }) => {
    const total = summary?.Total || 0;
    const claysonCount = summary?.Clayson || 0;
    const whlCount = summary?.WHL || 0;
    return (
        <>
            <InfoCardComponent cardTitle="Overall Utilization"  perc="100%"  width="100%"/>
            <InfoCardComponent cardTitle="WHL Utilization"   perc={`${((whlCount / total) * 100).toFixed(2)}%`} width="100%" />
            <InfoCardComponent cardTitle="Clayson Utilization"  perc={`${((claysonCount / total) * 100).toFixed(2)}%`} width="100%" />
        </>
    );
};

export default UtilizationSummary;
