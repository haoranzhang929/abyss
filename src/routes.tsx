import { MemoExoticComponent } from "react";

import App from "./App";
import Root from "./components";
import Three from "./components/three";

export interface Route {
  path: string;
  exact: boolean;
  component: (() => JSX.Element) | MemoExoticComponent<() => JSX.Element>;
}

const routes: Route[] = [
  { path: "/react-start", exact: true, component: App },
  { path: "/", exact: true, component: Three },
  { path: "/logo", exact: true, component: Root }
];

export default routes;
