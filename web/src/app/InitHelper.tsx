'use client'

import { setupPostMessaging } from "@/app/jsBridge";
import eruda from 'eruda';
import React from "react";

export default function InitHelper() {
    React.useEffect(() => {
        eruda.init()
        setupPostMessaging()
    }, [])
    return (
        <div/>
    )
}
