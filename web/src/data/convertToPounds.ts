import { map, Observable } from "rxjs";
import { ScaleData } from "@/bluetooth/BluetoothManager";

export function convertToPounds(dataFromAllScales: Observable<ScaleData>): Observable<ScaleData> {
  // y = mx + b
  // TODO: get m from hangboard over bluetooth for each load cell?
  const m = [0.000049,0.0000493, 0.0000502, 0.0000505]
  return dataFromAllScales.pipe(
    map(x => {
      return {
        ...x,
        value: x.value * m[x.index!]
      }
    })
  )
}