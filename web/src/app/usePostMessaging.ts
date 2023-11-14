'use client'

import {setupPostMessaging} from "@/app/jsBridge";
import {useEffect, useState} from "react";

export function usePostMessaging(onMessage: (message: any) => void) {
    const [postMessageState, setPostMessageState]
        = useState<(message: any) => void>()

    useEffect(() => {
        const {postMessage} = setupPostMessaging(onMessage)
        const postMessageTyped = postMessage as (message: any) => void
        console.log("postMessage effect", postMessageTyped)
        setPostMessageState(() => postMessageTyped);
    }, [onMessage])

    console.log("postMessageState", postMessageState)

    return { postMessage: postMessageState ?? ((message) => { console.log("NoOp postMessage", message)}) };
}