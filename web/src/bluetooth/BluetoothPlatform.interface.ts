interface BluetoothPlatform {
    connect(): Promise<void>
    addCharacteristicIntEventListener(characteristic: string, onEvent: (event: CharacteristicEventIntData) => void): void;
}

type CharacteristicEventIntData = { timeStamp: number, value: number }