import LandingPage from "./pages/Landing";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SettingsPage from "./pages/Settings";

const App = () => {
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
    </Router>
  );
};

export default App;
