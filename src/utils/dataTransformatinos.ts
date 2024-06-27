import { DynamicData, Order, Top10BarChartData, WHLvsClaysonData, WhiteLabelData, regionShipped } from "../components/orders/OrdersDashboardComponent";
import { WHLClientIds, WhiteLabelClientIds } from "../constants";
import { CustomerData } from "../services/api";


type DateRange = {
    startDate: Date;
    endDate: Date;
};

  type Filter = {
    dateRange?: DateRange;
    selectedCustomerNames?: { value: string }[];
    selectedRegions?: string [];
};



const formatDate = (date: Date): string => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const transformOrdersDataForOrderVolumeByRegionPerDate = (orders: Order[]): DynamicData =>  {
    const aggregatedData: { [key: string]: { us: number, canada: number, internal: number, intl: number } } = {};
 
    let totalOrders = 0;
    let totalUs=0;
    let totalCa= 0;
    let totalIntl = 0;
    let totalInternal = 0;

    orders.forEach(order => {
        if (!aggregatedData[order.date]) {
            aggregatedData[order.date] = { us: 0, canada: 0, internal: 0, intl: 0 };
        }
        totalOrders+=order.us + order.canada + order.internal + order.intl;

        aggregatedData[order.date].us += order.us;
        totalUs+=order.us;
        aggregatedData[order.date].canada += order.canada;
        totalCa+=order.canada;

        aggregatedData[order.date].internal += order.internal;
        totalInternal+=order.internal;

        aggregatedData[order.date].intl += order.intl;
        totalIntl+=order.intl;

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
                hoverBackgroundColor: '#d35671',
                borderWidth: 2,
            },
            {
                label: "# of units (INTL)",
                data: intlData,
                backgroundColor: '#FFCE56',
                hoverBackgroundColor: '#e6b453',
                borderWidth: 2,
            },
            {
                label: "# of units (CA)",
                data: canadaData,
                backgroundColor: '#36A2EB',
                hoverBackgroundColor: '#2d8ccd',
                borderWidth: 2,
            },
            {
                label: "# of units (US)",
                data: usData,
                backgroundColor: '#4BC0C0',
                hoverBackgroundColor: '#3ba3a3',
                borderWidth: 2,
            }
        ],
    };
}

export const transformCustomersDataForOptions = (customersData: CustomerData[]): { value: string, label: string }[] => {
    return customersData
    //   .filter(customer => !customer.deactivated) // Optionally filter out deactivated customers
      .map(customer => ({
        value: customer.customerId.toString(),
        label: customer.companyName
      }));
  }

export const filterOrders = (filter: Filter, data: Order[] | undefined): Order[] => {
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
    .map(order => {
        const newOrder = { ...order };

        // Filter by regions and set counts to 0 for unselected regions
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
} else {
    return []
}

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