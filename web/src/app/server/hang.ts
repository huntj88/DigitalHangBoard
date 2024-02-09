import "server-only";
import { sql } from "@vercel/postgres";
import { Session } from "@/session/SessionManager";

type HangQuery = {
  // todo: actual types instead of strings
  hangId: string
  hangMomentId: string
  boardId: string
  userId: string
  calibration: string
  timestamp: string
  index: string
  value: string
}

export type Hang = {
  // todo: actual types instead of strings
  hangId: string
  boardId: string
  userId: string
  calibration: string
  timeSeries: Moment[]
}

export type Moment = {
  // todo: actual types instead of strings
  timestamp: string
  index: string
  value: string
}

export async function getHangs(): Promise<Hang[]> {
  const { rows } = await sql`
      SELECT hang.hang_id,
             hang_moment_id,
             board_id,
             user_id,
             calibration,
             timestamp,
             index,
             value
      FROM hang
               JOIN public.hang_moment hm USING (hang_id);`;

  const hangMoments = rows.map(row => {
    return {
      hangId: row["hang_id"],
      hangMomentId: row["hang_moment_id"],
      boardId: row["board_id"],
      userId: row["user_id"],
      calibration: row["calibration"],
      timestamp: row["timestamp"],
      index: row["index"],
      value: row["value"]
    } as HangQuery;
  });

  const groupByHangId = new Map<string, HangQuery[]>();
  hangMoments.forEach((queryData) => {
    const existing = groupByHangId.get(queryData.hangId);
    if (existing) {
      existing.push(queryData);
    } else {
      groupByHangId.set(queryData.hangId, [queryData]);
    }
  });

  const hangs: Hang[] = [];
  groupByHangId.forEach(hangQuery => {
    const hang: Hang = {
      hangId: hangQuery[0].hangId,
      boardId: hangQuery[0].boardId,
      userId: hangQuery[0].userId,
      calibration: hangQuery[0].calibration,
      timeSeries: hangQuery.map(momentQuery => {
        const moment: Moment = {
          timestamp: momentQuery.timestamp,
          index: momentQuery.index,
          value: momentQuery.value,
        };
        return moment;
      })
    };
    hangs.push(hang);
  });

  return hangs;
}

export async function saveHang(session: Session) {
  "use server";

  const client = await sql.connect();
  const { rows } = await client.sql`
      INSERT INTO hang (user_id, board_id, calibration)
      VALUES ('df285c54-2dea-4b92-8974-ea522a443766', 1, '-1,-1,-1,-1')
      RETURNING hang_id;
  `;
  const hangId: string = rows[0]["hang_id"];
  console.log("hangId", hangId);

  // const values = session.scaleData
  //   .map(data => `('${hangId}', ${data.date.toISOString()},320, 200, 140, 204)`)
  //   .join(",");
  //
  // console.log("values", values);
  // await client.sql`INSERT INTO hang_moment (hang_id, timestamp, scale0, scale1, scale2, scale3) VALUES ${values};`;
  // client.release();

  console.log("moments size", session.scaleData.length);
  const increment = 10;

  // TODO: bulk insert, below is SUPER JANK, working with sql client
  for (let i = 0; i < session.scaleData.length - increment; i += increment) {
    const data0 = session.scaleData[i]
    const data1 = session.scaleData[i + 1]
    const data2 = session.scaleData[i + 2]
    const data3 = session.scaleData[i + 3]
    const data4 = session.scaleData[i + 4]
    const data5 = session.scaleData[i + 5]
    const data6 = session.scaleData[i + 6]
    const data7 = session.scaleData[i + 7]
    const data8 = session.scaleData[i + 8]
    const data9 = session.scaleData[i + 9]
    await client.sql`
        INSERT INTO hang_moment (hang_id, timestamp, index, value)
        VALUES 
            (${hangId}, ${data0.date.toISOString()}, ${data0.index}, ${data0.value}),
            (${hangId}, ${data1.date.toISOString()}, ${data1.index}, ${data1.value}),
            (${hangId}, ${data2.date.toISOString()}, ${data2.index}, ${data2.value}),
            (${hangId}, ${data3.date.toISOString()}, ${data3.index}, ${data3.value}),
            (${hangId}, ${data4.date.toISOString()}, ${data4.index}, ${data4.value}),
            (${hangId}, ${data5.date.toISOString()}, ${data5.index}, ${data5.value}),
            (${hangId}, ${data6.date.toISOString()}, ${data6.index}, ${data6.value}),
            (${hangId}, ${data7.date.toISOString()}, ${data7.index}, ${data7.value}),
            (${hangId}, ${data8.date.toISOString()}, ${data8.index}, ${data8.value}),
            (${hangId}, ${data9.date.toISOString()}, ${data9.index}, ${data9.value});
    `;
  }

  // remainders not an increment of 10
  for (const data of session.scaleData.slice(session.scaleData.length - increment)) {
    await client.sql`
        INSERT INTO hang_moment (hang_id, timestamp, index, value)
        VALUES (${hangId}, ${data.date.toISOString()}, ${data.index}, ${data.value});
    `;
  }

  client.release();
}