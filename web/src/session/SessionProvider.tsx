"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { SessionManager } from "@/session/SessionManager";
import { useBluetoothContext } from "@/bluetooth/BluetoothProvider";
import { ChildrenProp } from "@/components/util";
import { Subscription } from "rxjs";

const SessionContext = createContext<{
  sessionManager: SessionManager
}>({
  sessionManager: new SessionManager()
});

export const SessionProvider = ({ children }: ChildrenProp) => {
  const { bluetoothManager, isConnected } = useBluetoothContext()
  const sessionManager = useMemo(() => new SessionManager(), []);

  useEffect(() => {
    let subscriptions: Subscription[]
    if (isConnected) {
      subscriptions = sessionManager.subscribeProvider(bluetoothManager)
    }
    return () => subscriptions?.forEach((sub) => sub.unsubscribe())
  }, [bluetoothManager, isConnected, sessionManager]);

  return (
    <SessionContext.Provider value={{ sessionManager }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSessionContext = () => useContext(SessionContext);
