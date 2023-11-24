import {useBluetoothContext} from "@/bluetooth/BluetoothProvider";

export const BluetoothConnect = () => {
    const {bluetoothManager, isConnected} = useBluetoothContext()
    return (
        <div>
            Bluetooth connection status: {isConnected.toString()}
            <button onClick={async () => {
                await bluetoothManager.connect()
            }}> Connect
            </button>
        </div>
    )
}