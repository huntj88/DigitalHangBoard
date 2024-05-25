"use client";

import * as React from "react";
import {
  makeStyles,
  shorthands,
  Text
} from "@fluentui/react-components";
import { Card, CardHeader } from "@fluentui/react-components";
import { Hang } from "@/app/server/hang";
import { hangToSession } from "@/data/hangToSession";
import Link from "next/link";
import { ReactNode } from "react";
import { SessionGraph } from "@/components/SessionGraph";

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

  // TODO: somewhere floats are getting truncated into integers on 2024-05-24 02:28:49.871000 +00:00, values before that have decimals, likely in db bulk insert change?
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

  const shouldRenderGraph = session.scaleData.length > 0 &&
    (
      session.scaleData.length <= 3 ||
        // just a bad attempt at limiting slowness, having multiple graphs on screen slows render
        // TODO: something better
      session.scaleData[0].date.getTime() > new Date().getTime() - 1000 * 60 * 60 * 24 * 5
    );
  return (
    <Link href={`/connected/${props.hang.hangId}`}>
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
              {maxWeightPounds && <p>max weight: {maxWeightPounds} pounds</p>}
            </div>
          }
        />
        {shouldRenderGraph && <SessionGraph session={session} graphSizeOverride={props.graphSizeOverride} />}
        <br />
      </Card>
    </Link>
  );
};


export const HangListStyled = (props: { children: ReactNode[] }) => {
  const styles = useStyles();

  return (
    <div className={styles.main}>
      {props.children}
    </div>
  );
};
