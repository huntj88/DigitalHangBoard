import { BluetoothManager, ScaleDataWeight } from "@/bluetooth/BluetoothManager";
import { sumScales } from "@/data/sumScales";
import { Observable, Subject, Subscription } from "rxjs";
import { v4 as uuid } from "uuid";

export type Session = {
  id: string,
  scaleData: ScaleDataWeight[],
  active: boolean
  calibration: number[]
  // TODO: calibration data
}

export class SessionManager {
  private sessionSubject = new Subject<Session>();
  private lastTimeBelowMinLimit: Date = new Date();
  private lastTimeAboveMinLimit: Date = new Date();
  private last200BeforeActive: ScaleDataWeight[] = [];
  private sessionStartEndWeight = 5;

  public sessions: Map<string, Session> = new Map<string, Session>();
  public currentCalibration: number[] = [];
  public recentId: string | undefined = undefined;

  /**
   * get active or most recent session. Emits on session start and end
   */
  public getRecentSession(): Observable<Session> {
    return this.sessionSubject.asObservable();
  }

  public subscribeProvider(bluetoothManager: BluetoothManager): Subscription[] {
    const calibrationSubscription = bluetoothManager.getCalibrationObservable()
      .subscribe({
        next: (calibration) => {
          this.currentCalibration = calibration;
        },
        error: (e) => console.error(e),
        complete: () => console.info("SessionManager calibration observable complete")
      });


    const scaleDataSubscription = bluetoothManager
      .getScaleObservable()
      .subscribe({
        next: (data) => {
          const recentSession = this.recentId ? this.sessions.get(this.recentId) : undefined;
          if (recentSession && recentSession.active) {
            recentSession.scaleData.push(data);
          } else {
            if (this.last200BeforeActive.length > 200) {
              this.last200BeforeActive.shift();
            }
            this.last200BeforeActive.push(data);
          }
        },
        error: (e) => console.error(e),
        complete: () => console.info("SessionManager scaleData observable complete")
      });

    const createNewSession = () => {
      const session = {
        id: uuid(),
        scaleData: [...this.last200BeforeActive],
        active: true,
        calibration: this.currentCalibration
      };
      this.last200BeforeActive = [];
      this.sessions.set(session.id, session);
      this.recentId = session.id;
      this.sessionSubject.next(session);
    };

    const sessionStartSubscription = bluetoothManager
      .getScaleObservable()
      .pipe(sumScales)
      .subscribe({
        next: (data) => {
          if (data.weightPounds < this.sessionStartEndWeight) {
            this.lastTimeBelowMinLimit = new Date();
          } else {
            this.lastTimeAboveMinLimit = new Date();
          }
          const recentSession = this.recentId ? this.sessions.get(this.recentId) : undefined;
          if (recentSession) {
            if (recentSession.active && dateIsOlderThan(this.lastTimeAboveMinLimit, 1000)) {
              recentSession.active = false;
              // todo: set activeId to undefined?
              this.sessionSubject.next(recentSession);
            } else if (!recentSession.active && dateIsOlderThan(this.lastTimeBelowMinLimit, 500)) {
              createNewSession();
            }
          } else if (dateIsOlderThan(this.lastTimeBelowMinLimit, 500)) {
            createNewSession();
          }
        },
        error: (e) => console.error(e),
        complete: () => console.info("SessionManager complete")
      });

    return [scaleDataSubscription, sessionStartSubscription, calibrationSubscription];
  }
}

function dateIsOlderThan(date: Date, milliseconds: number): boolean {
  return date.getTime() + milliseconds < new Date().getTime();
}

// TODO: only allow one bluetooth connection,
// client could acquire lock on bluetooth device that is not released during an active session
// would make it easy to associate data with specific device that has lock

// TODO: alternate session start/end configs
// example: 5 minute session that doesn't reset when no weight