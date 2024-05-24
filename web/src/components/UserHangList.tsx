import { getHang, getHangs, Hang } from "@/app/server/hang";
import * as React from "react";
import { HangCard, HangListStyled } from "@/components/HangCard";
import { Suspense } from "react";
import { waitForDelay } from "@/utils";

export const UserHangList = async (props: { userId: string }) => {
  const hangs = await getHangs(props.userId);
  return (
    <Suspense fallback={<p>Loading</p>}>
      <HangList hangs={hangs} />
    </Suspense>
  );
};

export const HangList = (props: { hangs: Hang[] }) => {
  return (
    <HangListStyled>
      {props.hangs?.map(hang =>
        <Suspense key={hang.hangId} fallback={<p>Loading</p>}>
          <HangCardDetail hang={hang} />
        </Suspense>)}
    </HangListStyled>
  );
};

export const HangCardDetail = async (props: { hang: Hang }) => {
  // console.log("hangCardDetail", props);
  // const hang = await getHang(props.hang.hangId);
  return (
    <HangCard hang={props.hang} />
  );
};