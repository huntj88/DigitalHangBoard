import { BluetoothPlatformWeb } from "@/bluetooth/BluetoothPlatform.web";
import { BehaviorSubject, filter, map, Observable, Subject } from "rxjs";
import {
  BluetoothPlatform,
  CharacteristicEventIntData
} from "@/bluetooth/BluetoothPlatform.interface";
import { convertToPounds } from "@/data/convertToPounds";

export class BluetoothManager {
  private platform = this.getPlatformImplementation();
  private scaleSubject = new Subject<ScaleData>();
  private connectedSubject = new BehaviorSubject(false);
  private calibrationSubject = new BehaviorSubject<number[]>([]);

  public async connect(): Promise<void> {
    this.platform.onConnectionChanged((isConnected) => {
      this.connectedSubject.next(isConnected);
    });
    await this.platform.connect();
    await this.getCalibrationData();
    await this.platform.addCharacteristicIntEventListener(
      "scale0",
      this.getEventCallback(0)
    );
    await this.platform.addCharacteristicIntEventListener(
      "scale1",
      this.getEventCallback(1)
    );
    await this.platform.addCharacteristicIntEventListener(
      "scale2",
      this.getEventCallback(2)
    );
    await this.platform.addCharacteristicIntEventListener(
      "scale3",
      this.getEventCallback(3)
    );
  }

  public isConnected(): Observable<boolean> {
    return this.connectedSubject.asObservable();
  }

  public getScaleObservable(options?: ScaleObservableOptions): Observable<ScaleData> {
    const scaleDataByIndexOrAll = (): Observable<ScaleData> => {
      if (options?.index !== undefined) {
        return this.scaleSubject
          .asObservable()
          .pipe(filter((event) => event.index === options.index));
      } else {
        return this.scaleSubject.asObservable();
      }
    };

    if (options?.unit === undefined) {
      return scaleDataByIndexOrAll();
    } else if (options.unit === WeightUnit.Pounds) {
      return this.calibrationSubject.asObservable().pipe(calibration =>
        convertToPounds(scaleDataByIndexOrAll(), calibration)
      );
    } else {
      throw new Error(`weight unit ${options.unit} not supported`);
    }
  }

  private async getCalibrationData(): Promise<void> {
    const value = await this.platform.getCharacteristicStringValue("calibration");
    const calibrationArray = value.split(",").map(x => Number(x));
    console.log("calibration", calibrationArray);
    this.calibrationSubject.next(calibrationArray);
  }

  private getEventCallback(index: number) {
    return (event: CharacteristicEventIntData) => {
      this.scaleSubject.next({
        ...event,
        index: index
      });
    };
  }

  private getPlatformImplementation(): BluetoothPlatform {
    return new BluetoothPlatformWeb();
    // return new BluetoothPlatformMock();
  }
}

export type ScaleObservableOptions = {
  index?: number,
  unit?: WeightUnit
}

export enum WeightUnit {
  Kilograms,
  Pounds,
}

export type ScaleData = {
  index?: number;
  value: number;
  date: Date;
};

export type ScaleSumData = {
  value: number;
  date: Date;
  scale0: number;
  scale1: number;
  scale2: number;
  scale3: number;
};
