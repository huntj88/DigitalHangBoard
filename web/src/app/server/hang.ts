import "server-only";
import { QueryResultRow, sql, VercelPoolClient } from "@vercel/postgres";
import { Session } from "@/session/SessionManager";
import { from } from "rxjs";
import { sumScales } from "@/data/sumScales";
import { ScaleSumData } from "@/bluetooth/BluetoothManager";

// would be fun to assign a score to each hang.
// integral of hang curve, split into horizontal layers, each layer applying a y-axis height multiplier to the integral result for that layer.
// sum up each layer to get score

// so a bunch of integrals of the hang curve with upper and lower bounds that make up the horizontal layers

export type Hang = {
  // todo: actual types instead of strings
  hangId: number
  boardId: number
  userId: string
  createdAt: Date
  calibration: number[]
  timeSeries: Moment[]
}

export type Moment = {
  timestamp: Date;
  weightPounds: number;
  scale0: number;
  scale1: number;
  scale2: number;
  scale3: number;
}

export async function getHang(hangId: number): Promise<Hang> {
  const client = await sql.connect();
  const hang = await getHangInternal(client, hangId);
  client.release();
  return hang;
}

export async function getHangs(userId: string): Promise<Hang[]> {
  const client = await sql.connect();
  const hangs = await getHangsInternal(client, userId, 500);
  client.release();
  return hangs;
}

async function getHangsInternal(client: VercelPoolClient, userId: string, count: number, startFrom?: Date): Promise<Hang[]> {
  const { rows } = await client.sql`
      SELECT json_build_object(
                     'hangId', h.hang_id,
                     'boardId', h.board_id,
                     'userId', h.user_id,
                     'calibration', h.calibration,
                     'createdAt', h.created_at,
                     'timeSeries', json_agg(row_to_json(hm))
             ) as hang
      FROM hang h
               JOIN public.hang_moment hm on h.hang_id = hm.hang_id
      WHERE user_id = ${userId}
      GROUP BY user_id,
               h.hang_id,
               h.board_id,
               h.calibration,
               h.created_at
      ORDER BY created_at DESC
      LIMIT ${count};
  `;
  return rows.map(row => toHang(row));
}

async function getHangInternal(client: VercelPoolClient, hangId: number): Promise<Hang> {
  const { rows } = await client.sql`
      SELECT json_build_object(
                     'hangId', h.hang_id,
                     'boardId', h.board_id,
                     'userId', h.user_id,
                     'calibration', h.calibration,
                     'createdAt', h.created_at,
                     'timeSeries', json_agg(row_to_json(hm))
             ) as hang
      FROM hang h
               JOIN public.hang_moment hm on h.hang_id = hm.hang_id
      WHERE hm.hang_id = ${hangId}
      GROUP BY user_id,
               h.hang_id,
               h.board_id,
               h.calibration,
               h.created_at
      ORDER BY created_at DESC;
  `;
  return rows.map(row => toHang(row))[0];
}

function toHang(row: QueryResultRow): Hang {
  const rowRaw = row.hang;
  return {
    ...rowRaw,
    calibration: rowRaw.calibration.split(",").map((x: string) => Number(x)),
    createdAt: new Date(Date.parse(rowRaw.createdAt)),
    timeSeries: rowRaw.timeSeries.map((x: any) => ({
      ...x,
      timestamp: new Date(Date.parse(x.timestamp))
    }))
  };
}

