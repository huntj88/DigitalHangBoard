// "use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Login from "@/components/Login";
import { getHangs } from "@/app/server/hang";

export default async function ConnectedPage() {
  const hangs = await getHangs();
  console.log(hangs);
  return <div>
    <Login />
    {hangs.map(hang => {
      return <div key={hang.hangId}>
        <p>{hang.hangId}</p>
        <p>{hang.userId}</p>
        <p>{hang.boardId}</p>
        <p>{hang.calibration}</p>
        {hang.timeSeries.map(moment => {
          return <p key={moment.timestamp}>
            {JSON.stringify(moment)}
          </p>;
        })}
      </div>;
    })}
  </div>;
}