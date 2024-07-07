import { addWeeks, getISOWeek, parseISO, startOfISOWeek } from "date-fns";
import { ByCarrierDynamicData, DynamicData, Order, Top10BarChartData, WHLvsClaysonData, WhiteLabelData, regionShipped } from "../components/orders/OrdersDashboardComponent";
import { WHLClientIds, WhiteLabelClientIds } from "../constants";
import { CustomerData } from "../services/api";


//Types

type DateRange = {
    startDate: Date;
    endDate: Date;
};

  type Filter = {
    dateRange?: DateRange;
    selectedCustomerNames?: { value: string }[];
    selectedRegions?: string [];
};


//utility function


const formatDate = (date: Date): string => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};


//Filtering Data

export const filterOrders = (filter: Filter, data: Order[] | undefined, isCarrier: boolean = false): Order[] => {
    if (!data) return [];

    let filteredData = data.filter(order => {
        const orderDate = new Date(order.date);

        // Filter by date range
        if (filter.dateRange) {
            const startDate = new Date(formatDate(filter.dateRange.startDate));
            const endDate = new Date(formatDate(filter.dateRange.endDate));
            if (orderDate < startDate || orderDate > endDate) {
                return false;
            }
        }

        // Filter by customer names
        if (filter.selectedCustomerNames && filter.selectedCustomerNames.length > 0) {
            const customerIds = filter.selectedCustomerNames.map(customer => customer.value);
            if (!customerIds.includes(order.client_id)) {
                return false;
            }
        }

        return true;
    });

    // Conditionally perform map operation based on selectedRegions
    if (!isCarrier) {
        filteredData = filteredData.map(order => {
            const newOrder = { ...order };
            const regions = filter.selectedRegions ? filter.selectedRegions.map(region => region.toUpperCase()) : [];

            if (!regions.includes('CA')) {
                newOrder.canada = 0;
            }
            if (!regions.includes('US')) {
                newOrder.us = 0;
            }
            if (!regions.includes('INTL')) {
                newOrder.intl = 0;
            }
            if (!regions.includes('INTERNAL')) {
                newOrder.internal = 0;
            }

            return newOrder;
        });
    }

    return filteredData;
};
export const filterRegionShipped = (filter: Filter, data: regionShipped[] | undefined): regionShipped[] => {
    console.log("HERE IS FILTER BEFORE DATA", data)
    if(data) {
    return data.filter(order => {
        const orderDate = new Date(order.date);

        // Filter by date range
        if (filter.dateRange) {
            const startDate = new Date(formatDate(filter.dateRange.startDate));
            const endDate = new Date(formatDate(filter.dateRange.endDate));
            if (orderDate < startDate || orderDate > endDate) {
                return false;
            }
        }

        // Filter by customer names
        if (filter.selectedCustomerNames && filter.selectedCustomerNames.length > 0) {
            const customerIds = filter.selectedCustomerNames.map(customer => customer.value);
            if (!customerIds.includes(order.client_id)) {
                return false;
            }
        }

        return true;
        
    })
    .filter(order => {
        const regions = filter.selectedRegions ? filter.selectedRegions.map(region => region.toUpperCase()) : [];

        if (!regions.includes('CA') && order.country === 'CA') {
            return false;
        }
        if (!regions.includes('US') && order.country === 'US') {
            return false;
        }
        if (!regions.includes('INTL') && (order.country !== 'US' && order.country !== 'CA')) {
            return false;
        }
        return true;
    })
} else {
    return []
}

};
//Weekly filter and transform for graph


