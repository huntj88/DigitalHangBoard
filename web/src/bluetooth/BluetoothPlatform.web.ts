type Characteristics = { [key: string]: BluetoothRemoteGATTCharacteristic }

export class BluetoothPlatformWeb implements BluetoothPlatform {
    private service = "4e035799-bfff-47dd-a531-4ada55e703ec";
    private scale0 = "6766fbea-844a-459a-8def-643852f016b8";
    private scale1 = "3f19be02-a46f-4ea7-851b-1c2b891cf63e";
    private scale2 = "d064d929-1cf3-42df-abe9-b5e8a9e0e2bd";
    private scale3 = "15c40fb5-0311-465a-a77c-c42a8282e7cf";

    private characteristics: Characteristics | undefined = undefined;

    public connect(): Promise<void> {
        return navigator.bluetooth
            .requestDevice({filters: [{services: [this.service]}]})
            .then(device => device.gatt?.connect())
            .then(server => {
                if (!server) {
                    return Promise.reject("server undefined")
                }
                return server.getPrimaryService(this.service);
            })
            .then(service => {
                return Promise.all([
                    service.getCharacteristic(this.scale0),
                    service.getCharacteristic(this.scale1),
                    service.getCharacteristic(this.scale2),
                    service.getCharacteristic(this.scale3)
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
            const valueDataView = characteristic.value
            const value = valueDataView?.getInt32(valueDataView.byteOffset)
            if (value !== undefined) {
                onEvent({
                    timeStamp: event.timeStamp,
                    value
                });
            } else {
                console.warn("undefined value", characteristicName)
            }
        }
        characteristic.startNotifications().then((characteristic) => {
            characteristic.addEventListener("characteristicvaluechanged", onChanged)
            console.log("startNotifications: ", characteristic)
        })
    }
}