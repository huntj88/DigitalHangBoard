"use client";

import { Ref, useEffect, useRef, useState } from "react";
import { Input } from "@fluentui/react-input";
import { useBluetoothContext } from "@/bluetooth/BluetoothProvider";
import { ScaleData, WeightUnit } from "@/bluetooth/BluetoothManager";
import { Button } from "@fluentui/react-button";
import regression, { DataPoint } from "regression";

type CalibrationMeasurement = {
  index: number,
  knownWeight: number,
  rawValue: number,
}
export default function CalibrationPage() {
  const last50Ref = useRef<ScaleData[]>([]);
  const knownWeightInputRef = useRef<HTMLInputElement>();
  const { bluetoothManager } = useBluetoothContext();
  const [measurements, setMeasurements] = useState<CalibrationMeasurement[]>([]);

  useEffect(() => {
    const subscription = bluetoothManager
      .getScaleObservable({ unit: WeightUnit.Pounds })
      .subscribe({
        next: (data) => {
          if (last50Ref.current.length >= 50) {
            last50Ref.current.shift();
          }
          last50Ref.current.push(data);
        }
      });
    return () => subscription.unsubscribe();
  }, [bluetoothManager]);

  return <div>
    <Input ref={knownWeightInputRef as Ref<HTMLInputElement>} type={"number"}/>
    <br />
    <Button onClick={() => {
      setMeasurements(prevState => {
        const newMeasurement = {
          index: 0,
          knownWeight: parseInt(knownWeightInputRef.current!.value),
          rawValue: average(last50Ref.current.filter(x => x.index === 0).map(x => x.value))
        };
        return [...prevState, newMeasurement];
      });
    }}>Measure index 0</Button>
    <br />
    <Button onClick={() => {
      setMeasurements(prevState => {
        const newMeasurement = {
          index: 1,
          knownWeight: parseInt(knownWeightInputRef.current!.value),
          rawValue: average(last50Ref.current.filter(x => x.index === 1).map(x => x.value))
        };
        return [...prevState, newMeasurement];
      });
    }}>Measure index 1</Button>
    <br />
    <Button onClick={() => {
      setMeasurements(prevState => {
        const newMeasurement = {
          index: 2,
          knownWeight: parseInt(knownWeightInputRef.current!.value),
          rawValue: average(last50Ref.current.filter(x => x.index === 2).map(x => x.value))
        };
        return [...prevState, newMeasurement];
      });
    }}>Measure index 2</Button>
    <br />
    <Button onClick={() => {
      setMeasurements(prevState => {
        const newMeasurement = {
          index: 3,
          knownWeight: parseInt(knownWeightInputRef.current!.value),
          rawValue: average(last50Ref.current.filter(x => x.index === 3).map(x => x.value))
        };
        return [...prevState, newMeasurement];
      });
    }}>Measure index 3</Button>
    <br />
    {measurements.map(x => {
      return <div key={x.rawValue}><p>{x.rawValue}</p><p>{x.knownWeight}</p></div>;
    })}
    <Button onClick={() => {
      linearRegression(0, measurements)
      linearRegression(1, measurements)
      linearRegression(2, measurements)
      linearRegression(3, measurements)
    }}>Calculate Slope</Button>
  </div>;
}

function average(array: number[]) {
  const sum = array.reduce((previousValue, currentValue) => {
    return previousValue + currentValue;
  });
  return sum / array.length;
}

function linearRegression(index: number, measurements: CalibrationMeasurement[]) {
  const data = measurements
    .filter(m => m.index === index)
    .map((m) => [m.rawValue, m.knownWeight]);
  const result = regression.linear(data as DataPoint[], {precision: 7});
  console.log("equation", "index: ", index, result.string, result.equation)
  return result
  // let x = average(last50.filter(x => x.index === index).map(x => x.value));
  // const dataPoint = result.predict(x);
}