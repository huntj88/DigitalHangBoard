import Login from "@/components/Login";
import { getHangs, loadTimeSeries } from "@/app/server/hang";
import { HangList } from "@/components/HangCard";

export default async function ConnectedPage() {
  const hangs = await getHangs();
  // for (const hang of hangs) {
  // await loadTimeSeries(hang);
  // }
  await loadTimeSeries(hangs[3]);
  await loadTimeSeries(hangs[5]);
  // console.log(hangs);
  return <div>
    <Login />
    {/*{hangs.map(hang => {*/}
    {/*  return <div key={hang.hangId}>*/}
    {/*    <p>{hang.hangId}</p>*/}
    {/*    <p>{hang.userId}</p>*/}
    {/*    <p>{hang.boardId}</p>*/}
    {/*    <p>{hang.calibration}</p>*/}
    {/*    {(hang.timeSeries ?? []).map(moment => {*/}
    {/*      return <p key={moment.timestamp}>*/}
    {/*        {JSON.stringify(moment)}*/}
    {/*      </p>;*/}
    {/*    })}*/}
    {/*  </div>;*/}
    {/*})}*/}

    <HangList hangs={hangs}/>
  </div>;
}