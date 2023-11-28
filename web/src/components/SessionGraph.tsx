"use client";

import { makeStyles } from "@fluentui/react-components";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";

import React, { useState } from "react";
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
  TimeScale
} from "chart.js";
import { Line } from "react-chartjs-2";
// @ts-ignore
import { Session } from "@/session/SessionManager";
import { useSessionContext } from "@/session/SessionProvider";
import { from, groupBy, toArray } from "rxjs";
import { sumScales } from "@/data/sumScales";
import { ScaleAverageData, ScaleData } from "@/bluetooth/BluetoothManager";

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

export const options: () => ChartOptions<"line"> = () => {
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
      }
    },
    scales: {
      y: {
        min: 0
        // max: maxY + 10,
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
          }
          // stepSize: 5000,
        }
        // min: minX,
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

export const SessionGraphWrapper = () => {
  const { sessionManager } = useSessionContext();
  const show = sessionManager.sessions[0] !== undefined;

  // TODO: make a sessions hook
  // TODO: average session scales
  return (
    <div>
      {show ? (<SessionGraph session={sessionManager.sessions[0]} />) : (<div>loading</div>)}
    </div>
  );
};

export const SessionGraph = (props: { session: Session }) => {
  const styles = useStyles();

  const [scaleState, setScaleState] = useState<ScaleAverageData[]>([]);
  if (scaleState.length === 0) {
    from(props.session.scaleData)
      .pipe(sumScales)
      .subscribe({
        next: (data) => {
          setScaleState(prevState => {
            return [...prevState, data]
          });
        },
      });
  }

  // TODO: represent time difference between measurements? log error if range of sampling time is too large?
  let data = lineData(scaleState.map(data => {
    return { x: data.earlierMeasurement.getTime(), y: data.value };
  }));
  return (
    <div className={styles.graph}>
      {/* option/data refs are used to prevent re-rendering <Line>, prefer to update chart data via lineRef */}
      <Line options={options()} data={data} />;
    </div>
  );
};
