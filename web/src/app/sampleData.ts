const sampleData = [
    {
        time: "2023-11-16T02:28:29+00:00",
        weight: 175.23
    },
    {
        time: "2023-11-16T02:28:30+00:00",
        weight: 176.23
    },
    {
        time: "2023-11-16T02:28:31+00:00",
        weight: 174.23
    },
    {
        time: "2023-11-16T02:28:32+00:00",
        weight: 175.23
    },
    {
        time: "2023-11-16T02:28:33+00:00",
        weight: 175.93
    },
];

const chart1Points = [
    {
        x: 20,
        y: 7000,
        xAxisCalloutData: '2018/01/01',
        yAxisCalloutData: '35%',
    },
    {
        x: 25,
        y: 9000,
        xAxisCalloutData: '2018/01/15',
        yAxisCalloutData: '45%',
    },
    {
        x: 30,
        y: 13000,
        xAxisCalloutData: '2018/01/28',
        yAxisCalloutData: '65%',
    },
    {
        x: 35,
        y: 15000,
        xAxisCalloutData: '2018/02/01',
        yAxisCalloutData: '75%',
    },
    {
        x: 40,
        y: 11000,
        xAxisCalloutData: '2018/03/01',
        yAxisCalloutData: '55%',
    },
    {
        x: 45,
        y: 8760,
        xAxisCalloutData: '2018/03/15',
        yAxisCalloutData: '43%',
    },
    {
        x: 50,
        y: 3500,
        xAxisCalloutData: '2018/03/28',
        yAxisCalloutData: '18%',
    },
    {
        x: 55,
        y: 20000,
        xAxisCalloutData: '2018/04/04',
        yAxisCalloutData: '100%',
    },
    {
        x: 60,
        y: 17000,
        xAxisCalloutData: '2018/04/15',
        yAxisCalloutData: '85%',
    },
    {
        x: 65,
        y: 1000,
        xAxisCalloutData: '2018/05/05',
        yAxisCalloutData: '5%',
    },
    {
        x: 70,
        y: 12000,
        xAxisCalloutData: '2018/06/01',
        yAxisCalloutData: '60%',
    },
    {
        x: 75,
        y: 6876,
        xAxisCalloutData: '2018/01/15',
        yAxisCalloutData: '34%',
    },
    {
        x: 80,
        y: 12000,
        xAxisCalloutData: '2018/04/30',
        yAxisCalloutData: '60%',
    },
    {
        x: 85,
        y: 7000,
        xAxisCalloutData: '2018/05/04',
        yAxisCalloutData: '35%',
    },
    {
        x: 90,
        y: 10000,
        xAxisCalloutData: '2018/06/01',
        yAxisCalloutData: '50%',
    },
];

const chartPoints = [
    {
        legend: 'legend1',
        data: chart1Points,
    },
];

export const chartData = {
    chartTitle: 'Area chart basic example',
    lineChartData: chartPoints,
};
