"use client";

import { Ref, useEffect, useRef, useState } from "react";
import { Input } from "@fluentui/react-input";
import { useBluetoothContext } from "@/bluetooth/BluetoothProvider";
import { ScaleData } from "@/bluetooth/BluetoothManager";
import { Button } from "@fluentui/react-button";
import regression, { DataPoint } from "regression";

type CalibrationMeasurement = {
  index: number,
  knownWeight: number,
  rawValue: number,
}
export default function CalibrationPage() {
  const last10Ref = useRef<ScaleData[]>([]);
  const inputRef = useRef<HTMLInputElement>();
  const { bluetoothManager } = useBluetoothContext();
  const [measurements, setMeasurements] = useState<CalibrationMeasurement[]>([]);
  const [result, setResult] = useState<regression.DataPoint>();
  useEffect(() => {
    const subscription = bluetoothManager
      .getScaleObservable(0)
      .subscribe({
        next: (data) => {
          if (last10Ref.current.length >= 10) {
            last10Ref.current.shift();
          }
          last10Ref.current.push(data);
        }
      });
    return () => subscription.unsubscribe();
  }, [bluetoothManager]);

  const x = result?.[0] ?? 0;
  const y = result?.[1] ?? 0;

  return <div>
    <Input ref={inputRef as Ref<HTMLInputElement>} />
    <Button onClick={() => {
      setMeasurements(prevState => {
        const newMeasurement = {
          index: 0,
          knownWeight: parseInt(inputRef.current!.value),
          rawValue: average(last10Ref.current.map(x => x.value))
        };
        return [...prevState, newMeasurement];
      });
    }}>Take measurement</Button>
    {measurements.map(x => {
      return <div key={x.rawValue}><p>{x.rawValue}</p><p>{x.knownWeight}</p></div>;
    })}
    <Button onClick={() => {
      let data = measurements.map((m) => [m.rawValue, m.knownWeight]);
      const result = regression.linear(data as DataPoint[], {precision: 5});
      let x1 = average(last10Ref.current.map(x => x.value));
      const dataPoint = result.predict(x1);
      setResult(dataPoint);
    }}>Calculate Slope</Button>
    <p>{`raw x: ${x}`}</p>
    <p>{`predict y: ${y}`}</p>
  </div>;
}

function average(array: number[]) {
  const sum = array.reduce((previousValue, currentValue) => {
    return previousValue + currentValue;
  });
  return sum / array.length;
}