export const transformOrdersDataForOrderVolumeByRegionPerWeek = (orders: Order[], dateRange: DateRange): DynamicData => {
    const aggregatedData: { [key: string]: { us: number, canada: number, internal: number, intl: number } } = {};

    let totalOrders = 0;
    let totalUs = 0;
    let totalCa = 0;
    let totalIntl = 0;
    let totalInternal = 0;

    // Initialize all weeks within the range with zero values

    const currentDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    let currentWeekStart = startOfISOWeek(currentDate);
    const endWeekStart = startOfISOWeek(endDate);

    while (currentWeekStart <= endWeekStart) {
        const weekLabel = `${currentWeekStart.getFullYear()}-W${getISOWeek(currentWeekStart).toString().padStart(2, '0')}`;
        aggregatedData[weekLabel] = { us: 0, canada: 0, internal: 0, intl: 0 };
        currentWeekStart = addWeeks(currentWeekStart, 1);
    }

    orders.forEach(order => {
        const date = parseISO(order.date);
        const week = getISOWeek(date);
        const year = date.getFullYear();
        const weekLabel = `${year}-W${week.toString().padStart(2, '0')}`;

        if (!aggregatedData[weekLabel]) {
            aggregatedData[weekLabel] = { us: 0, canada: 0, internal: 0, intl: 0 };
        }
        totalOrders += order.us + order.canada + order.internal + order.intl;

        aggregatedData[weekLabel].us += order.us;
        totalUs += order.us;
        aggregatedData[weekLabel].canada += order.canada;
        totalCa += order.canada;
        aggregatedData[weekLabel].internal += order.internal;
        totalInternal += order.internal;
        aggregatedData[weekLabel].intl += order.intl;
        totalIntl += order.intl;
    });

    const labels = Object.keys(aggregatedData).sort((a, b) => {
        const [yearA, weekA] = a.split('-W').map(Number);
        const [yearB, weekB] = b.split('-W').map(Number);
        if (yearA === yearB) {
            return weekA - weekB;
        }
        return yearA - yearB;
    });

    const usData: number[] = [];
    const canadaData: number[] = [];
    const internalData: number[] = [];
    const intlData: number[] = [];

    labels.forEach(label => {
        usData.push(aggregatedData[label].us);
        canadaData.push(aggregatedData[label].canada);
        internalData.push(aggregatedData[label].internal);
        intlData.push(aggregatedData[label].intl);
    });

    return {
        totalOrders,
        totalUs,
        totalCa,
        totalInternal,
        totalIntl,
        labels,
        datasets: [
            {
                label: "# of units (Internal)",
                data: internalData,
                backgroundColor: '#FF6384',
                borderColor:'#FF6384',
                hoverBackgroundColor: '#d35671',
                borderWidth: 2,
            },
            {
                label: "# of units (INTL)",
                data: intlData,
                backgroundColor: '#FFCE56',
                borderColor:'#FFCE56',
                hoverBackgroundColor: '#e6b453',
                borderWidth: 2,
            },
            {
                label: "# of units (CA)",
                data: canadaData,
                backgroundColor: '#36A2EB',
                borderColor:'#36A2EB',
                hoverBackgroundColor: '#2d8ccd',
                borderWidth: 2,
            },
            {
                label: "# of units (US)",
                data: usData,
                backgroundColor: '#4BC0C0',
                borderColor:'#4BC0C0',
                hoverBackgroundColor: '#3ba3a3',
                borderWidth: 2,
            }
        ],
    };
}

