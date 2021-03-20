import LandingPage from "./pages/Landing";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SettingsPage from "./pages/Settings";
import CookieConsent, {
  Cookies,
  getCookieConsentValue,
} from "react-cookie-consent";
import { initGA } from "./utility/ga-utils";
import { useEffect } from "react";

const GA_MID = "G-1BJ43TZTB8";

const App = () => {
  const handleAcceptCookie = () => {
    if (GA_MID) {
      initGA(GA_MID);
    }
  };

  const handleDeclineCookie = () => {
    //remove google analytics cookies
    Cookies.remove("_ga");
    Cookies.remove("_gat");
    Cookies.remove("_gid");
  };

  useEffect(() => {
    const isConsent = getCookieConsentValue();
    if (isConsent === "true") {
      handleAcceptCookie();
    }
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/settings">
          <SettingsPage />
        </Route>
        <Route path="/">
          <LandingPage />
        </Route>
      </Switch>
      <CookieConsent
        declineButtonText="ablehnen"
        buttonText="annehmen"
        buttonStyle={{
          background: "green",
          borderRadius: "5px",
          color: "#fcfcfc",
        }}
        declineButtonStyle={{
          background: "",
          border: "solid #9c9c9c 1px",
          borderRadius: "5px",
        }}
        enableDeclineButton
        onAccept={handleAcceptCookie}
        onDecline={handleDeclineCookie}
      >
        Google Analytics Cookies zulassen
      </CookieConsent>
    </Router>
  );
};

export default App;
