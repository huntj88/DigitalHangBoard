import { map, Observable } from "rxjs";
import { ScaleSumData, ScaleDataWeight } from "@/bluetooth/BluetoothManager";
import { bufferScales } from "@/data/bufferScales";

export function sumScales(dataFromAllScales: Observable<ScaleDataWeight>): Observable<ScaleSumData> {
  return dataFromAllScales.pipe(
    bufferScales(),
    map((buffered) => {
      const average = (array: number[]) =>
        Math.round(array.reduce((a, b) => a + b) / array.length);
      const scale0 = average(
        buffered.filter((x) => x.index == 0).map((x) => x.value)
      );
      const scale1 = average(
        buffered.filter((x) => x.index == 1).map((x) => x.value)
      );
      const scale2 = average(
        buffered.filter((x) => x.index == 2).map((x) => x.value)
      );
      const scale3 = average(
        buffered.filter((x) => x.index == 3).map((x) => x.value)
      );

      const scale0Weight = average(
        buffered.filter((x) => x.index == 0).map((x) => x.weightPounds)
      );
      const scale1Weight = average(
        buffered.filter((x) => x.index == 1).map((x) => x.weightPounds)
      );
      const scale2Weight = average(
        buffered.filter((x) => x.index == 2).map((x) => x.weightPounds)
      );
      const scale3Weight = average(
        buffered.filter((x) => x.index == 3).map((x) => x.weightPounds)
      );

      const scaleTotal = scale0Weight + scale1Weight + scale2Weight + scale3Weight;

      // TODO: this scale factor should be retrieved from hangboard
      const scaleFactor = 1.1071; // found with weight applied through handboard
      const totalCalibrated = scaleTotal * scaleFactor
      return {
        weightPounds: totalCalibrated,
        date: buffered[0].date,
        scale0,
        scale1,
        scale2,
        scale3
      };
    })
  );
}
