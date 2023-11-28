import { bufferTime, filter, map, Observable } from "rxjs";
import { ScaleData } from "@/bluetooth/BluetoothManager";

export const sumScales = (dataFromAllScales: Observable<ScaleData>) =>
  dataFromAllScales.pipe(
    // todo: buffer until one of each scale instead
    bufferTime(50),
    filter((x) => x.length >= 4),
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
        date: buffered[0]?.date, // todo: average time?
      };
    }),
  );