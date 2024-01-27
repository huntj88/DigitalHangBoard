import { map, Observable } from "rxjs";
import { ScaleData } from "@/bluetooth/BluetoothManager";

export function convertToPounds(dataFromAllScales: Observable<ScaleData>): Observable<ScaleData> {
  // y = mx + b
  // TODO: get m from hangboard over bluetooth for each load cell?
  // TODO: if hangboard has these values too, can display real time weight on small screen
  const m = [0.00005,0.0000497, 0.0000509, 0.0000514]
  return dataFromAllScales.pipe(
    map(x => {
      return {
        ...x,
        value: x.value * m[x.index!]
      }
    })
  )
}