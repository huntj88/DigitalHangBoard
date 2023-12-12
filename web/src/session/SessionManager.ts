import { BluetoothManager, ScaleData } from "@/bluetooth/BluetoothManager";
import { sumScales } from "@/data/sumScales";
import { Observable, Subject, Subscription } from "rxjs";
import { v4 as uuid } from "uuid";

export type Session = {
  id: string,
  scaleData: ScaleData[],
  active: boolean
}

// if over 5 pounds for 1 second start new session and backfill data

// TODO: timeout before actually ending session
export class SessionManager {
  private sessionSubject = new Subject<Session>();
  public sessions: Map<string, Session> = new Map<string, Session>();
  public activeId: string | undefined = undefined;
  private lastTimeBelowMinLimit: Date = new Date();

  /**
   * get active or most recent session. Emits on session start and end
   */
  public getRecentSession(): Observable<Session> {
    return this.sessionSubject.asObservable();
  }

  public subscribeProvider(bluetoothManager: BluetoothManager): Subscription[] {
    const scaleDataSubscription = bluetoothManager
      .getScaleObservable()
      .subscribe({
        next: (data) => {
          const recentSession = this.activeId ? this.sessions.get(this.activeId) : undefined;
          if (recentSession && recentSession.active) {
            recentSession.scaleData.push(data);
          }
        },
        error: (e) => console.error(e),
        complete: () => console.info("SessionManager complete")
      });

    const createNewSession = () => {
      const session = {
        id: uuid(),
        scaleData: [],
        active: true
      };
      this.sessions.set(session.id, session);
      this.activeId = session.id;
      this.sessionSubject.next(session);
    };

    const sessionStartSubscription = bluetoothManager
      .getScaleObservable()
      .pipe(sumScales)
      .subscribe({
        next: (data) => {
          const recentSession = this.activeId ? this.sessions.get(this.activeId) : undefined;
          if (recentSession) {
            if (data.value <= 5 && recentSession.active) {
              recentSession.active = false;
              // todo: set activeId to undefined?
              this.sessionSubject.next(recentSession);
            } else if (data.value > 5 && !recentSession.active) {
              createNewSession();
            }
          } else if (data.value > 5) {
            createNewSession();
          }
          if (data.value < 5) {
            this.lastTimeBelowMinLimit = new Date();
          }
        },
        error: (e) => console.error(e),
        complete: () => console.info("SessionManager complete")
      });

    return [scaleDataSubscription, sessionStartSubscription];
  }
}

// TODO: only allow one bluetooth connection,
// client could acquire lock on bluetooth device that is not released during an active session
// would make it easy to associate data with specific device that has lock

// TODO: alternate session start/end configs
// example: 5 minute session that doesn't reset when no weight