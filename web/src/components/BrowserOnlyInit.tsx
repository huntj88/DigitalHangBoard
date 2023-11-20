'use client'

import eruda from 'eruda';
import {useCallback, useEffect} from "react";
import {usePostMessaging} from "@/app/usePostMessaging";

export default function BrowserOnlyInit() {
    useEffect(() => {
        eruda.init()
    }, [])

    const onMessage = useCallback((message: any) => {
        console.log("onMessage", message)
    }, [])

    const {postMessage} = usePostMessaging(onMessage)
    console.log("postMessage", postMessage)

    return (
        <button onClick={() => postMessage("blah")}> Activate Lasers
        </button>
    )
}
