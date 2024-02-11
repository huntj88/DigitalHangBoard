"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { BluetoothManager } from "@/bluetooth/BluetoothManager";
import { ChildrenProp } from "@/components/util";

const BluetoothContext = createContext<{
  bluetoothManager: BluetoothManager;
  isConnected: boolean;
}>({
  bluetoothManager: new BluetoothManager(),
  isConnected: false
});

export const BluetoothProvider = ({ children }: ChildrenProp) => {
  const bluetoothManager = useMemo(() => new BluetoothManager(), []);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const subscription = bluetoothManager.isConnected().subscribe({
      next: (isConnected) => {
        console.log("bluetooth connected: ", isConnected);
        setIsConnected(isConnected);
      },
      error: (e) => console.error("bluetooth isConnected", e),
      complete: () => console.info("bluetooth isConnected complete")
    });

    return () => subscription.unsubscribe();
  }, [bluetoothManager]);

  return (
    <BluetoothContext.Provider value={{ bluetoothManager, isConnected }}>
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetoothContext = () => useContext(BluetoothContext);
