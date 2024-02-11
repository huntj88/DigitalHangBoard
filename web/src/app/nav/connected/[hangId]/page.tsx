import { getHang } from "@/app/server/hang";
import * as React from "react";
import PageInner from "@/app/nav/connected/[hangId]/pageInner";

export default async function Page({ params }: { params: { hangId: number } }) {
  const hang = await getHang(params.hangId);
  return <PageInner hang={hang}/>
}