import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import "./index.css";
import * as serviceWorker from "./serviceWorker";

import routes from "./routes";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Switch>
      {routes.map(({ path, exact, component }) => (
        <Route key={path} path={path} exact={exact} component={component} />
      ))}
    </Switch>
  </BrowserRouter>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
