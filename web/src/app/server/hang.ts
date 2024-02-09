import "server-only";
import { sql } from "@vercel/postgres";

type HangQuery = {
  // todo: actual types instead of strings
  hangId: string
  hangMomentId: string
  boardId: string
  userId: string
  calibration: string
  timestamp: string
  scale0: string
  scale1: string
  scale2: string
  scale3: string
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
  scale0: string
  scale1: string
  scale2: string
  scale3: string
}

export async function getHangs(): Promise<Hang[]> {
  const { rows } = await sql`
      SELECT hang.hang_id,
             hang_moment_id,
             board_id,
             user_id,
             calibration,
             timestamp,
             scale0,
             scale1,
             scale2,
             scale3
      FROM hang
               JOIN public.hang_moment hm USING(hang_id);`;

  const hangMoments = rows.map(row => {
    return {
      hangId: row["hang_id"],
      hangMomentId: row["hang_moment_id"],
      boardId: row["board_id"],
      userId: row["user_id"],
      calibration: row["calibration"],
      timestamp: row["timestamp"],
      scale0: row["scale0"],
      scale1: row["scale1"],
      scale2: row["scale2"],
      scale3: row["scale3"]
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
          scale0: momentQuery.scale0,
          scale1: momentQuery.scale1,
          scale2: momentQuery.scale2,
          scale3: momentQuery.scale3
        };
        return moment;
      })
    };
    hangs.push(hang);
  });

  return hangs;
}