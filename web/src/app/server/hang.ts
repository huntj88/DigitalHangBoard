import "server-only";
import { sql, VercelPoolClient } from "@vercel/postgres";
import { Session } from "@/session/SessionManager";
import { from } from "rxjs";
import { sumScales } from "@/data/sumScales";
import { ScaleSumData } from "@/bluetooth/BluetoothManager";

// would be fun to assign a score to each hang.
// integral of hang curve, split into horizontal layers, each layer applying a y-axis height multiplier to the integral result for that layer.
// sum up each layer to get score

// so a bunch of integrals of the hang curve with upper and lower bounds that make up the horizontal layers

type HangMomentQuery = {
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
  hangId: number
  boardId: number
  userId: string
  createdAt: Date
  calibration: string
  timeSeries?: Moment[]
}

export type Moment = {
  timestamp: Date;
  total: number;
  scale0: number;
  scale1: number;
  scale2: number;
  scale3: number;
}

export async function getHangs(): Promise<Hang[]> {
  const { rows } = await sql`
      SELECT hang_id,
             board_id,
             user_id,
             calibration,
             created_at
      FROM hang
      ORDER BY created_at DESC;`;

  return rows.map(row => {
    const hang: Hang = {
      hangId: row["hang_id"],
      boardId: row["board_id"],
      userId: row["user_id"],
      createdAt: row["created_at"],
      calibration: row["calibration"]
    };
    return hang;
  });
}

export async function loadTimeSeries(hang: Hang): Promise<Hang> {
  const { rows } = await sql`
      SELECT timestamp,
             total,
             scale0,
             scale1,
             scale2,
             scale3
      FROM hang_moment
      WHERE hang_id = ${hang.hangId};
  `;

  hang.timeSeries = rows.map(row => {
    const moment: Moment = {
      timestamp: row["timestamp"],
      total: row["total"],
      scale0: row["scale0"],
      scale1: row["scale1"],
      scale2: row["scale2"],
      scale3: row["scale3"]
    };
    return moment;
  });

  return hang;
}

// export async function getHangsBlah(): Promise<Hang[]> {
//   const { rows } = await sql`
//       SELECT hang.hang_id,
//              hang_moment_id,
//              board_id,
//              user_id,
//              calibration,
//              timestamp,
//              index,
//              value
//       FROM hang
//                JOIN public.hang_moment hm USING (hang_id);`;
//
//   const hangMoments = rows.map(row => {
//     return {
//       hangId: row["hang_id"],
//       hangMomentId: row["hang_moment_id"],
//       boardId: row["board_id"],
//       userId: row["user_id"],
//       calibration: row["calibration"],
//       timestamp: row["timestamp"],
//       index: row["index"],
//       value: row["value"]
//     } as HangMomentQuery;
//   });
//
//   const groupByHangId = new Map<string, HangMomentQuery[]>();
//   hangMoments.forEach((queryData) => {
//     const existing = groupByHangId.get(queryData.hangId);
//     if (existing) {
//       existing.push(queryData);
//     } else {
//       groupByHangId.set(queryData.hangId, [queryData]);
//     }
//   });
//
//   const hangs: Hang[] = [];
//   groupByHangId.forEach(hangQuery => {
//     const hang: Hang = {
//       hangId: hangQuery[0].hangId,
//       boardId: hangQuery[0].boardId,
//       userId: hangQuery[0].userId,
//       calibration: hangQuery[0].calibration,
//       timeSeries: hangQuery.map(momentQuery => {
//         const moment: Moment = {
//           timestamp: momentQuery.timestamp,
//           index: momentQuery.index,
//           value: momentQuery.value,
//         };
//         return moment;
//       })
//     };
//     hangs.push(hang);
//   });
//
//   return hangs;
// }

