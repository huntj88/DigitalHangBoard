import Login from "@/components/Login";
import { getHangs, loadTimeSeries } from "@/app/server/hang";
import { HangList } from "@/components/HangCard";

// Opt out of caching for all data requests in page
export const dynamic = 'force-dynamic';

export default async function ConnectedPage() {
  const hangs = await getHangs();
  for (const hang of hangs) {
  await loadTimeSeries(hang);
  }
  // await loadTimeSeries(hangs[3]);
  // await loadTimeSeries(hangs[5]);
  // console.log(hangs);
  return <div>
    <Login />
    <HangList hangs={hangs}/>
  </div>;
}