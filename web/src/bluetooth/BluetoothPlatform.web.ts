type Characteristics = { [key: string]: BluetoothRemoteGATTCharacteristic }

export class BluetoothPlatformWeb implements BluetoothPlatform {
    private characteristics: Characteristics | undefined = undefined;

    public connect(): Promise<void> {
        return navigator.bluetooth
            .requestDevice({filters: [{services: [service]}]})
            .then(device => device.gatt?.connect())
            .then(server => {
                if (!server) {
                    return Promise.reject("server undefined")
                }
                return server.getPrimaryService(service);
            })
            .then(service => {
                return Promise.all([
                    service.getCharacteristic(scale0),
                    service.getCharacteristic(scale1),
                    service.getCharacteristic(scale2),
                    service.getCharacteristic(scale3)
                ])
            })
            .then(characteristics => {
                this.characteristics = {
                    scale0: characteristics[0],
                    scale1: characteristics[1],
                    scale2: characteristics[2],
                    scale3: characteristics[3],
                }
            })
    }

    public addCharacteristicIntEventListener(characteristicName: string, onEvent: (event: CharacteristicEventIntData) => void): void {
        const characteristic = this.characteristics![characteristicName]
        const onChanged: (this: BluetoothRemoteGATTCharacteristic, ev: Event) => void = (event: Event) => {
            if (this.isCharacteristic(event.currentTarget)) {
                const byteInfo = event.currentTarget.value;
                const value = byteInfo?.getInt32(byteInfo.byteOffset)
                value !== undefined && onEvent({
                    date: new Date(event.timeStamp),
                    value
                });
            }
        }
        characteristic.addEventListener("characteristicvaluechanged", onChanged)
        characteristic.startNotifications().then((characteristic) => {
            console.log("startNotifications: ", characteristic)
        })
    }

    private isCharacteristic(value: any): value is BluetoothRemoteGATTCharacteristic {
        return value.value !== undefined && value.uuid != undefined
    }
}