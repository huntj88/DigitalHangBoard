import {
    BluetoothPlatform,
    CharacteristicEventIntData,
} from "@/bluetooth/BluetoothPlatform.interface";

export class BluetoothPlatformMock implements BluetoothPlatform {
    private onConnectionChangedCallback: ((isConnected: boolean) => void) | undefined = undefined

    public onConnectionChanged(onChanged: (isConnected: boolean) => void): void {
        this.onConnectionChangedCallback = onChanged
    }

    public async connect(): Promise<void> {
        if (this.onConnectionChangedCallback) {
            this.onConnectionChangedCallback!(true)
        } else {
            throw new Error("connectionChanged callback not configured")
        }
    }

    public addCharacteristicIntEventListener(characteristicName: string, onEvent: (event: CharacteristicEventIntData) => void): void {
        let previous = 50
        setInterval(() => {
            const newValue = generateRandom(previous - 10, previous + 10)
            onEvent({date: new Date(), value: newValue})
            previous = newValue
        }, 150)
        // TODO: report from mock json
    }
}

function generateRandom(min = 0, max = 100) {

    // find diff
    let difference = max - min;

    // generate random number
    let rand = Math.random();

    // multiply with difference
    rand = Math.floor(rand * difference);

    // add with min value
    rand = rand + min;

    return rand;
}