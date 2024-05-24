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

  const momentsDbSchema = moments.map(m => ({
    hang_id: hangId,
    timestamp: m.date.toISOString(),
    weight_pounds: m.weightPounds,
    scale0: m.scale0,
    scale1: m.scale1,
    scale2: m.scale2,
    scale3: m.scale3
  }));

  await client.query(`
              INSERT INTO hang_moment (hang_id, timestamp, weight_pounds, scale0, scale1, scale2, scale3)
              SELECT hang_id, timestamp, weight_pounds, scale0, scale1, scale2, scale3
              FROM json_populate_recordset(NULL::hang_moment, $1)
    `,
    [JSON.stringify(momentsDbSchema)]
  );
}
