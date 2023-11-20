import "./globals.css";
import {Providers} from "./providers";
import React, {ReactElement, ReactNode} from "react";
import type {Metadata} from 'next'
import BrowserOnlyInit from "@/components/BrowserOnlyInit";
import {NoSSR} from "@/components/NoSSRWrapper";

export const metadata: Metadata = {
    title: "Next.js, Fluent UI and Me",
    description: "List of actors created with Next.js and Fluent UI",
}

export default function RootLayout({children}: { children: ReactNode }): ReactElement {
    return (
        <html lang="en">
        <body>
        <NoSSR>
            <BrowserOnlyInit/>
        </NoSSR>
        <Providers>{children}</Providers>
        </body>
        </html>
    )
}