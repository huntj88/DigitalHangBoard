import {
  BluetoothPlatform,
  CharacteristicEventIntData,
  scale0,
  scale1,
  scale2,
  scale3,
  serviceId,
} from "@/bluetooth/BluetoothPlatform.interface";

type Characteristics = { [key: string]: BluetoothRemoteGATTCharacteristic };

export class BluetoothPlatformWeb implements BluetoothPlatform {
  private characteristics: Characteristics | undefined = undefined;
  private onConnectionChangedCallback:
    | ((isConnected: boolean) => void)
    | undefined = undefined;

  public onConnectionChanged(onChanged: (isConnected: boolean) => void): void {
    this.onConnectionChangedCallback = onChanged;
  }

  public async connect(): Promise<void> {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ services: [serviceId] }],
    });
    const server: BluetoothRemoteGATTServer | undefined =
      await device.gatt?.connect();
    if (!server) {
      throw new Error("server undefined");
    }
    const service: BluetoothRemoteGATTService =
      await server.getPrimaryService(serviceId);
    const characteristics: BluetoothRemoteGATTCharacteristic[] =
      await Promise.all([
        service.getCharacteristic(scale0),
        service.getCharacteristic(scale1),
        service.getCharacteristic(scale2),
        service.getCharacteristic(scale3),
      ]);
    this.characteristics = {
      scale0: characteristics[0],
      scale1: characteristics[1],
      scale2: characteristics[2],
      scale3: characteristics[3],
    };
    if (this.onConnectionChangedCallback) {
      this.onConnectionChangedCallback!(true);
      device.addEventListener("gattserverdisconnected", () => {
        this.onConnectionChangedCallback!(false);
      });
    } else {
      throw new Error("connectionChanged callback not configured");
    }
  }

  public addCharacteristicIntEventListener(
    characteristicName: string,
    onEvent: (event: CharacteristicEventIntData) => void,
  ): void {
    const characteristic = this.characteristics![characteristicName];
    const onChanged: (
      this: BluetoothRemoteGATTCharacteristic,
      ev: Event,
    ) => void = (event: Event) => {
      if (this.isCharacteristic(event.currentTarget)) {
        const byteInfo = event.currentTarget.value;
        const value = byteInfo?.getInt32(byteInfo.byteOffset);
        value !== undefined &&
          onEvent({
            date: new Date(event.timeStamp),
            value,
          });
      }
    };
    characteristic.addEventListener("characteristicvaluechanged", onChanged);
    characteristic.startNotifications().then((characteristic) => {
      console.log("startNotifications: ", characteristic);
    });
  }

  private isCharacteristic(
    value: any,
  ): value is BluetoothRemoteGATTCharacteristic {
    return value.value !== undefined && value.uuid != undefined;
  }
}