export async function saveHang(session: Session) {
  "use server";

  const moments: ScaleSumData[] = [];
  await from(session.scaleData).pipe(sumScales).forEach(x => {
    moments.push(x);
  });

  const client = await sql.connect();
  const { rows } = await client.sql`
      INSERT INTO hang (user_id, board_id, calibration)
      VALUES ('df285c54-2dea-4b92-8974-ea522a443766', 1, '-1,-1,-1,-1')
      RETURNING hang_id;
  `;
  const hangId: string = rows[0]["hang_id"];
  console.log("hangId", hangId);
  console.log("moments size", moments.length);

  await bulkInsert50(hangId, client, moments);

  const remainder50 = moments.length % 50;
  await bulkInsert10(hangId, client, moments.slice(moments.length - remainder50));

  const remainder10 = moments.length % 10;
  await singleInsert(hangId, client, moments.slice(moments.length - remainder10));
  client.release();
}


async function bulkInsert50(hangId: string, client: VercelPoolClient, scaleData: ScaleSumData[]) {
  const increment = 50;

  // TODO: bulk insert, below is SUPER JANK, working with sql client
  for (let i = 0; i < scaleData.length - increment; i += increment) {
    const data0 = scaleData[i];
    const data1 = scaleData[i + 1];
    const data2 = scaleData[i + 2];
    const data3 = scaleData[i + 3];
    const data4 = scaleData[i + 4];
    const data5 = scaleData[i + 5];
    const data6 = scaleData[i + 6];
    const data7 = scaleData[i + 7];
    const data8 = scaleData[i + 8];
    const data9 = scaleData[i + 9];

    const data10 = scaleData[i + 10];
    const data11 = scaleData[i + 11];
    const data12 = scaleData[i + 12];
    const data13 = scaleData[i + 13];
    const data14 = scaleData[i + 14];
    const data15 = scaleData[i + 15];
    const data16 = scaleData[i + 16];
    const data17 = scaleData[i + 17];
    const data18 = scaleData[i + 18];
    const data19 = scaleData[i + 19];

    const data20 = scaleData[i + 20];
    const data21 = scaleData[i + 21];
    const data22 = scaleData[i + 22];
    const data23 = scaleData[i + 23];
    const data24 = scaleData[i + 24];
    const data25 = scaleData[i + 25];
    const data26 = scaleData[i + 26];
    const data27 = scaleData[i + 27];
    const data28 = scaleData[i + 28];
    const data29 = scaleData[i + 29];

    const data30 = scaleData[i + 30];
    const data31 = scaleData[i + 31];
    const data32 = scaleData[i + 32];
    const data33 = scaleData[i + 33];
    const data34 = scaleData[i + 34];
    const data35 = scaleData[i + 35];
    const data36 = scaleData[i + 36];
    const data37 = scaleData[i + 37];
    const data38 = scaleData[i + 38];
    const data39 = scaleData[i + 39];

    const data40 = scaleData[i + 40];
    const data41 = scaleData[i + 41];
    const data42 = scaleData[i + 42];
    const data43 = scaleData[i + 43];
    const data44 = scaleData[i + 44];
    const data45 = scaleData[i + 45];
    const data46 = scaleData[i + 46];
    const data47 = scaleData[i + 47];
    const data48 = scaleData[i + 48];
    const data49 = scaleData[i + 49];

    console.log("bulk insert 50");
    await client.sql`
        INSERT INTO hang_moment (hang_id, timestamp, total, scale0, scale1, scale2, scale3)
        VALUES (${hangId}, ${data0.date.toISOString()}, ${data0.value}, ${data0.scale0}, ${data0.scale1},
                ${data0.scale2}, ${data0.scale3}),
               (${hangId}, ${data1.date.toISOString()}, ${data1.value}, ${data1.scale0}, ${data1.scale1},
                ${data1.scale2}, ${data1.scale3}),
               (${hangId}, ${data2.date.toISOString()}, ${data2.value}, ${data2.scale0}, ${data2.scale1},
                ${data2.scale2}, ${data2.scale3}),
               (${hangId}, ${data3.date.toISOString()}, ${data3.value}, ${data3.scale0}, ${data3.scale1},
                ${data3.scale2}, ${data3.scale3}),
               (${hangId}, ${data4.date.toISOString()}, ${data4.value}, ${data4.scale0}, ${data4.scale1},
                ${data4.scale2}, ${data4.scale3}),
               (${hangId}, ${data5.date.toISOString()}, ${data5.value}, ${data5.scale0}, ${data5.scale1},
                ${data5.scale2}, ${data5.scale3}),
               (${hangId}, ${data6.date.toISOString()}, ${data6.value}, ${data6.scale0}, ${data6.scale1},
                ${data6.scale2}, ${data6.scale3}),
               (${hangId}, ${data7.date.toISOString()}, ${data7.value}, ${data7.scale0}, ${data7.scale1},
                ${data7.scale2}, ${data7.scale3}),
               (${hangId}, ${data8.date.toISOString()}, ${data8.value}, ${data8.scale0}, ${data8.scale1},
                ${data8.scale2}, ${data8.scale3}),
               (${hangId}, ${data9.date.toISOString()}, ${data9.value}, ${data9.scale0}, ${data9.scale1},
                ${data9.scale2}, ${data9.scale3}),
               (${hangId}, ${data10.date.toISOString()}, ${data10.value}, ${data10.scale0}, ${data10.scale1},
                ${data10.scale2}, ${data10.scale3}),
               (${hangId}, ${data11.date.toISOString()}, ${data11.value}, ${data11.scale0}, ${data11.scale1},
                ${data11.scale2}, ${data11.scale3}),
               (${hangId}, ${data12.date.toISOString()}, ${data12.value}, ${data12.scale0}, ${data12.scale1},
                ${data12.scale2}, ${data12.scale3}),
               (${hangId}, ${data13.date.toISOString()}, ${data13.value}, ${data13.scale0}, ${data13.scale1},
                ${data13.scale2}, ${data13.scale3}),
               (${hangId}, ${data14.date.toISOString()}, ${data14.value}, ${data14.scale0}, ${data14.scale1},
                ${data14.scale2}, ${data14.scale3}),
               (${hangId}, ${data15.date.toISOString()}, ${data15.value}, ${data15.scale0}, ${data15.scale1},
                ${data15.scale2}, ${data15.scale3}),
               (${hangId}, ${data16.date.toISOString()}, ${data16.value}, ${data16.scale0}, ${data16.scale1},
                ${data16.scale2}, ${data16.scale3}),
               (${hangId}, ${data17.date.toISOString()}, ${data17.value}, ${data17.scale0}, ${data17.scale1},
                ${data17.scale2}, ${data17.scale3}),
               (${hangId}, ${data18.date.toISOString()}, ${data18.value}, ${data18.scale0}, ${data18.scale1},
                ${data18.scale2}, ${data18.scale3}),
               (${hangId}, ${data19.date.toISOString()}, ${data19.value}, ${data19.scale0}, ${data19.scale1},
                ${data19.scale2}, ${data19.scale3}),

               (${hangId}, ${data20.date.toISOString()}, ${data20.value}, ${data20.scale0}, ${data20.scale1},
                ${data20.scale2}, ${data20.scale3}),
               (${hangId}, ${data21.date.toISOString()}, ${data21.value}, ${data21.scale0}, ${data21.scale1},
                ${data21.scale2}, ${data21.scale3}),
               (${hangId}, ${data22.date.toISOString()}, ${data22.value}, ${data22.scale0}, ${data22.scale1},
                ${data22.scale2}, ${data22.scale3}),
               (${hangId}, ${data23.date.toISOString()}, ${data23.value}, ${data23.scale0}, ${data23.scale1},
                ${data23.scale2}, ${data23.scale3}),
               (${hangId}, ${data24.date.toISOString()}, ${data24.value}, ${data24.scale0}, ${data24.scale1},
                ${data24.scale2}, ${data24.scale3}),
               (${hangId}, ${data25.date.toISOString()}, ${data25.value}, ${data25.scale0}, ${data25.scale1},
                ${data25.scale2}, ${data25.scale3}),
               (${hangId}, ${data26.date.toISOString()}, ${data26.value}, ${data26.scale0}, ${data26.scale1},
                ${data26.scale2}, ${data26.scale3}),
               (${hangId}, ${data27.date.toISOString()}, ${data27.value}, ${data27.scale0}, ${data27.scale1},
                ${data27.scale2}, ${data27.scale3}),
               (${hangId}, ${data28.date.toISOString()}, ${data28.value}, ${data28.scale0}, ${data28.scale1},
                ${data28.scale2}, ${data28.scale3}),
               (${hangId}, ${data29.date.toISOString()}, ${data29.value}, ${data29.scale0}, ${data29.scale1},
                ${data29.scale2}, ${data29.scale3}),

               (${hangId}, ${data30.date.toISOString()}, ${data30.value}, ${data30.scale0}, ${data30.scale1},
                ${data30.scale2}, ${data30.scale3}),
               (${hangId}, ${data31.date.toISOString()}, ${data31.value}, ${data31.scale0}, ${data31.scale1},
                ${data31.scale2}, ${data31.scale3}),
               (${hangId}, ${data32.date.toISOString()}, ${data32.value}, ${data32.scale0}, ${data32.scale1},
                ${data32.scale2}, ${data32.scale3}),
               (${hangId}, ${data33.date.toISOString()}, ${data33.value}, ${data33.scale0}, ${data33.scale1},
                ${data33.scale2}, ${data33.scale3}),
               (${hangId}, ${data34.date.toISOString()}, ${data34.value}, ${data34.scale0}, ${data34.scale1},
                ${data34.scale2}, ${data34.scale3}),
               (${hangId}, ${data35.date.toISOString()}, ${data35.value}, ${data35.scale0}, ${data35.scale1},
                ${data35.scale2}, ${data35.scale3}),
               (${hangId}, ${data36.date.toISOString()}, ${data36.value}, ${data36.scale0}, ${data36.scale1},
                ${data36.scale2}, ${data36.scale3}),
               (${hangId}, ${data37.date.toISOString()}, ${data37.value}, ${data37.scale0}, ${data37.scale1},
                ${data37.scale2}, ${data37.scale3}),
               (${hangId}, ${data38.date.toISOString()}, ${data38.value}, ${data38.scale0}, ${data38.scale1},
                ${data38.scale2}, ${data38.scale3}),
               (${hangId}, ${data39.date.toISOString()}, ${data39.value}, ${data39.scale0}, ${data39.scale1},
                ${data39.scale2}, ${data39.scale3}),
               (${hangId}, ${data40.date.toISOString()}, ${data40.value}, ${data40.scale0}, ${data40.scale1},
                ${data40.scale2}, ${data40.scale3}),
               (${hangId}, ${data41.date.toISOString()}, ${data41.value}, ${data41.scale0}, ${data41.scale1},
                ${data41.scale2}, ${data41.scale3}),
               (${hangId}, ${data42.date.toISOString()}, ${data42.value}, ${data42.scale0}, ${data42.scale1},
                ${data42.scale2}, ${data42.scale3}),
               (${hangId}, ${data43.date.toISOString()}, ${data43.value}, ${data43.scale0}, ${data43.scale1},
                ${data43.scale2}, ${data43.scale3}),
               (${hangId}, ${data44.date.toISOString()}, ${data44.value}, ${data44.scale0}, ${data44.scale1},
                ${data44.scale2}, ${data44.scale3}),
               (${hangId}, ${data45.date.toISOString()}, ${data45.value}, ${data45.scale0}, ${data45.scale1},
                ${data45.scale2}, ${data45.scale3}),
               (${hangId}, ${data46.date.toISOString()}, ${data46.value}, ${data46.scale0}, ${data46.scale1},
                ${data46.scale2}, ${data46.scale3}),
               (${hangId}, ${data47.date.toISOString()}, ${data47.value}, ${data47.scale0}, ${data47.scale1},
                ${data47.scale2}, ${data47.scale3}),
               (${hangId}, ${data48.date.toISOString()}, ${data48.value}, ${data48.scale0}, ${data48.scale1},
                ${data48.scale2}, ${data48.scale3}),
               (${hangId}, ${data49.date.toISOString()}, ${data49.value}, ${data49.scale0}, ${data49.scale1},
                ${data49.scale2}, ${data49.scale3})
    `;
  }
}

