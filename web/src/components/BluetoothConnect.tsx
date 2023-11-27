import { useBluetoothContext } from "@/bluetooth/BluetoothProvider";

export const BluetoothConnect = () => {
  const { bluetoothManager, isConnected } = useBluetoothContext();
  return (
    <div>
      Bluetooth is required to connect to the Digital Hangboard, please select
      the bluetooth device.
      <button
        onClick={async () => {
          await bluetoothManager.connect();
        }}
      >
        {" "}
        Connect
      </button>
    </div>
  );
};
