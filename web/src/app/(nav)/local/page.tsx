import React from "react";
import PageInner from "@/app/(nav)/local/pageInner";
import { saveHang } from "@/app/server/hang";

export default function Page() {
  return (
    <div>
      <PageInner saveHang={saveHang}></PageInner>
    </div>
  );
}

// default behavior if person started hanging without picking type would be record from first weight to end weight
// could also choose timed, etc
