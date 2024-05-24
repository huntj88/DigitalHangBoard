"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Loading() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/local")
  }, [router]);
  return <div>loading</div>;
}
