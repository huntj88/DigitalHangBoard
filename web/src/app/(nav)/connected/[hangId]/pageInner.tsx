"use client";

import { Hang } from "@/app/server/hang";
import * as React from "react";
import { HangCard } from "@/components/HangCard";
import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  graphSizeOverride: {
    width: "90vw",
    height: "80vh"
  }
});

export default function PageInner(props: { hang: Hang }) {
  const styles = useStyles();
  return <HangCard hang={props.hang} graphSizeOverride={styles.graphSizeOverride} />;
}