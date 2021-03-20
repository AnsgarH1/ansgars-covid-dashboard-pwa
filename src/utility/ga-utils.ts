import * as ReactGA from "react-ga";

export const initGA = (id: string) => {
  if (process.env.NODE_ENV === "production") {
    console.log("initialized GA!")
    ReactGA.initialize(id);
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
};
