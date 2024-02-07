import {
  BluetoothPlatform, calibration,
  CharacteristicEventIntData,
  scale0,
  scale1,
  scale2,
  scale3,
  serviceId
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
      filters: [{ services: [serviceId] }]
    });
    console.log("connecting");
    const server: BluetoothRemoteGATTServer | undefined =
      await device.gatt?.connect();
    if (!server) {
      throw new Error("server undefined");
    }

    console.log("getting service");
    const service: BluetoothRemoteGATTService =
      await server.getPrimaryService(serviceId);

    console.log("getting characteristics");
    const characteristics: BluetoothRemoteGATTCharacteristic[] =
      await Promise.all([
        service.getCharacteristic(scale0),
        service.getCharacteristic(scale1),
        service.getCharacteristic(scale2),
        service.getCharacteristic(scale3),
        service.getCharacteristic(calibration)
      ]);
    this.characteristics = {
      scale0: characteristics[0],
      scale1: characteristics[1],
      scale2: characteristics[2],
      scale3: characteristics[3],
      calibration: characteristics[4]
    };

    console.log("adding disconnect listener");
    if (this.onConnectionChangedCallback) {
      this.onConnectionChangedCallback!(true);
      device.addEventListener("gattserverdisconnected", () => {
        this.onConnectionChangedCallback!(false);
        console.log("disconnect");
      });
    } else {
      throw new Error("connectionChanged callback not configured");
    }
  }

  public async addCharacteristicIntEventListener(
    characteristicName: string,
    onEvent: (event: CharacteristicEventIntData) => void
  ): Promise<void> {
    const characteristic = this.characteristics![characteristicName];
    const onChanged: (
      this: BluetoothRemoteGATTCharacteristic,
      ev: Event
    ) => void = (_: Event) => {
      const byteInfo = characteristic.value;
      const value = byteInfo?.getInt32(byteInfo.byteOffset, true);
      value !== undefined &&
      onEvent({
        date: new Date(),
        value
      });
    };
    console.log("bluetooth web", "adding event listener");
    characteristic.addEventListener("characteristicvaluechanged", onChanged);
    console.log("bluetooth web", "starting notifications", characteristic);
    return characteristic.startNotifications().then((characteristic) => {
      console.log("startNotifications: ", characteristic);
    }).catch(e => {
      console.error("bluetooth web", "error", e, characteristic);
    });
  }

  public async getCharacteristicStringValue(characteristicName: string): Promise<string> {
    const characteristic = this.characteristics![characteristicName];
    const byteInfo = await characteristic.readValue();
    return new TextDecoder().decode(byteInfo)
  }
}
