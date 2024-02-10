"use client";

import * as React from "react";
import {
  makeStyles,
  shorthands,
  mergeClasses,
  Text
} from "@fluentui/react-components";
import { Card, CardHeader } from "@fluentui/react-components";
import { Hang, Moment } from "@/app/server/hang";
import { Session } from "@/session/SessionManager";
import { ScaleData } from "@/bluetooth/BluetoothManager";
import { SessionGraph } from "@/components/SessionGraph";

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
  },

  cardFooter: {
    alignItems: "center",
    justifyContent: "space-between"
  }
});

export const HangCard = (props: { hang: Hang }) => {
  const sessionData: ScaleData[] = props.hang.timeSeries
      ?.map(moment => {
        return [
          {
            index: 0,
            value: moment.scale0,
            date: moment.timestamp
          },
          {
            index: 1,
            value: moment.scale1,
            date: moment.timestamp
          },
          {
            index: 2,
            value: moment.scale2,
            date: moment.timestamp
          },
          {
            index: 3,
            value: moment.scale3,
            date: moment.timestamp
          }];
      })
      ?.reduce((previousValue, currentValue, _0, _1) => {
        return previousValue.concat(currentValue);
      })
    ?? [];
  const s: Session = {
    active: false,
    id: props.hang.hangId.toString(),
    scaleData: sessionData
  };

  const styles = useStyles();
  let elapsedSeconds = 0;
  let maxWeightPounds = 0;
  console.log("card", props.hang);
  if (props.hang.timeSeries && props.hang.timeSeries.length > 0) {
    const startTime = props.hang.timeSeries[0].timestamp.getTime();
    const endTime = props.hang.timeSeries[props.hang.timeSeries.length - 1].timestamp.getTime();
    elapsedSeconds = (endTime - startTime) / 1000;

    const calibrationArray = props.hang.calibration.split(",").map(x => Number(x));

    const calculateWeight = (moment: Moment) => {
      const pounds0 = moment.scale0; // * calibrationArray[0];
      const pounds1 = moment.scale1; //* calibrationArray[1];
      const pounds2 = moment.scale2; //* calibrationArray[2];
      const pounds3 = moment.scale3; //* calibrationArray[3];
      return (pounds0 + pounds1 + pounds2 + pounds3) * 0.0000500; // TODO real calibration values
    };

    const max = props.hang.timeSeries.reduce((previousValue, currentValue, currentIndex, array) => {
      if (calculateWeight(previousValue) >= calculateWeight(currentValue)) {
        return previousValue;
      } else {
        return currentValue;
      }
    });

    maxWeightPounds = calculateWeight(max);
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
            <p>max weight: {maxWeightPounds} pounds</p>
          </div>
        }
      />

      <SessionGraph session={s} saveHang={() => {
      }} />

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
