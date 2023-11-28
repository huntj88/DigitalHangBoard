"use client";

import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import React from "react";
import { BluetoothConnect } from "@/components/BluetoothConnect";
import { useBluetoothContext } from "@/bluetooth/BluetoothProvider";
import { LiveGraphAverage, LiveGraphIndex } from "@/components/LiveGraph";
import { SessionGraphWrapper } from "@/components/SessionGraph";

// Create a custom 'useStyles' hook to define the styling for the Home component.
const useStyles = makeStyles({
  container: {
    ...shorthands.padding(tokens.spacingHorizontalXXL),
    ...shorthands.gap(tokens.spacingVerticalM),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    // minHeight: "100vh",
  },
});

export default function LocalPage() {
  const styles = useStyles();
  const { isConnected } = useBluetoothContext();

  return (
    <main className={styles.container}>
      {isConnected ? <LiveGraphAverage /> : <BluetoothConnect />}
      {isConnected && <LiveGraphIndex index={0} />}
      {isConnected && <LiveGraphIndex index={1} />}
      {isConnected && <LiveGraphIndex index={2} />}
      {isConnected && <LiveGraphIndex index={3} />}
      {isConnected && <SessionGraphWrapper />}
    </main>
  );
}

// default behavior if person started hanging without picking type would be record from first weight to end weight
// could also choose timed, etc
