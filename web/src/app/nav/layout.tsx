"use client";

import * as React from "react";
import {
  makeStyles,
  Tab,
  TabList,
  Divider,
  TabValue
} from "@fluentui/react-components";
import {
  bundleIcon,
  AddSquareRegular,
  AddSquareFilled,
  PersonFilled,
  PersonRegular
} from "@fluentui/react-icons";
import type { SelectTabData, SelectTabEvent } from "@fluentui/react-components";
import { ReactElement, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/dist/client/components/navigation";
import { ChildrenProp } from "@/components/util";

const AddSquare = bundleIcon(AddSquareFilled, AddSquareRegular);
const Person = bundleIcon(PersonFilled, PersonRegular);

const useStyles = makeStyles({
  nav: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  children: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: "20px"
  }
});

export default function NavLayout({ children }: ChildrenProp): ReactElement {
  const path = usePathname()
  let selectedInit = "local"
  if (path.includes("connected")) {
    selectedInit = "connected"
  }

  const styles = useStyles();
  const [selectedValue, setSelectedValue] = React.useState<TabValue>(selectedInit);

  const onTabSelect = (event: SelectTabEvent, data: SelectTabData) => {
    setSelectedValue(data.value);
  };

  return (
    <>
      <div className={styles.nav}>
        <TabList selectedValue={selectedValue} onTabSelect={onTabSelect}>
          <Link href={"/nav/local"}>
            <Tab id="Local" icon={<AddSquare />} value="local">
              Local
            </Tab>
          </Link>
          <Link href={"/nav/connected"}>
            <Tab id="Connected" icon={<Person />} value="connected">
              Connected
            </Tab>
          </Link>
        </TabList>
        <Divider />
      </div>
      <div className={styles.children}>{children}</div>
    </>
  );
}
