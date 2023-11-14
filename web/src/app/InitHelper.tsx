'use client'

import eruda from 'eruda';
import {useCallback, useEffect} from "react";
import {usePostMessaging} from "@/app/usePostMessaging";

export default function InitHelper() {
    useEffect(() => {
        eruda.init()
    }, [])

    const onMessage = useCallback((message: any) => {
        console.log("onMessage", message)
    }, [])

    const { postMessage } = usePostMessaging(onMessage)

    return (
        <button onClick={() => postMessage("blah")}>  Activate Lasers
        </button>
    )
}
