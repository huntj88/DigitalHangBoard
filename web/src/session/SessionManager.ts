import { BluetoothManager, ScaleData } from "@/bluetooth/BluetoothManager";
import { sumScales } from "@/data/sumScales";
import { Subscription } from "rxjs";
import { v4 as uuid } from 'uuid';

export type Session = {
  id: string,
  scaleData: ScaleData[],
  active: boolean
}

export class SessionManager {
  sessions: Session[] = []

  public subscribeProvider(bluetoothManager: BluetoothManager): Subscription[] {
    const scaleDataSubscription = bluetoothManager
      .getScaleObservable()
      .subscribe({
        next: (data) => {
          const recentSession = this.sessions[this.sessions.length - 1]
          if (recentSession && recentSession.active) {
            recentSession.scaleData.push(data)
          }
        },
        error: (e) => console.error(e),
        complete: () => console.info("SessionManager complete")
      });

    const createNewSession = () => {
      this.sessions.push({
        id: uuid(),
        scaleData: [],
        active: true
      })
    }

    const sessionStartSubscription = bluetoothManager
      .getScaleObservable()
      .pipe(sumScales)
      .subscribe({
        next: (data) => {
          const recentSession = this.sessions[this.sessions.length - 1]
          if (recentSession) {
            if (data.value <= 0 && recentSession.active) {
              recentSession.active = false
            } else if (data.value > 0 && !recentSession.active) {
              createNewSession()
            }
          } else if (data.value > 0) {
            createNewSession()
          }
        },
        error: (e) => console.error(e),
        complete: () => console.info("SessionManager complete")
      });

    return [scaleDataSubscription, sessionStartSubscription]
  }
}

// TODO: only allow one bluetooth connection,
// client could acquire lock on bluetooth device that is not released during an active session
// would make it easy to associate data with specific device that has lock

// TODO: alternate session start/end configs
// example: 5 minute session that doesn't reset when no weight