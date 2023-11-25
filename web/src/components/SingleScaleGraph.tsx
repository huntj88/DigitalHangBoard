import {makeStyles, shorthands, tokens, typographyStyles} from "@fluentui/react-components";
import {AreaChart} from "@fluentui/react-charting";
import {chartData} from "@/app/sampleData";
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';

import React, {useEffect, useRef, useState} from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend, ChartOptions, TimeScale,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {useBluetoothContext} from "@/bluetooth/BluetoothProvider";
import {ScaleData} from "@/bluetooth/BluetoothManager";
import dayjs from "dayjs";
import {number} from "prop-types";
import {ChartJSOrUndefined} from "react-chartjs-2/dist/types";
// import faker from 'faker';

ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

export const options: (min: number, max: number) => ChartOptions<"line"> = (min: number, max: number) => {
    return {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
        scales: {
            x: {
                // title: {
                //     display: true,
                //     text: "Time (UTC)",
                //     font: {
                //         //size: 30,
                //         weight: "bold"
                //     }
                // },
                type: "time",
                time: {
                    unit: "millisecond", // try this with stepsize 15000
                    // unit: "second" // that's the computed unit for this data
                },
                //beforeBuildTicks: function(ax){
                //   console.log(ax._unit);
                //},
                ticks: {
                    font: {
                        //size: 20,
                        weight: "bold"
                    },

                    // minRotation: 45,
                    //count: 3,
                    // stepSize: 15,
                    stepSize: 150,
                    // autoSkip: false
                },
                min,
                max
            },
        }
    }
}

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

// export const data = (scaleData: ScaleData[]) => {
export const data = (labels: number[], scaleDataRef: {
    x: number,
    y: number
}[]) => {
    return {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Dataset 2',
                // data: labels.map(() => generateRandom()),
                // data: scaleData.map((scale) => {
                //     return {x: scale.date.getUTCMilliseconds(), y: scale.value}
                // }),
                data: scaleDataRef,
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    }
}

const useStyles = makeStyles({
    graph: {
        width: "100vw",
    },
});
export const SingleScaleGraph = () => {
    const {bluetoothManager} = useBluetoothContext()
    // const [scaleData, setScaleData] = useState<ScaleData[]>([])
    const lineRef = useRef<ChartJSOrUndefined>()
    const [minMax, setMinMax] = useState<{
        min: number,
        max: number
    }>({min: 0, max: 7})

    useEffect(() => {
        const subscription = bluetoothManager.getScaleObservable(0).subscribe({
            next: (data) => {
                const length = testData.current.length
                // const farLeft = testData.current.shift()
                const farLeft = testData.current[length - 7]
                testData.current.push({x: farLeft!.x + length, y: farLeft!.y})
                lineRef.current?.update()
                setMinMax({min: testData.current[length - 7].x, max: testData.current[length].x})
                // setScaleData((prevState) => [...prevState.toReversed().slice(0, 20).toReversed(), data])
            },
            error: (e) => console.error(e),
            complete: () => console.info('SingleScaleGraph complete')
        })

        return () => subscription.unsubscribe()
    }, [bluetoothManager])

    const styles = useStyles();

    const testData = useRef<{
        x: number,
        y: number
    }[]>([{x: 0, y: 9}, {x: 1, y: 10}, {x: 2, y: 9}, {x: 3, y: 7}, {x: 4, y: 10}, {x: 5, y: 12}, {x: 6, y: 10}, {x: 7, y: 12}])
    const testDataLabels = useRef<number[]>(testData.current.map(x => x.x))

    return (
        <div className={styles.graph}>
            <Line ref={lineRef} options={options(minMax.min, minMax.max)}
                  data={data(testDataLabels.current, testData.current)}/>;
            {/*<AreaChart*/}
            {/*    culture={window.navigator.language}*/}
            {/*    data={chartData}*/}
            {/*    enablePerfOptimization={false}*/}
            {/*    enableReflow={true}*/}
            {/*/>*/}

        </div>
    )
}