export const transformOrdersDataForOrderVolumeByCarrierPerWeek = (orders: Order[], dateRange: DateRange): ByCarrierDynamicData => {
    const aggregatedData: { [key: string]: { usps: number, dhl: number, canada_post: number, fedex: number, ups: number, other_carriers: number } } = {};

    let totalOrders = 0;
    let totalUSPS = 0;
    let totalDHL = 0;
    let totalCP = 0;
    let totalFEDEX = 0;
    let totalUPS = 0;
    let totalOthers = 0;

    // Initialize all weeks within the range with zero values
    let currentWeekStart = startOfISOWeek(dateRange.startDate);
    const endWeekStart = startOfISOWeek(dateRange.endDate);

    while (currentWeekStart <= endWeekStart) {
        const weekLabel = `${currentWeekStart.getFullYear()}-W${getISOWeek(currentWeekStart).toString().padStart(2, '0')}`;
        aggregatedData[weekLabel] = { usps: 0, dhl: 0, canada_post: 0, fedex: 0, ups: 0, other_carriers: 0 };
        currentWeekStart = addWeeks(currentWeekStart, 1);
    }

    orders.forEach(order => {
        const date = parseISO(order.date);
        const week = getISOWeek(date);
        const year = date.getFullYear();
        const weekLabel = `${year}-W${week.toString().padStart(2, '0')}`;

        if (!aggregatedData[weekLabel]) {
            aggregatedData[weekLabel] = { usps: 0, dhl: 0, canada_post: 0, fedex: 0, ups: 0, other_carriers: 0 };
        }
        totalOrders += order.usps + order.dhl + order.canada_post + order.fedex + order.ups + order.other_carriers;

        aggregatedData[weekLabel].usps += order.usps;
        totalUSPS += order.usps;
        aggregatedData[weekLabel].dhl += order.dhl;
        totalDHL += order.dhl;
        aggregatedData[weekLabel].canada_post += order.canada_post;
        totalCP += order.canada_post;
        aggregatedData[weekLabel].fedex += order.fedex;
        totalFEDEX += order.fedex;
        aggregatedData[weekLabel].ups += order.ups;
        totalUPS += order.ups;
        aggregatedData[weekLabel].other_carriers += order.other_carriers;
        totalOthers += order.other_carriers;
    });

    const labels = Object.keys(aggregatedData).sort((a, b) => {
        const [yearA, weekA] = a.split('-W').map(Number);
        const [yearB, weekB] = b.split('-W').map(Number);
        if (yearA === yearB) {
            return weekA - weekB;
        }
        return yearA - yearB;
    });

    const uspsData: number[] = [];
    const dhlData: number[] = [];
    const cpData: number[] = [];
    const fedexData: number[] = [];
    const upsData: number[] = [];
    const othersData: number[] = [];

    labels.forEach(label => {
        uspsData.push(aggregatedData[label].usps);
        dhlData.push(aggregatedData[label].dhl);
        cpData.push(aggregatedData[label].canada_post);
        fedexData.push(aggregatedData[label].fedex);
        upsData.push(aggregatedData[label].ups);
        othersData.push(aggregatedData[label].other_carriers);
    });

    return {
        totalOrders,
        totalUSPS,
        totalDHL,
        totalFEDEX,
        totalCP,
        totalUPS,
        totalOthers,
        labels,
        datasets: [
            {
                label: "# of orders (USPS)",
                data: uspsData,
                backgroundColor: '#FF9F40',
                borderColor: '#FF9F40',
                hoverBackgroundColor: '#d48136',
                borderWidth: 2,
            },
            {
                label: "# of orders (DHL)",
                data: dhlData,
                backgroundColor: '#9966FF',
                borderColor: '#9966FF',
                hoverBackgroundColor: '#7d5fcc',
                borderWidth: 2,
            },
            {
                label: "# of orders (CP)",
                data: cpData,
                backgroundColor: '#4BC0C0',
                borderColor: '#4BC0C0',
                hoverBackgroundColor: '#3b9b9b',
                borderWidth: 2,
            },
            {
                label: "# of orders (FEDEX)",
                data: fedexData,
                backgroundColor: '#FF6384',
                borderColor: '#FF6384',
                hoverBackgroundColor: '#d35671',
                borderWidth: 2,
            },
            {
                label: "# of orders (UPS)",
                data: upsData,
                backgroundColor: '#FFCE56',
                borderColor: '#FFCE56',
                hoverBackgroundColor: '#d4b446',
                borderWidth: 2,
            },
            {
                label: "# of orders (OTHERs)",
                data: othersData,
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
                hoverBackgroundColor: '#2d8ccd',
                borderWidth: 2,
            }
        ],
    };
}
//Filter and transform for a graph
export const transformOrdersDataForOrderVolumeByCarrierPerDate = (orders: Order[], dateRange: DateRange): ByCarrierDynamicData =>  {
    const aggregatedData: { [key: string]: { usps: number, dhl: number, canada_post: number, fedex: number, ups: number, other_carriers: number} } = {};
 
    let totalOrders = 0;
    let totalUSPS = 0;
    let totalDHL = 0;
    let totalCP = 0;
    let totalFEDEX = 0;
    let totalUPS = 0;
    let totalOthers = 0;

    // Initialize all dates within the range with zero values
    const currentDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        aggregatedData[dateString] = { usps: 0, dhl: 0, canada_post: 0, fedex: 0, ups: 0, other_carriers: 0 };
        currentDate.setDate(currentDate.getDate() + 1);
    }

    orders.forEach(order => {
        if (!aggregatedData[order.date]) {
            aggregatedData[order.date] = { usps: 0, dhl: 0, canada_post: 0, fedex: 0, ups: 0, other_carriers: 0 };
        }
        totalOrders += order.usps + order.dhl + order.canada_post + order.fedex + order.ups + order.other_carriers;

        aggregatedData[order.date].usps += order.usps;
        totalUSPS += order.usps;
        aggregatedData[order.date].dhl += order.dhl;
        totalDHL += order.dhl;

        aggregatedData[order.date].canada_post += order.canada_post;
        totalCP += order.canada_post;

        aggregatedData[order.date].fedex += order.fedex;
        totalFEDEX += order.fedex;
        aggregatedData[order.date].ups += order.ups;
        totalUPS += order.ups;
        aggregatedData[order.date].other_carriers += order.other_carriers;
        totalOthers += order.other_carriers;
    });

    const labels = Object.keys(aggregatedData).sort();
    const uspsData: number[] = [];
    const dhlData: number[] = [];
    const cpData: number[] = [];
    const fedexData: number[] = [];
    const upsData: number[] = [];
    const othersData: number[] = [];

    labels.forEach(label => {
        uspsData.push(aggregatedData[label].usps);
        dhlData.push(aggregatedData[label].dhl);
        cpData.push(aggregatedData[label].canada_post);
        fedexData.push(aggregatedData[label].fedex);
        upsData.push(aggregatedData[label].ups);
        othersData.push(aggregatedData[label].other_carriers);
    });

    return {
        totalOrders,
        totalUSPS,
        totalDHL,
        totalFEDEX,
        totalCP,
        totalUPS,
        totalOthers,
        labels,
        datasets: [
            {
                label: "# of orders (USPS)",
                data: uspsData,
                backgroundColor: '#FF9F40',
                borderColor:'#FF9F40',
                hoverBackgroundColor: '#d48136',
                borderWidth: 2,
            },
            {
                label: "# of orders (DHL)",
                data: dhlData,
                backgroundColor: '#9966FF',
                borderColor:'#9966FF',
                hoverBackgroundColor: '#7d5fcc',
                borderWidth: 2,
            },
            {
                label: "# of orders (CP)",
                data: cpData,
                backgroundColor: '#4BC0C0',
                borderColor:'#4BC0C0',
                hoverBackgroundColor: '#3b9b9b',
                borderWidth: 2,
            },
            {
                label: "# of orders (FEDEX)",
                data: fedexData,
                backgroundColor: '#FF6384',
                borderColor:'#FF6384',
                
                hoverBackgroundColor: '#d35671',
                borderWidth: 2,
            },
            {
                label: "# of orders (UPS)",
                data: upsData,
                backgroundColor: '#FFCE56',
                borderColor:'#FFCE56',

                hoverBackgroundColor: '#d4b446',
                borderWidth: 2,
            },
            {
                label: "# of orders (OTHERs)",
                data: othersData,
                backgroundColor: '#36A2EB',
                borderColor:'#36A2EB',

                hoverBackgroundColor: '#2d8ccd',
                borderWidth: 2,
            }
        ],
    };
}

