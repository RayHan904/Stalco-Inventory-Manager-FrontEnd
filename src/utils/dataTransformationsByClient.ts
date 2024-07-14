export interface SkuSales {
    sku: string;
    date: string;
    total_orders: number;
    client_id: string;
    retailer_id: string;
    total_units: string; // Changed to number
}

export interface Summary {
    totalOrders: number;
    totalUnits: number;
    avgUnits: number;
}

interface Top10BarChartData {
    labels: string[];
    title: string;
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
    borderWidth: number;
    indexAxis: string;
    height: string;
}

export const transformOrdersDataForTop10SkusOrdered = (skusales: SkuSales[] | null): Top10BarChartData | null => {
    if (!skusales || skusales.length === 0) {
        return null;
    }

    // Aggregate total orders by SKU
    const aggregatedSkus = skusales.reduce((acc, sale) => {
        if (!acc[sale.sku]) {
            acc[sale.sku] = {
                sku: sale.sku,
                total_orders: 0
            };
        }
        acc[sale.sku].total_orders += sale.total_orders;
        return acc;
    }, {} as { [key: string]: { sku: string; total_orders: number } });

    // Convert the aggregated SKUs object to an array
    const aggregatedSkusArray = Object.values(aggregatedSkus);

    // Sort the aggregated SKUs by total_orders in descending order
    const sortedSkus = aggregatedSkusArray.sort((a, b) => b.total_orders - a.total_orders);

    // Take the top 10 SKUs
    const top10Skus = sortedSkus.slice(0, 10);

    // Extract SKU names and total orders confirmed
    const labels = top10Skus.map(sku => sku.sku);
    const data = top10Skus.map(sku => sku.total_orders);

    // Define the colors for the chart
    const backgroundColor = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
    ];
    const hoverBackgroundColor = [
        '#d35671', '#2d8ccd', '#d4b446', '#3b9b9b', '#7d5fcc',
        '#d48136', '#d35671', '#2d8ccd', '#d4b446', '#3b9b9b'
    ];

    // Create the chart data object
    const top10BarchartData: Top10BarChartData = {
        labels: labels,
        title: "Top 10 - # of Orders by SKU",
        data: data,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: hoverBackgroundColor,
        borderWidth: 1,
        indexAxis: 'y',
        height: '20rem'
    };

    return top10BarchartData;
}


export function createSummary(skuSales: SkuSales[]): Summary {
    let totalOrders = 0;
    let totalUnits = 0;

    skuSales.forEach(sale => {
        totalOrders += sale.total_orders;
        totalUnits += parseFloat(sale.total_units);
    });

    const avgUnits = totalOrders > 0 ? totalUnits / totalOrders : 0;

    return {
        totalOrders,
        totalUnits,
        avgUnits,
    };
}