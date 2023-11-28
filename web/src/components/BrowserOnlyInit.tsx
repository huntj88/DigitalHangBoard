"use client";

import eruda from "eruda";
import { useCallback, useEffect } from "react";
import { usePostMessaging } from "@/bluetooth/postmessage/usePostMessaging";

export default function BrowserOnlyInit() {
  useEffect(() => {
    eruda.init();
  }, []);

  // TODO: post messaging should be setup in bluetooth manager/provider?
  const onMessage = useCallback((message: any) => {
    console.log("onMessage", message);
  }, []);

  const { postMessage } = usePostMessaging(onMessage);
  console.log("postMessage", postMessage);

  return (
    <></>
  );
}
