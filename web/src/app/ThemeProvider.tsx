"use client";

/**
 * React library imports.
 *
 * @property {function} createContext - A function to create a new context object.
 * @property {function} useContext - A function to access a context object.
 * @property {function} useState - A hook to manage state within a component.
 */
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

/**
 * Creates a new theme context with default values.
 *
 * @returns {ThemeContext} A new theme context object.
 */
const ThemeContext = createContext<{
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
}>({
  theme: "light",
  setTheme: () => {},
});
type ChildrenProp = {
  children: ReactNode;
};

/**
 * Provides the theme context to child components.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to be rendered.
 * @returns {JSX.Element} The rendered component.
 */

export const ThemeProvider = ({ children }: ChildrenProp) => {
  // Default theme name.
  const defaultTheme = "light";
  // State hook to manage the theme state within the component.
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Returns the current theme context object.
 *
 * @returns {ThemeContext} The current theme context object.
 */
export const useThemeContext = () => useContext(ThemeContext);
