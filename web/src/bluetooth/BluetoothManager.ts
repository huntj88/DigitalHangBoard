import { BluetoothPlatformWeb } from "@/bluetooth/BluetoothPlatform.web";
import { BehaviorSubject, filter, Observable, Subject } from "rxjs";
import {
  BluetoothPlatform,
  CharacteristicEventIntData,
} from "@/bluetooth/BluetoothPlatform.interface";
import { BluetoothPlatformMock } from "@/bluetooth/BluetoothPlatform.mock";

export class BluetoothManager {
  private platform = this.getPlatformImplementation();
  private scaleSubject = new Subject<ScaleData>();
  private connectedSubject = new BehaviorSubject(false);

  public async connect(): Promise<void> {
    this.platform.onConnectionChanged((isConnected) => {
      this.connectedSubject.next(isConnected);
    });
    await this.platform.connect();
    this.platform.addCharacteristicIntEventListener(
      "scale0",
      this.getEventCallback(0),
    );
    this.platform.addCharacteristicIntEventListener(
      "scale1",
      this.getEventCallback(1),
    );
    this.platform.addCharacteristicIntEventListener(
      "scale2",
      this.getEventCallback(2),
    );
    this.platform.addCharacteristicIntEventListener(
      "scale3",
      this.getEventCallback(3),
    );
  }

  public isConnected(): Observable<boolean> {
    return this.connectedSubject.asObservable();
  }

  public getScaleObservable(index?: number): Observable<ScaleData> {
    if (index !== undefined) {
      return this.scaleSubject
        .asObservable()
        .pipe(filter((event) => event.index === index));
    } else {
      return this.scaleSubject.asObservable();
    }
  }

  private getEventCallback(index: number) {
    return (event: CharacteristicEventIntData) => {
      this.scaleSubject.next({
        ...event,
        index: index,
      });
    };
  }

  private getPlatformImplementation(): BluetoothPlatform {
    return new BluetoothPlatformWeb()
    // return new BluetoothPlatformMock();
  }
}

export type ScaleData = {
  index?: number;
  value: number;
  date: Date;
};

export type ScaleAverageData = {
  value: number;
  earlierMeasurement: Date,
  latestMeasurement: Date
};
