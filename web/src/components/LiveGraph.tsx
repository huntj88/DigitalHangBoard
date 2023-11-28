"use client";

import { makeStyles } from "@fluentui/react-components";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";

import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartOptions,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useBluetoothContext } from "@/bluetooth/BluetoothProvider";
import { ScaleData } from "@/bluetooth/BluetoothManager";
// @ts-ignore
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { sumScales } from "@/data/sumScales";

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

export const options: (minX: number, maxY: number) => ChartOptions<"line"> = (
  minX: number,
  maxY: number,
) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Force/Time",
      },
    },
    animations: {
      y: {
        duration: 0,
      },
    },
    scales: {
      y: {
        min: 0,
        max: maxY + 10,
      },
      x: {
        title: {
          display: true,
          text: "Time (UTC)",
          font: {
            weight: "bold",
          },
        },
        type: "time",
        time: {
          unit: "millisecond",
        },
        ticks: {
          font: {
            weight: "bold",
          },
          stepSize: 1000,
        },
        min: minX,
      },
    },
  };
};
export const lineData = (
  scaleData: {
    x: number;
    y: number;
  }[],
) => {
  return {
    datasets: [
      {
        fill: true,
        label: "Detected Weight",
        data: scaleData,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
};

const useStyles = makeStyles({
  graph: {
    width: "100vw",
    height: "80vh",
  },
});
export const LiveGraph = () => {
  const styles = useStyles();
  const { bluetoothManager } = useBluetoothContext();
  const xyDataRef = useRef<{x: number, y: number}[]>([])
  const lineRef = useRef<ChartJSOrUndefined>();
  const minXRef = useRef<number>(new Date().getTime());
  const maxYRef = useRef<number>(0);

  useEffect(() => {
    const subscription = bluetoothManager
      // .getScaleObservable(0)
      .getScaleObservable()
      .pipe(sumScales)
      .subscribe({
        next: (data) => {
          if (xyDataRef.current.length > 50) {
            // only keep visible data, remove oldest
            xyDataRef.current.shift()
          }
          xyDataRef.current.push({ x: data.date.getTime(), y: data.value })
          minXRef.current = data.date.getTime() - 2000
          maxYRef.current = Math.max(maxYRef.current, data.value)
          if (lineRef.current) {
            lineRef.current.options = options(minXRef.current, maxYRef.current)
            lineRef.current.data.datasets[0].data = xyDataRef.current
            if (xyDataRef.current.length === 1) {
              // prevent weird start animation
              lineRef.current.update("none");
            } else {
              lineRef.current.update();
            }
          }
        },
        error: (e) => console.error(e),
        complete: () => console.info("LiveGraph complete"),
      });

    return () => subscription.unsubscribe();
  }, [bluetoothManager]);

  return (
    <div className={styles.graph}>
      {/* option/data refs are used to prevent re-rendering <Line>, prefer to update chart data via lineRef */}
      <Line ref={lineRef} options={options(minXRef.current, maxYRef.current)} data={lineData(xyDataRef.current)} />;
    </div>
  );
};
