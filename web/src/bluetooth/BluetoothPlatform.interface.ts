interface BluetoothPlatform {
    connect(): Promise<void>
    addCharacteristicIntEventListener(characteristic: string, onEvent: (event: CharacteristicEventIntData) => void): void;
}

type CharacteristicEventIntData = { date: Date, value: number }

const service = "4e035799-bfff-47dd-a531-4ada55e703ec";
const scale0 = "6766fbea-844a-459a-8def-643852f016b8";
const scale1 = "3f19be02-a46f-4ea7-851b-1c2b891cf63e";
const scale2 = "d064d929-1cf3-42df-abe9-b5e8a9e0e2bd";
const scale3 = "15c40fb5-0311-465a-a77c-c42a8282e7cf";