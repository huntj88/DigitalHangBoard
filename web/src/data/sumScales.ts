import { bufferTime, filter, map, Observable } from "rxjs";
import { ScaleAverageData, ScaleData } from "@/bluetooth/BluetoothManager";
import { bufferScales } from "@/data/bufferScales";

export function sumScales(dataFromAllScales: Observable<ScaleData>): Observable<ScaleAverageData> {
  return dataFromAllScales.pipe(
    bufferScales(),
    map((buffered) => {
      const average = (array: number[]) =>
        array.reduce((a, b) => a + b) / array.length;
      const scale0 = average(
        buffered.filter((x) => x.index == 0).map((x) => x.value),
      );
      const scale1 = average(
        buffered.filter((x) => x.index == 1).map((x) => x.value),
      );
      const scale2 = average(
        buffered.filter((x) => x.index == 2).map((x) => x.value),
      );
      const scale3 = average(
        buffered.filter((x) => x.index == 3).map((x) => x.value),
      );
      const scaleTotal = scale0 + scale1 + scale2 + scale3;
      return {
        value: scaleTotal,
        earlierMeasurement: buffered[0].date,
        latestMeasurement: buffered[buffered.length - 1].date
      };
    }),
  );
}