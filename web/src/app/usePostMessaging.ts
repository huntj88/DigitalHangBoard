'use client'

import {setupPostMessaging} from "@/app/jsBridge";
import eruda from 'eruda';
import {useEffect, useState} from "react";

export function usePostMessaging(onMessage: (message: any) => void) {
    const [postMessageState, setPostMessageState]
        = useState<(message: any) => void>(
        (message: any) => {
            console.log("postMessage not ready yet", message)
        }
    )

    useEffect(() => {
        eruda.init()
        const {postMessage} = setupPostMessaging(onMessage)
        setPostMessageState(postMessage);
    }, [onMessage])

    return {postMessage: postMessageState};
}