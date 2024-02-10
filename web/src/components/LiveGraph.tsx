"use client";

import { makeStyles } from "@fluentui/react-components";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";

import React, { MutableRefObject, useEffect, useRef } from "react";
import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useBluetoothContext } from "@/bluetooth/BluetoothProvider";
// @ts-ignore
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { sumScales } from "@/data/sumScales";
import { map, Observable } from "rxjs";

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

export const options: (minX: number, maxY: number, minY: number) => ChartOptions<"line"> = (
  minX: number,
  maxY: number,
  minY: number
) => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const
      },
      title: {
        display: true,
        text: "Force/Time"
      }
    },
    animations: {
      y: {
        duration: 0
      },
      x: {
        duration: 0
      }
    },
    scales: {
      y: {
        min: minY,
        max: maxY + 10
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
          unit: "millisecond"
        },
        ticks: {
          font: {
            weight: "bold"
          },
          stepSize: 1000
        },
        min: minX
      }
    }
  };
};
export const lineData = (
  scaleData: {
    x: number;
    y: number;
  }[]
) => {
  return {
    datasets: [
      {
        fill: true,
        label: "Detected Weight",
        data: scaleData,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)"
      }
    ]
  };
};

const useStyles = makeStyles({
  graph: {
    width: "100vw",
    height: "80vh"
  }
});

export const LiveGraphAverage = () => {
  const { bluetoothManager } = useBluetoothContext();
  const counterRef = useRef(0);
  return (
    <>
      {bluetoothManager && <LiveGraph refs={counterRef} data={bluetoothManager
        .getScaleObservable()
        .pipe(sumScales)
        .pipe(map((value, index) => {
          return {
            value: value.weightPounds,
            date: value.date
          };
        }))
      }
      />}
    </>
  );
};

export const LiveGraphIndex = (props: { index: number }) => {
  const { bluetoothManager } = useBluetoothContext();
  const counterRef = useRef(0);
  return (
    <>
      {bluetoothManager && <LiveGraph refs={counterRef} data={bluetoothManager
        .getScaleObservable({ index: props.index })
      }
      />}
    </>
  );
};



type LiveGraphProps = {
  refs: MutableRefObject<number>,
  data: Observable<{value: number, date: Date}>
}

export const LiveGraph = (props: LiveGraphProps) => {
  console.log("live graph");
  const styles = useStyles();
  const xyDataRef = useRef<{ x: number, y: number }[]>([]);
  const lineRef = useRef<ChartJSOrUndefined>();
  const minXRef = useRef<number>(new Date().getTime());
  const maxYRef = useRef<number>(30);
  const minYRef = useRef<number>(0);

  useEffect(() => {
    const env = process.env.NODE_ENV;
    if (env == "development" && props.refs && props.refs.current === 0) {
      // TODO: why do i need to do this only in development environment?
      props.refs.current += 1;
      console.log("live graph", "useEffect", "early return");
      return;
    }
    console.log("live graph", "useEffect", "subscribe");
    const subscription = props.data
      .subscribe({
        next: (data) => {
          if (xyDataRef.current.length > 200) {
            // only keep visible data, remove oldest
            xyDataRef.current.shift();
          }
          // TODO: time range, not just earliest
          xyDataRef.current.push({ x: data.date.getTime(), y: data.value });
          minXRef.current = data.date.getTime() - 2000;
          maxYRef.current = Math.max(maxYRef.current, data.value);
          minYRef.current = Math.min(minYRef.current, data.value);
          if (lineRef.current) {
            lineRef.current.options = options(minXRef.current, maxYRef.current, minYRef.current);
            lineRef.current.data.datasets[0].data = xyDataRef.current;
            if (xyDataRef.current.length === 1) {
              // prevent weird start animation
              lineRef.current.update("none");
            } else {
              lineRef.current.update();
            }
          }
        },
        error: (e) => console.error(e),
        complete: () => console.info("LiveGraph complete")
      });

    return () => {
      console.log("live graph", "useEffect", "unsubscribe");
      subscription.unsubscribe();
    };
  }, [props.data, props.refs]);

  return (
    <div className={styles.graph}>
      {/* option/data refs are used to prevent re-rendering <Line>, prefer to update chart data via lineRef */}
      <Line ref={lineRef} options={options(minXRef.current, maxYRef.current, minYRef.current)} data={lineData(xyDataRef.current)} />;
    </div>
  );
};
