"use client";

import * as React from "react";
import {
  makeStyles,
  shorthands,
  Text
} from "@fluentui/react-components";
import { Card, CardHeader } from "@fluentui/react-components";
import { Hang } from "@/app/server/hang";
import { SessionGraph } from "@/components/SessionGraph";
import { hangToSession } from "@/data/hangToSession";
import Link from "next/link";

const resolveAsset = (asset: string) => {
  const ASSET_URL =
    "https://raw.githubusercontent.com/microsoft/fluentui/master/packages/react-components/react-card/stories/assets/";

  return `${ASSET_URL}${asset}`;
};

const useStyles = makeStyles({
  main: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: "16px",
    rowGap: "36px",
    justifyContent: "space-evenly"
  },

  card: {
    width: "fit-content",
    maxWidth: "100%",
    height: "fit-content"
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
  }
});

export const HangCard = (props: { hang: Hang, graphSizeOverride?: string }) => {
  const session = hangToSession(props.hang);
  const styles = useStyles();

  let maxWeightPounds = 0;
  if (props.hang.timeSeries && props.hang.timeSeries.length > 0) {
    // TODO: read from report on hang itself/create reports that are associated with hang
    const max = props.hang.timeSeries.reduce((previousValue, currentValue) => {
      if (previousValue.weightPounds >= currentValue.weightPounds) {
        return previousValue;
      } else {
        return currentValue;
      }
    });

    maxWeightPounds = max.weightPounds;
  }

  return (
    <Link href={`/nav/connected/${props.hang.hangId}`}>
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
              <p>max weight: {maxWeightPounds} pounds</p>
            </div>
          }
        />
        <SessionGraph session={session} graphSizeOverride={props.graphSizeOverride} />
        <br />
      </Card>
    </Link>
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
