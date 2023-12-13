"use client";

import { useEffect, useState, ReactNode } from "react";
import { ThemeProvider, useThemeContext } from "./ThemeProvider";
import {
  createDOMRenderer,
  RendererProvider,
  FluentProvider,
  SSRProvider,
  webLightTheme,
  webDarkTheme,
  makeStyles,
  tokens
} from "@fluentui/react-components";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { BluetoothProvider } from "@/bluetooth/BluetoothProvider";
import { SessionProvider } from "@/session/SessionProvider";
import { ChildrenProp } from "@/components/util";

// Create a DOM renderer for Fluent UI.
const renderer = createDOMRenderer();

const useStyles = makeStyles({
  root: {
    backgroundColor: tokens.colorBrandBackground2
  }
});

export function Providers({ children }: ChildrenProp) {
  // Declare a state variable named 'hasMounted' and a function named 'setHasMounted' to update it.
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []); // add empty array as second argument to run only once

  if (!hasMounted) {
    return null;
  }

  // If the component has mounted, return a set of providers.
  return (
    <ThemeProvider>
      <RendererProvider renderer={renderer}>
        <SSRProvider>
          <WrappedFluentProvider>
            <BluetoothProvider>
              <SessionProvider>
                <UserProvider>
                  {children}
                </UserProvider>
              </SessionProvider>
            </BluetoothProvider>
          </WrappedFluentProvider>
        </SSRProvider>
      </RendererProvider>
    </ThemeProvider>
  );
}

const WrappedFluentProvider = ({ children }: ChildrenProp) => {
  // Get styles for Fluent UI components using makeStyles function.
  const styles = useStyles();
  // Get the current theme from the app's theme context using useThemeContext hook.
  const { theme } = useThemeContext();
  // Set the app's theme to a corresponding Fluent UI theme.
  const currentTheme = theme === "light" ? webLightTheme : webDarkTheme;

  return (
    <FluentProvider theme={currentTheme} className={styles.root}>
      {children}
    </FluentProvider>
  );
};
