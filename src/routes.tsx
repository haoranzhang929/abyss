import { MemoExoticComponent } from "react";

import Three from "./components/three";

export interface Route {
  path: string;
  exact: boolean;
  component: (() => JSX.Element) | MemoExoticComponent<() => JSX.Element>;
}

const routes: Route[] = [{ path: "/", exact: true, component: Three }];

export default routes;