export const transformOrdersDataForOrderVolumeByRegionPerDate = (orders: Order[], dateRange: DateRange): DynamicData =>  {
    const aggregatedData: { [key: string]: { us: number, canada: number, internal: number, intl: number } } = {};
 
    let totalOrders = 0;
    let totalUs = 0;
    let totalCa = 0;
    let totalIntl = 0;
    let totalInternal = 0;

    // Initialize all dates within the range with zero values
    const currentDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);

    while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        aggregatedData[dateString] = { us: 0, canada: 0, internal: 0, intl: 0 };
        currentDate.setDate(currentDate.getDate() + 1);
    }

    orders.forEach(order => {
        if (!aggregatedData[order.date]) {
            aggregatedData[order.date] = { us: 0, canada: 0, internal: 0, intl: 0 };
        }
        totalOrders += order.us + order.canada + order.internal + order.intl;

        aggregatedData[order.date].us += order.us;
        totalUs += order.us;
        aggregatedData[order.date].canada += order.canada;
        totalCa += order.canada;

        aggregatedData[order.date].internal += order.internal;
        totalInternal += order.internal;

        aggregatedData[order.date].intl += order.intl;
        totalIntl += order.intl;
    });

    const labels = Object.keys(aggregatedData).sort();
    const usData: number[] = [];
    const canadaData: number[] = [];
    const internalData: number[] = [];
    const intlData: number[] = [];

    labels.forEach(label => {
        usData.push(aggregatedData[label].us);
        canadaData.push(aggregatedData[label].canada);
        internalData.push(aggregatedData[label].internal);
        intlData.push(aggregatedData[label].intl);
    });

    return {
        totalOrders,
        totalUs,
        totalCa,
        totalInternal,
        totalIntl,
        labels,
        datasets: [
            {
                label: "# of units (Internal)",
                data: internalData,
                backgroundColor: '#FF6384',
                borderColor:'#FF6384',
                hoverBackgroundColor: '#d35671',
                borderWidth: 2,
            },
            {
                label: "# of units (INTL)",
                data: intlData,
                backgroundColor: '#FFCE56',
                borderColor:'#FFCE56',
                hoverBackgroundColor: '#e6b453',
                borderWidth: 2,
            },
            {
                label: "# of units (CA)",
                data: canadaData,
                backgroundColor: '#36A2EB',
                borderColor:'#36A2EB',
                hoverBackgroundColor: '#2d8ccd',
                borderWidth: 2,
            },
            {
                label: "# of units (US)",
                data: usData,
                backgroundColor: '#4BC0C0',
                borderColor:'#4BC0C0',
                hoverBackgroundColor: '#3ba3a3',
                borderWidth: 2,
            }
        ],
    };
}

