'use client'

import {setupPostMessaging} from "@/app/jsBridge";
import {useEffect, useState} from "react";

export function usePostMessaging(onMessage: (message: any) => void) {
    const [postMessageState, setPostMessageState]
        = useState<(message: any) => void>()

    useEffect(() => {
        const {postMessage} = setupPostMessaging(onMessage)
        console.log("postMessage effect", postMessage)
        setPostMessageState(() => postMessage);
    }, [onMessage])

    console.log("postMessageState", postMessageState)

    return {
        postMessage: postMessageState ?? ((message) => {
            console.log("NoOp postMessage", message)
        })
    };
}