'use client'

import eruda from 'eruda';
import {useCallback, useEffect} from "react";
import {usePostMessaging} from "@/app/usePostMessaging";
import {BluetoothPlatformWeb} from "@/bluetooth/BluetoothPlatform.web";

export default function BrowserOnlyInit() {
    // const bluetooth = new BluetoothPlatformWeb();
    useEffect(() => {
        eruda.init()
    }, [])

    const onMessage = useCallback((message: any) => {
        console.log("onMessage", message)
    }, [])

    const {postMessage} = usePostMessaging(onMessage)
    console.log("postMessage", postMessage)

    return (
        <>
            {/*<button onClick={() => {*/}
            {/*    // postMessage("blah")*/}
            {/*    bluetooth.connect()*/}
            {/*}}> Connect*/}
            {/*</button>*/}
            {/*<button onClick={() => {*/}
            {/*    bluetooth.addCharacteristicIntEventListener("scale0", (event) => {*/}
            {/*        console.log(event);*/}
            {/*    })*/}
            {/*}}> listen*/}
            {/*</button>*/}
        </>
    )
}
