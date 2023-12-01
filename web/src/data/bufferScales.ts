import { bufferTime, filter, map, Observable, OperatorFunction } from "rxjs";
import { ScaleData } from "@/bluetooth/BluetoothManager";

export function bufferScales(): OperatorFunction<ScaleData, ScaleData[]>  {
  let buffer: ScaleData[] = []
  return (source) =>
    new Observable((destination) => {
      source.subscribe({
        next: (scaleData) => {
          buffer.push(scaleData)
          let index0Exist = buffer.find((x) => x.index === 0);
          let index1Exist = buffer.find((x) => x.index === 1);
          let index2Exist = buffer.find((x) => x.index === 2);
          let index3Exist = buffer.find((x) => x.index === 3);

          if (index0Exist && index1Exist && index2Exist && index3Exist) {
            destination.next([...buffer])
            buffer = []
          }
        },
        error: (e) => destination.error(e),
        complete: () => destination.complete()
      })
    })
}