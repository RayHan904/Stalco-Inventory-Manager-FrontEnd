import { DynamicData, Order } from "../components/orders/OrdersDashboardComponent";


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