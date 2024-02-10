import { combineLatestWith, map, Observable } from "rxjs";
import { ScaleData, ScaleDataWeight } from "@/bluetooth/BluetoothManager";

export function convertToPounds(dataFromAllScales: Observable<ScaleData>, calibrationData: Observable<number[]>): Observable<ScaleDataWeight> {
  // y = mx + b, b is always 0
  const combined: Observable<[ScaleData, number[]]> = dataFromAllScales
    .pipe(combineLatestWith(calibrationData));

  return combined.pipe(
    map(scaleAndCalibrationData => {
      const scaleData = scaleAndCalibrationData[0];
      const calibrationData = scaleAndCalibrationData[1];
      const m = calibrationData[scaleData.index];
      return {
        ...scaleData,
        weightPounds: scaleData.value * m
      };
    })
  );
}