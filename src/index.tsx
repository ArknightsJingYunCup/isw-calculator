/* @refresh reload */
import 'virtual:uno.css'
import { render } from "solid-js/web";
import App from "./App";
import { createTheme, ThemeProvider } from "@suid/material";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#b6b6b6"
    }
  }
})

render(() => <ThemeProvider theme={theme}>
  <App />
</ThemeProvider>, document.getElementById("root") as HTMLElement);
