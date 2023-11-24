import {BluetoothPlatformWeb} from "@/bluetooth/BluetoothPlatform.web";
import {filter, Observable, Subject} from "rxjs";

class BluetoothManager {
    private platform = this.getPlatformImplementation()
    private scaleSubject = new Subject<ScaleData>()

    public async connect(): Promise<void> {
        await this.platform.connect()
        this.platform.addCharacteristicIntEventListener("scale0", this.getEventCallback(0))
        this.platform.addCharacteristicIntEventListener("scale1", this.getEventCallback(1))
        this.platform.addCharacteristicIntEventListener("scale2", this.getEventCallback(2))
        this.platform.addCharacteristicIntEventListener("scale3", this.getEventCallback(3))
    }

    public getScaleObservable(index?: number): Observable<ScaleData> {
        if (index) {
            return this.scaleSubject.asObservable().pipe(filter(event => event.index === index))
        } else {
            return this.scaleSubject.asObservable()
        }
    }

    private getEventCallback(index: number) {
        return ((event: CharacteristicEventIntData) => {
            this.scaleSubject.next({
                ...event,
                index: index,
            })
        })
    }

    private getPlatformImplementation(): BluetoothPlatform {
        return new BluetoothPlatformWeb()
    }
}

type ScaleData = {
    index: number,
    value: number,
    date: Date,
}
