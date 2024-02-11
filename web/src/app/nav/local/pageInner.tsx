"use client";

import { makeStyles } from "@fluentui/react-components";
import { useBluetoothContext } from "@/bluetooth/BluetoothProvider";
import Link from "next/link";
import { LiveGraphAverage } from "@/components/LiveGraph";
import { BluetoothConnect } from "@/components/BluetoothConnect";
import { SessionGraphWrapper } from "@/components/SessionGraph";
import React from "react";
import { Session } from "@/session/SessionManager";

const useStyles = makeStyles({
  main: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    columnGap: "16px",
    rowGap: "36px",
    minHeight: "100vh"
  }
});

export default function PageInner(props: { saveHang: (userId: string, session: Session) => void }) {
  const styles = useStyles();
  const { isConnected } = useBluetoothContext();

  return (
    <main className={styles.main}>
      <Link href={"/nav/local/calibrate"}>Calibrate</Link>
      {isConnected ? <LiveGraphAverage /> : <BluetoothConnect />}
      {/*{isConnected && <LiveGraphIndex index={0} />}*/}
      {/*{isConnected && <LiveGraphIndex index={1} />}*/}
      {/*{isConnected && <LiveGraphIndex index={2} />}*/}
      {/*{isConnected && <LiveGraphIndex index={3} />}*/}
      {isConnected && <SessionGraphWrapper saveHang={props.saveHang} />}
    </main>
  );
}