export async function saveHang(
  userId: string,
  session: Session
): Promise<void> {
  "use server";

  const moments: ScaleSumData[] = [];
  await from(session.scaleData).pipe(sumScales).forEach(x => {
    moments.push(x);
  });
  const calibration = session.calibration.join(",");

  const client = await sql.connect();
  const { rows } = await client.sql`
      INSERT INTO hang (user_id, board_id, calibration)
      VALUES (${userId}, 1, ${calibration})
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
        INSERT INTO hang_moment (hang_id, timestamp, weight_pounds, scale0, scale1, scale2, scale3)
        VALUES (${hangId}, ${data0.date.toISOString()}, ${data0.weightPounds}, ${data0.scale0}, ${data0.scale1},
                ${data0.scale2}, ${data0.scale3}),
               (${hangId}, ${data1.date.toISOString()}, ${data1.weightPounds}, ${data1.scale0}, ${data1.scale1},
                ${data1.scale2}, ${data1.scale3}),
               (${hangId}, ${data2.date.toISOString()}, ${data2.weightPounds}, ${data2.scale0}, ${data2.scale1},
                ${data2.scale2}, ${data2.scale3}),
               (${hangId}, ${data3.date.toISOString()}, ${data3.weightPounds}, ${data3.scale0}, ${data3.scale1},
                ${data3.scale2}, ${data3.scale3}),
               (${hangId}, ${data4.date.toISOString()}, ${data4.weightPounds}, ${data4.scale0}, ${data4.scale1},
                ${data4.scale2}, ${data4.scale3}),
               (${hangId}, ${data5.date.toISOString()}, ${data5.weightPounds}, ${data5.scale0}, ${data5.scale1},
                ${data5.scale2}, ${data5.scale3}),
               (${hangId}, ${data6.date.toISOString()}, ${data6.weightPounds}, ${data6.scale0}, ${data6.scale1},
                ${data6.scale2}, ${data6.scale3}),
               (${hangId}, ${data7.date.toISOString()}, ${data7.weightPounds}, ${data7.scale0}, ${data7.scale1},
                ${data7.scale2}, ${data7.scale3}),
               (${hangId}, ${data8.date.toISOString()}, ${data8.weightPounds}, ${data8.scale0}, ${data8.scale1},
                ${data8.scale2}, ${data8.scale3}),
               (${hangId}, ${data9.date.toISOString()}, ${data9.weightPounds}, ${data9.scale0}, ${data9.scale1},
                ${data9.scale2}, ${data9.scale3}),
               (${hangId}, ${data10.date.toISOString()}, ${data10.weightPounds}, ${data10.scale0}, ${data10.scale1},
                ${data10.scale2}, ${data10.scale3}),
               (${hangId}, ${data11.date.toISOString()}, ${data11.weightPounds}, ${data11.scale0}, ${data11.scale1},
                ${data11.scale2}, ${data11.scale3}),
               (${hangId}, ${data12.date.toISOString()}, ${data12.weightPounds}, ${data12.scale0}, ${data12.scale1},
                ${data12.scale2}, ${data12.scale3}),
               (${hangId}, ${data13.date.toISOString()}, ${data13.weightPounds}, ${data13.scale0}, ${data13.scale1},
                ${data13.scale2}, ${data13.scale3}),
               (${hangId}, ${data14.date.toISOString()}, ${data14.weightPounds}, ${data14.scale0}, ${data14.scale1},
                ${data14.scale2}, ${data14.scale3}),
               (${hangId}, ${data15.date.toISOString()}, ${data15.weightPounds}, ${data15.scale0}, ${data15.scale1},
                ${data15.scale2}, ${data15.scale3}),
               (${hangId}, ${data16.date.toISOString()}, ${data16.weightPounds}, ${data16.scale0}, ${data16.scale1},
                ${data16.scale2}, ${data16.scale3}),
               (${hangId}, ${data17.date.toISOString()}, ${data17.weightPounds}, ${data17.scale0}, ${data17.scale1},
                ${data17.scale2}, ${data17.scale3}),
               (${hangId}, ${data18.date.toISOString()}, ${data18.weightPounds}, ${data18.scale0}, ${data18.scale1},
                ${data18.scale2}, ${data18.scale3}),
               (${hangId}, ${data19.date.toISOString()}, ${data19.weightPounds}, ${data19.scale0}, ${data19.scale1},
                ${data19.scale2}, ${data19.scale3}),

               (${hangId}, ${data20.date.toISOString()}, ${data20.weightPounds}, ${data20.scale0}, ${data20.scale1},
                ${data20.scale2}, ${data20.scale3}),
               (${hangId}, ${data21.date.toISOString()}, ${data21.weightPounds}, ${data21.scale0}, ${data21.scale1},
                ${data21.scale2}, ${data21.scale3}),
               (${hangId}, ${data22.date.toISOString()}, ${data22.weightPounds}, ${data22.scale0}, ${data22.scale1},
                ${data22.scale2}, ${data22.scale3}),
               (${hangId}, ${data23.date.toISOString()}, ${data23.weightPounds}, ${data23.scale0}, ${data23.scale1},
                ${data23.scale2}, ${data23.scale3}),
               (${hangId}, ${data24.date.toISOString()}, ${data24.weightPounds}, ${data24.scale0}, ${data24.scale1},
                ${data24.scale2}, ${data24.scale3}),
               (${hangId}, ${data25.date.toISOString()}, ${data25.weightPounds}, ${data25.scale0}, ${data25.scale1},
                ${data25.scale2}, ${data25.scale3}),
               (${hangId}, ${data26.date.toISOString()}, ${data26.weightPounds}, ${data26.scale0}, ${data26.scale1},
                ${data26.scale2}, ${data26.scale3}),
               (${hangId}, ${data27.date.toISOString()}, ${data27.weightPounds}, ${data27.scale0}, ${data27.scale1},
                ${data27.scale2}, ${data27.scale3}),
               (${hangId}, ${data28.date.toISOString()}, ${data28.weightPounds}, ${data28.scale0}, ${data28.scale1},
                ${data28.scale2}, ${data28.scale3}),
               (${hangId}, ${data29.date.toISOString()}, ${data29.weightPounds}, ${data29.scale0}, ${data29.scale1},
                ${data29.scale2}, ${data29.scale3}),

               (${hangId}, ${data30.date.toISOString()}, ${data30.weightPounds}, ${data30.scale0}, ${data30.scale1},
                ${data30.scale2}, ${data30.scale3}),
               (${hangId}, ${data31.date.toISOString()}, ${data31.weightPounds}, ${data31.scale0}, ${data31.scale1},
                ${data31.scale2}, ${data31.scale3}),
               (${hangId}, ${data32.date.toISOString()}, ${data32.weightPounds}, ${data32.scale0}, ${data32.scale1},
                ${data32.scale2}, ${data32.scale3}),
               (${hangId}, ${data33.date.toISOString()}, ${data33.weightPounds}, ${data33.scale0}, ${data33.scale1},
                ${data33.scale2}, ${data33.scale3}),
               (${hangId}, ${data34.date.toISOString()}, ${data34.weightPounds}, ${data34.scale0}, ${data34.scale1},
                ${data34.scale2}, ${data34.scale3}),
               (${hangId}, ${data35.date.toISOString()}, ${data35.weightPounds}, ${data35.scale0}, ${data35.scale1},
                ${data35.scale2}, ${data35.scale3}),
               (${hangId}, ${data36.date.toISOString()}, ${data36.weightPounds}, ${data36.scale0}, ${data36.scale1},
                ${data36.scale2}, ${data36.scale3}),
               (${hangId}, ${data37.date.toISOString()}, ${data37.weightPounds}, ${data37.scale0}, ${data37.scale1},
                ${data37.scale2}, ${data37.scale3}),
               (${hangId}, ${data38.date.toISOString()}, ${data38.weightPounds}, ${data38.scale0}, ${data38.scale1},
                ${data38.scale2}, ${data38.scale3}),
               (${hangId}, ${data39.date.toISOString()}, ${data39.weightPounds}, ${data39.scale0}, ${data39.scale1},
                ${data39.scale2}, ${data39.scale3}),
               (${hangId}, ${data40.date.toISOString()}, ${data40.weightPounds}, ${data40.scale0}, ${data40.scale1},
                ${data40.scale2}, ${data40.scale3}),
               (${hangId}, ${data41.date.toISOString()}, ${data41.weightPounds}, ${data41.scale0}, ${data41.scale1},
                ${data41.scale2}, ${data41.scale3}),
               (${hangId}, ${data42.date.toISOString()}, ${data42.weightPounds}, ${data42.scale0}, ${data42.scale1},
                ${data42.scale2}, ${data42.scale3}),
               (${hangId}, ${data43.date.toISOString()}, ${data43.weightPounds}, ${data43.scale0}, ${data43.scale1},
                ${data43.scale2}, ${data43.scale3}),
               (${hangId}, ${data44.date.toISOString()}, ${data44.weightPounds}, ${data44.scale0}, ${data44.scale1},
                ${data44.scale2}, ${data44.scale3}),
               (${hangId}, ${data45.date.toISOString()}, ${data45.weightPounds}, ${data45.scale0}, ${data45.scale1},
                ${data45.scale2}, ${data45.scale3}),
               (${hangId}, ${data46.date.toISOString()}, ${data46.weightPounds}, ${data46.scale0}, ${data46.scale1},
                ${data46.scale2}, ${data46.scale3}),
               (${hangId}, ${data47.date.toISOString()}, ${data47.weightPounds}, ${data47.scale0}, ${data47.scale1},
                ${data47.scale2}, ${data47.scale3}),
               (${hangId}, ${data48.date.toISOString()}, ${data48.weightPounds}, ${data48.scale0}, ${data48.scale1},
                ${data48.scale2}, ${data48.scale3}),
               (${hangId}, ${data49.date.toISOString()}, ${data49.weightPounds}, ${data49.scale0}, ${data49.scale1},
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
        INSERT INTO hang_moment (hang_id, timestamp, weight_pounds, scale0, scale1, scale2, scale3)
        VALUES (${hangId}, ${data0.date.toISOString()}, ${data0.weightPounds}, ${data0.scale0}, ${data0.scale1},
                ${data0.scale2}, ${data0.scale3}),
               (${hangId}, ${data1.date.toISOString()}, ${data1.weightPounds}, ${data1.scale0}, ${data1.scale1},
                ${data1.scale2}, ${data1.scale3}),
               (${hangId}, ${data2.date.toISOString()}, ${data2.weightPounds}, ${data2.scale0}, ${data2.scale1},
                ${data2.scale2}, ${data2.scale3}),
               (${hangId}, ${data3.date.toISOString()}, ${data3.weightPounds}, ${data3.scale0}, ${data3.scale1},
                ${data3.scale2}, ${data3.scale3}),
               (${hangId}, ${data4.date.toISOString()}, ${data4.weightPounds}, ${data4.scale0}, ${data4.scale1},
                ${data4.scale2}, ${data4.scale3}),
               (${hangId}, ${data5.date.toISOString()}, ${data5.weightPounds}, ${data5.scale0}, ${data5.scale1},
                ${data5.scale2}, ${data5.scale3}),
               (${hangId}, ${data6.date.toISOString()}, ${data6.weightPounds}, ${data6.scale0}, ${data6.scale1},
                ${data6.scale2}, ${data6.scale3}),
               (${hangId}, ${data7.date.toISOString()}, ${data7.weightPounds}, ${data7.scale0}, ${data7.scale1},
                ${data7.scale2}, ${data7.scale3}),
               (${hangId}, ${data8.date.toISOString()}, ${data8.weightPounds}, ${data8.scale0}, ${data8.scale1},
                ${data8.scale2}, ${data8.scale3}),
               (${hangId}, ${data9.date.toISOString()}, ${data9.weightPounds}, ${data9.scale0}, ${data9.scale1},
                ${data9.scale2}, ${data9.scale3})
    `;
  }
}

async function singleInsert(hangId: string, client: VercelPoolClient, scaleData: ScaleSumData[]) {
  for (const data of scaleData) {
    console.log("bulk insert 1");
    await client.sql`
        INSERT INTO hang_moment (hang_id, timestamp, weight_pounds, scale0, scale1, scale2, scale3)
        VALUES (${hangId}, ${data.date.toISOString()}, ${data.weightPounds}, ${data.scale0}, ${data.scale1},
                ${data.scale2},
                ${data.scale3});
    `;
  }
}
