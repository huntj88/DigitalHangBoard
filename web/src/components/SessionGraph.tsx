"use client";

import { Card, makeStyles } from "@fluentui/react-components";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";

import React, { useEffect, useState } from "react";
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
import { from } from "rxjs";
import { sumScales } from "@/data/sumScales";
import { ScaleSumData } from "@/bluetooth/BluetoothManager";
import { Button } from "@fluentui/react-button";

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
  card: {
    width: "fit-content",
    maxWidth: "100%",
    height: "fit-content"
  },
  graph: {
    width: "90vw",
    height: "80vh"
  }
});

export const SessionGraphWrapper = (props: { saveHang: (userId: string, session: Session) => void }) => {
  const styles = useStyles();
  const { sessionManager } = useSessionContext();
  const [_, setCurrentSession] = useState<Session>();
  const [previousSession, setPreviousSession] = useState<Session>();
  useEffect(() => {
    sessionManager.getRecentSession().subscribe({
      next: (session) => {
        if (session.active) {
          setCurrentSession(session);
        } else {
          setCurrentSession(prevState => {
            if (prevState?.scaleData.length ?? 0 > 10) {
              setPreviousSession(session);
            }
            return undefined;
          });
        }
      },
      error: (e) => console.error(e),
      complete: () => console.info("SessionGraph complete")
    });
  }, [sessionManager]);
  const show = previousSession !== undefined;

  // TODO: make a sessions hook
  return (
    <div>
      {show &&
        <Card className={styles.card} size={"small"}>
          <SessionGraph
            session={previousSession}
            saveHang={() => {
              props.saveHang(
                "df285c54-2dea-4b92-8974-ea522a443766",
                previousSession
              );
            }} />
        </Card>
      }
    </div>
  );
};

export const SessionGraph = (props: { session: Session, saveHang?: () => void }) => {
  const styles = useStyles();
  const [sessionId, setSessionId] = useState<string>();
  const [scaleState, setScaleState] = useState<ScaleSumData[]>([]);
  if (sessionId != props.session.id) {
    setScaleState([]);
    setSessionId(props.session.id);
    from(props.session.scaleData)
      .pipe(sumScales)
      .subscribe({
        next: (data) => {
          setScaleState(prevState => {
            return [...prevState, data];
          });
        }
      });
  }

  // TODO: represent time difference between measurements? log error if range of sampling time is too large?
  let data = lineData(scaleState.map(data => {
    return { x: data.date.getTime(), y: data.weightPounds };
  }));
  return (
    <div>
      <div className={styles.graph}>
        {/* option/data refs are used to prevent re-rendering <Line>, prefer to update chart data via lineRef */}
        <Line options={options()} data={data} />
      </div>
      {props.saveHang && <Button onClick={props.saveHang}>Save</Button>}
    </div>
  );
};