async function bulkInsert10(hangId: string, client: VercelPoolClient, scaleData: ScaleSumData[]) {
  const increment = 10;

  // TODO: bulk insert, below is SUPER JANK, working with sql client
  for (let i = 0; i < scaleData.length - increment; i += increment) {
    const data0 = scaleData[i];
    const data1 = scaleData[i + 1];
    const data2 = scaleData[i + 2];
    const data3 = scaleData[i + 3];
    const data4 = scaleData[i + 4];
    const data5 = scaleData[i + 5];
    const data6 = scaleData[i + 6];
    const data7 = scaleData[i + 7];
    const data8 = scaleData[i + 8];
    const data9 = scaleData[i + 9];

    console.log("bulk insert 10");
    await client.sql`
        INSERT INTO hang_moment (hang_id, timestamp, total, scale0, scale1, scale2, scale3)
        VALUES (${hangId}, ${data0.date.toISOString()}, ${data0.value}, ${data0.scale0}, ${data0.scale1},
                ${data0.scale2}, ${data0.scale3}),
               (${hangId}, ${data1.date.toISOString()}, ${data1.value}, ${data1.scale0}, ${data1.scale1},
                ${data1.scale2}, ${data1.scale3}),
               (${hangId}, ${data2.date.toISOString()}, ${data2.value}, ${data2.scale0}, ${data2.scale1},
                ${data2.scale2}, ${data2.scale3}),
               (${hangId}, ${data3.date.toISOString()}, ${data3.value}, ${data3.scale0}, ${data3.scale1},
                ${data3.scale2}, ${data3.scale3}),
               (${hangId}, ${data4.date.toISOString()}, ${data4.value}, ${data4.scale0}, ${data4.scale1},
                ${data4.scale2}, ${data4.scale3}),
               (${hangId}, ${data5.date.toISOString()}, ${data5.value}, ${data5.scale0}, ${data5.scale1},
                ${data5.scale2}, ${data5.scale3}),
               (${hangId}, ${data6.date.toISOString()}, ${data6.value}, ${data6.scale0}, ${data6.scale1},
                ${data6.scale2}, ${data6.scale3}),
               (${hangId}, ${data7.date.toISOString()}, ${data7.value}, ${data7.scale0}, ${data7.scale1},
                ${data7.scale2}, ${data7.scale3}),
               (${hangId}, ${data8.date.toISOString()}, ${data8.value}, ${data8.scale0}, ${data8.scale1},
                ${data8.scale2}, ${data8.scale3}),
               (${hangId}, ${data9.date.toISOString()}, ${data9.value}, ${data9.scale0}, ${data9.scale1},
                ${data9.scale2}, ${data9.scale3})
    `;
  }
}

async function singleInsert(hangId: string, client: VercelPoolClient, scaleData: ScaleSumData[]) {

  for (const data of scaleData) {
    console.log("bulk insert 1");
    await client.sql`
        INSERT INTO hang_moment (hang_id, timestamp, total, scale0, scale1, scale2, scale3)
        VALUES (${hangId}, ${data.date.toISOString()}, ${data.value}, ${data.scale0}, ${data.scale1}, ${data.scale2},
                ${data.scale3});
    `;
  }
}