export const transformOrdersDataForTop10OrdersConfirmed = (orders: Order[], customers : CustomerData[] | null): Top10BarChartData => {
    // Aggregate total orders by client_id
    const aggregatedOrders = orders.reduce((acc, order) => {
        if (!acc[order.client_id]) {
            acc[order.client_id] = {
                client_id: order.client_id,
                total_orders: 0
            };
        }
        acc[order.client_id].total_orders += order.canada + order.us + order.internal + order.intl;
        return acc;
    }, {} as { [key: string]: { client_id: string; total_orders: number } });

    // Convert the aggregated orders object to an array
    const aggregatedOrdersArray = Object.values(aggregatedOrders);

    // Sort the aggregated orders by total_orders in descending order
    const sortedOrders = aggregatedOrdersArray.sort((a, b) => b.total_orders - a.total_orders);

    // Take the top 10 orders
    const top10Orders = sortedOrders.slice(0, 10);

    // Extract client IDs and total orders confirmed
    const labels = top10Orders.map(order => {
        const customer = customers?.find(cust => cust.customerId.toString() === order.client_id);
        return customer ? customer.companyName : 'Unknown';
      });
    const data = top10Orders.map(order => order.total_orders);

    // Define the colors for the chart
   const backgroundColor = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40'
    ]
   const hoverBackgroundColor = [
        '#d35671', '#2d8ccd', '#d4b446', '#3b9b9b', '#7d5fcc',
        '#d48136'
    ]
    // Create the chart data object
    const top10BarchartData: Top10BarChartData = {
        labels: labels,
        title: "Top 10 - # of Orders Confirmed by Customer",
        data: data,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: hoverBackgroundColor,
        borderWidth: 1,
        indexAxis: 'y',
        height: '20rem'
    };

    return top10BarchartData;
}
export const transformOrdersDataForWHLAndClayson = (orders: Order[]): WHLvsClaysonData =>  {
    let WHLTotalOrders = 0;
    let ClaysonTotalOrders = 0;

    orders.forEach(order => {
        if (WHLClientIds.includes(parseInt(order.client_id))) {
            WHLTotalOrders += order.us + order.canada + order.internal + order.intl;
        } else {
            ClaysonTotalOrders += order.us + order.canada + order.internal + order.intl;
        }
    });

    return {
        labels: ['Clayson', 'WHL'],
        title: '# orders confirmed - Clayson vs WHL',
        data: [ClaysonTotalOrders, WHLTotalOrders],
        minHeight: '20rem'
    };
}
export const transformOrdersDataForWhiteLabel = (orders: Order[]): WhiteLabelData =>  {
    let WhiteLabel = 0;
    let StandardInventory = 0;

    orders.forEach(order => {
        if (WhiteLabelClientIds.includes(parseInt(order.client_id))) {
            WhiteLabel += order.us + order.canada + order.internal + order.intl;
        } else {
            StandardInventory += order.us + order.canada + order.internal + order.intl;
        }
    });

    return {
        labels: ['Standard Inv.', 'White Label'],
        title: 'Customer Classificataion',
        data: [StandardInventory, WhiteLabel],
    };
}
export const transformOrdersDataForTop10OrdersByCountry = (regionShipped: regionShipped[]): Top10BarChartData => {
    // Aggregate total orders by client_id
    const aggregateOrdersByCountry = regionShipped.reduce((acc, region) => {
        if (!acc[region.country]) {
            acc[region.country] = {
                country: region.country,
                total_orders: 0
            };
        }
        acc[region.country].total_orders += region.total_orders;
        return acc;
    }, {} as { [key: string]: { country: string; total_orders: number } });

    // Convert the aggregated orders object to an array
    const aggregatedOrdersArray = Object.values(aggregateOrdersByCountry);

    // Sort the aggregated orders by total_orders in descending order
    const sortedOrders = aggregatedOrdersArray.sort((a, b) => b.total_orders - a.total_orders);

    // Take the top 10 orders
    const top10Orders = sortedOrders.slice(0, 10);

    // Extract client IDs and total orders confirmed
    const labels = top10Orders.map(order => order.country);
    const data = top10Orders.map(order => order.total_orders);

    // Define the colors for the chart
   const backgroundColor = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40'
    ]
   const hoverBackgroundColor = [
        '#d35671', '#2d8ccd', '#d4b446', '#3b9b9b', '#7d5fcc',
        '#d48136'
    ]
    // Create the chart data object
    const top10CountriesData: Top10BarChartData = {
        labels: labels,
        title: "Top 10 - # of Orders Confirmed by Country",
        data: data,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: hoverBackgroundColor,
        borderWidth: 1,
        indexAxis: 'y',
        height: '20rem'
    };

    return top10CountriesData;
}
export const transformOrdersDataForTop10OrdersByState = (regionShipped: regionShipped[]): Top10BarChartData => {
    // Aggregate total orders by client_id
    const aggregateOrdersByState = regionShipped.reduce((acc, region) => {
        if (!acc[region.state_province]) {
            acc[region.state_province] = {
                state: region.state_province,
                total_orders: 0
            };
        }
        acc[region.state_province].total_orders += region.total_orders;
        return acc;
    }, {} as { [key: string]: { state: string; total_orders: number } });

    // Convert the aggregated orders object to an array
    const aggregatedOrdersArray = Object.values(aggregateOrdersByState);

    // Sort the aggregated orders by total_orders in descending order
    const sortedOrders = aggregatedOrdersArray.sort((a, b) => b.total_orders - a.total_orders);

    // Take the top 10 orders
    const top10Orders = sortedOrders.slice(0, 10);

    // Extract client IDs and total orders confirmed
    const labels = top10Orders.map(order => order.state);
    const data = top10Orders.map(order => order.total_orders);

    // Define the colors for the chart
   const backgroundColor = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40'
    ]
   const hoverBackgroundColor = [
        '#d35671', '#2d8ccd', '#d4b446', '#3b9b9b', '#7d5fcc',
        '#d48136'
    ]
    // Create the chart data object
    const top10CountriesData: Top10BarChartData = {
        labels: labels,
        title: "Top 10 - # of Orders Confirmed by State",
        data: data,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: hoverBackgroundColor,
        borderWidth: 1,
        indexAxis: 'y',
        height: '20rem'
    };

    return top10CountriesData;
}
//Filter and transform for filter options

export const transformCustomersDataForOptions = (customersData: CustomerData[]): { value: string, label: string }[] => {
    return customersData
    //   .filter(customer => !customer.deactivated) // Optionally filter out deactivated customers
      .map(customer => ({
        value: customer.customerId.toString(),
        label: customer.companyName
      }));
  }
