import { format, eachDayOfInterval } from 'date-fns';

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

export interface FilteredData {
    dates: string[];
    totalOrders: number[];
    totalUnits: number[];
    summary: {
      totalOrders: number;
      totalUnits: number;
      avgUnitsPerOrder: number;
      retailer: string | null;
    };
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



export const filterSKUOrderDetails = (
  details: SkuSales[],
  selectedSKU: string,
  startDate: string,
  endDate: string
): FilteredData => {
  // Filter the data for the selected SKU
  const filteredData = details.filter(data => data.sku === selectedSKU);
  console.log('Filtered Data:', filteredData);

  // Aggregate total orders and total units by date
  const aggregatedDataByDate = filteredData.reduce((acc, data) => {
    if (!acc[data.date]) {
      acc[data.date] = {
        date: data.date,
        total_orders: 0,
        total_units: 0
      };
    }
    acc[data.date].total_orders += data.total_orders;
    acc[data.date].total_units += parseFloat(data.total_units);
    return acc;
  }, {} as { [key: string]: { date: string; total_orders: number; total_units: number } });

  console.log('Aggregated Data by Date:', aggregatedDataByDate);

  // Generate a list of all dates between start and end date
  const allDates = eachDayOfInterval({
    start: new Date(startDate),
    end: new Date(endDate)
  }).map(date => format(date, 'yyyy-MM-dd'));

  // Ensure all dates are present in the aggregated data
  allDates.forEach(date => {
    if (!aggregatedDataByDate[date]) {
      aggregatedDataByDate[date] = {
        date,
        total_orders: 0,
        total_units: 0
      };
    }
  });

  // Convert the aggregated data to an array and sort by date
  const aggregatedDataArray = Object.values(aggregatedDataByDate).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Extract dates, total orders, and total units into separate arrays
  const dates = aggregatedDataArray.map(data => data.date);
  const totalOrders = aggregatedDataArray.map(data => data.total_orders);
  const totalUnits = aggregatedDataArray.map(data => data.total_units);

  // Calculate summary statistics
  const totalOrdersSum = totalOrders.reduce((sum, val) => sum + val, 0);
  const totalUnitsSum = totalUnits.reduce((sum, val) => sum + val, 0);
  const avgUnitsPerOrder = totalOrdersSum === 0 ? 0 : totalUnitsSum / totalOrdersSum;
  const retailer = filteredData.length > 0 ? filteredData[0].retailer_id : null;

  console.log('Summary:', {
    totalOrders: totalOrdersSum,
    totalUnits: totalUnitsSum,
    avgUnitsPerOrder,
    retailer
  });

  return {
    dates,
    totalOrders,
    totalUnits,
    summary: {
      totalOrders: totalOrdersSum,
      totalUnits: totalUnitsSum,
      avgUnitsPerOrder,
      retailer
    }
  };
};
