import "../styles/globals.css";
import { Tooltip } from "react-tooltip";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Tooltip id="replicate-tooltip" />
      <Tooltip id="github-tooltip" />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
