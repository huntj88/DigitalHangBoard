import * as React from "react";
import { Suspense } from "react";
import { UserHangList } from "@/components/UserHangList";

// Opt out of caching for all data requests in page
export const dynamic = "force-dynamic";

export default function ConnectedPage() {
  return <div>
    {/*<Login />*/}
    <Suspense fallback={<p>Loading</p>}>
      <UserHangList userId={"df285c54-2dea-4b92-8974-ea522a443766"}/>
    </Suspense>
  </div>;
}
