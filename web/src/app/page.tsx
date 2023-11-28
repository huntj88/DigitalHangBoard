"use client";

import { useRouter } from "next/navigation";

export default function Loading() {
  const router = useRouter();
  router.replace("/nav/local")
  return <div>Loading</div>;
}
