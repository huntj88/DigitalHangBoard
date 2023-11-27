"use client";

import * as React from "react";
import {
  makeStyles,
  Tab,
  TabList,
  Divider,
  TabValue,
} from "@fluentui/react-components";
import {
  bundleIcon,
  AddSquareRegular,
  AddSquareFilled,
  PersonFilled,
  PersonRegular,
} from "@fluentui/react-icons";
import type { SelectTabData, SelectTabEvent } from "@fluentui/react-components";
import { useRouter } from "next/navigation";
import { ReactElement, ReactNode } from "react";

const AddSquare = bundleIcon(AddSquareFilled, AddSquareRegular);
const Person = bundleIcon(PersonFilled, PersonRegular);

const useStyles = makeStyles({
  nav: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  children: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: "20px",
  },
});

export default function NavLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  const router = useRouter();
  const styles = useStyles();

  const [selectedValue, setSelectedValue] = React.useState<TabValue>("local");

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
    if (data.value === "local") {
      router.push("/nav/local");
    } else if (data.value === "connected") {
      router.push("/nav/connected");
    }
  };

  return (
    <>
      <div className={styles.nav}>
        <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
          <Tab id="Local" icon={<AddSquare />} value="local">
            Local
          </Tab>
          <Tab id="Connected" icon={<Person />} value="connected">
            Connected
          </Tab>
        </TabList>
        <Divider />
      </div>
      <div className={styles.children}>{children}</div>
    </>
  );
}
