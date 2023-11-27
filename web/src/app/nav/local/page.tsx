"use client";

import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import React from "react";
import { BluetoothConnect } from "@/components/BluetoothConnect";
import { useBluetoothContext } from "@/bluetooth/BluetoothProvider";
import { LiveGraph } from "@/components/LiveGraph";

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
      {isConnected ? <LiveGraph /> : <BluetoothConnect />}
    </main>
  );
}

// default behavior if person started hanging without picking type would be record from first weight to end weight
// could also choose timed, etc
