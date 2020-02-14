import App from "./App";
import Root from "./components";
import Three from "./components/three";

export interface Route {
  path: string;
  exact: boolean;
  component: () => JSX.Element;
}

const routes: Route[] = [
  { path: "/react-start", exact: true, component: App },
  { path: "/", exact: true, component: Root },
  { path: "/logo", exact: true, component: Three }
];

export default routes;
