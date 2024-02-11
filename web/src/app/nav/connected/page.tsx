import Login from "@/components/Login";
import { getHangs } from "@/app/server/hang";
import { HangList } from "@/components/HangCard";

// Opt out of caching for all data requests in page
export const dynamic = "force-dynamic";

export default async function ConnectedPage() {
  const hangs = await getHangs("df285c54-2dea-4b92-8974-ea522a443766");
  return <div>
    <Login />
    <HangList hangs={hangs} />
  </div>;
}