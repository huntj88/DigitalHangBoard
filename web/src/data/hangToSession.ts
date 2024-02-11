import { Hang } from "@/app/server/hang";
import { ScaleDataWeight } from "@/bluetooth/BluetoothManager";
import { Session } from "@/session/SessionManager";

export function hangToSession(hang: Hang): Session {
  const sessionData: ScaleDataWeight[] = hang.timeSeries
      ?.map(moment => {
        return [
          {
            index: 0,
            value: moment.scale0,
            date: moment.timestamp,
            weightPounds: moment.scale0 * hang.calibration[0],
          },
          {
            index: 1,
            value: moment.scale1,
            date: moment.timestamp,
            weightPounds: moment.scale1 * hang.calibration[1],
          },
          {
            index: 2,
            value: moment.scale2,
            date: moment.timestamp,
            weightPounds: moment.scale2 * hang.calibration[2],
          },
          {
            index: 3,
            value: moment.scale3,
            date: moment.timestamp,
            weightPounds: moment.scale3 * hang.calibration[3],
          }];
      })
      ?.reduce((previousValue, currentValue, _0, _1) => {
        return previousValue.concat(currentValue);
      })
    ?? [];
  return {
    active: false,
    id: hang.hangId.toString(),
    scaleData: sessionData,
    calibration: hang.calibration
  };
}