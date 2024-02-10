"use client";

import * as React from "react";
import {
  makeStyles,
  shorthands,
  mergeClasses,
  Text
} from "@fluentui/react-components";
import { Card, CardHeader } from "@fluentui/react-components";
import { Hang } from "@/app/server/hang";

const resolveAsset = (asset: string) => {
  const ASSET_URL =
    "https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-card/stories/assets/";

  return `${ASSET_URL}${asset}`;
};

const useStyles = makeStyles({
  main: {
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    columnGap: "16px",
    rowGap: "36px"
  },

  card: {
    width: "fit-content",
    maxWidth: "100%",
    height: "fit-content",
  },

  flex: {
    ...shorthands.gap("4px"),
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },

  appIcon: {
    ...shorthands.borderRadius("4px"),
    height: "32px"
  },

  cardFooter: {
    alignItems: "center",
    justifyContent: "space-between"
  }
});

export const HangCard = (props: { hang: Hang }) => {
  const styles = useStyles();
  let elapsedSeconds = 0;
  console.log("card", props.hang);
  if (props.hang.timeSeries && props.hang.timeSeries.length > 0) {
    const startTime = props.hang.timeSeries[0].timestamp.getTime()
    const endTime = props.hang.timeSeries[props.hang.timeSeries.length - 1].timestamp.getTime()
    elapsedSeconds = (endTime - startTime) / 1000;
  }

  return (
    <Card className={styles.card} size={"small"}>
      <header className={styles.flex}>
        <img
          className={styles.appIcon}
          src={resolveAsset("logo.svg")}
          alt="Application one logo"
        />
      </header>

      <CardHeader
        header={
          <Text weight="semibold">
            {props.hang.userId}
          </Text>
        }
        description={
          <div>
            <p>date: {props.hang.createdAt.toString()}</p>
            <p>duration: {elapsedSeconds} seconds</p>
            <p>max weight: 120 pounds</p>
          </div>
        }
      />

      <footer className={mergeClasses(styles.flex, styles.cardFooter)}>
        <span>Automated</span>
        <span>3290</span>
      </footer>
    </Card>
  );
};

export const HangList = (props: { hangs: Hang[] }) => {
  const styles = useStyles();

  return (
    <div className={styles.main}>
      {props.hangs.map(hang => <HangCard key={hang.hangId} hang={hang} />)}
    </div>
  );
};
