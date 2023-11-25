import {makeStyles} from "@fluentui/react-components";
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
// @ts-ignore
import {ChartJSOrUndefined} from "react-chartjs-2/dist/types";

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

export const options: (minX: number, maxY: number) => ChartOptions<"line"> = (minX: number, maxY: number) => {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Force/Time',
            },
        },
        animations: {
            y: {
                duration: 0
            }
        },
        scales: {
            y: {
                min: 0,
                max: maxY
            },
            x: {
                title: {
                    display: true,
                    text: "Time (UTC)",
                    font: {
                        weight: "bold"
                    }
                },
                type: "time",
                time: {
                    unit: "millisecond",
                },
                ticks: {
                    font: {
                        weight: "bold"
                    },
                    stepSize: 1000,
                },
                min: minX,
            },
        }
    }
}
export const data = (scaleDataRef: {
    x: number,
    y: number
}[]) => {
    return {
        datasets: [
            {
                fill: true,
                label: 'Detected Weight',
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
        height: "80vh"
    },
});
export const LiveGraph = () => {
    const styles = useStyles();
    const {bluetoothManager} = useBluetoothContext()
    const [scaleData, setScaleData] = useState<ScaleData[]>([])
    const lineRef = useRef<ChartJSOrUndefined>()
    const [minX, setMinX] = useState<number>(new Date().getTime())
    const [maxY, setMaxY] = useState<number>(0)

    useEffect(() => {
        const subscription = bluetoothManager.getScaleObservable(0).subscribe({
            next: (data) => {
                setScaleData((prevState) => [...prevState, data])
                setMinX(data.date.getTime() - 2000)
                setMaxY((prevState) => Math.max(prevState, data.value))
                lineRef.current?.update()
            },
            error: (e) => console.error(e),
            complete: () => console.info('LiveGraph complete')
        })

        return () => subscription.unsubscribe()
    }, [bluetoothManager])

    const lineData = data(scaleData.map(d => {
        return {x: d.date.getTime(), y: d.value}
    }));
    return (
        <div className={styles.graph}>
            <Line ref={lineRef} options={options(minX, maxY)}
                  data={lineData}/>;
        </div>
    )
}
