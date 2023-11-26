"use client"

import {useRouter} from "next/navigation";

export default function Nav() {
    const router = useRouter()
    router.push("/nav/local")
    return (<div></div>)
}