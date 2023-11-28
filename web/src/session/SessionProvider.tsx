"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { SessionManager } from "@/session/SessionManager";
import { useBluetoothContext } from "@/bluetooth/BluetoothProvider";
import { ChildrenProp } from "@/components/util";

const SessionContext = createContext<{
  sessionManager: SessionManager
}>({
  sessionManager: new SessionManager()
});

export const SessionProvider = ({ children }: ChildrenProp) => {
  const { bluetoothManager, isConnected } = useBluetoothContext()
  const sessionManager = useMemo(() => new SessionManager(), []);

  useEffect(() => {
    if (isConnected) {
      sessionManager.subscribeProvider(bluetoothManager)
    } else {
      sessionManager.unsubscribeProvider()
    }
    return () => sessionManager.unsubscribeProvider();
  }, [bluetoothManager, isConnected, sessionManager]);

  return (
    <SessionContext.Provider value={{ sessionManager }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => useContext(SessionContext);
