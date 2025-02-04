import { Navigate, RouteObject } from "react-router-dom";
import RoutePath from "@routes/routePath";
import { createHashRouter } from "react-router-dom";
import { AdminSigninPage, SigninPage } from "@pages/index";
import SuperAdminPage from "@pages/superAdmin/SuperAdminPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to={RoutePath.Signin} replace />, // 루트 경로에서 Signin 페이지로 리다이렉트
  },
  { path: RoutePath.Signin, element: <SigninPage /> },
  { path: RoutePath.SuperAdmin, element: <SuperAdminPage /> },
  { path: RoutePath.AdminSignin, element: <AdminSigninPage /> },
  { path: "*", element: <>Not found page</> },
];

const Router = createHashRouter(routes);

export default Router;
