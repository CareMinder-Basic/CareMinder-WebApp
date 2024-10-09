import { RouteObject, createBrowserRouter } from "react-router-dom";
import RoutePath from "@routes/routePath";
import AuthenticatedLayout from "@components/layout";
import AuthorizedRoute from "@routes/AuthorizedRoute";
import {
  AdminSigninPage,
  AdminWardInoutManagementPage,
  CompletedRequestsPage,
  DietPage,
  NoticePage,
  PatientManagementPage,
  RequestsPage,
  SettingsPage,
  SigninPage,
} from "@pages/index";
import MainHomePage from "@pages/user/MainHomePage";
import StaffHomePage from "@pages/user/StaffHomePage";
import StaffNoticePage from "@pages/sfaff/StaffNoticePage";
import StaffNoticeWritePage from "@pages/sfaff/StaffNoticeWritePage";

const routes: RouteObject[] = [
  {
    path: RoutePath.Home,
    element: <AuthenticatedLayout />,
    children: [
      {
        element: <AuthorizedRoute allowedRoles={["main", "staff"]} />,
        children: [
          { index: true, element: <MainHomePage /> },
          { path: RoutePath.StaffHomePage, element: <StaffHomePage /> },
          { path: RoutePath.CompletedRequests, element: <CompletedRequestsPage /> },
          { path: RoutePath.Diet, element: <DietPage /> },
          { path: RoutePath.Notice, element: <NoticePage /> },
          { path: RoutePath.PatientManagement, element: <PatientManagementPage /> },
          { path: RoutePath.Requests, element: <RequestsPage /> },
          { path: RoutePath.Settings, element: <SettingsPage /> },
        ],
      },
      {
        path: RoutePath.StaffWardManagement,
        element: <AuthorizedRoute allowedRoles={["staff"]} />,
        children: [
          { index: true, element: <MainHomePage /> },
          { path: RoutePath.StaffWardInOut, element: <AdminWardInoutManagementPage /> },
          { path: RoutePath.StaffNotice, element: <StaffNoticePage /> },
          { path: RoutePath.StaffNoticeWrite, element: <StaffNoticeWritePage /> },
        ],
      },
    ],
  },
  { path: RoutePath.Signin, element: <SigninPage /> },
  { path: RoutePath.AdminSignin, element: <AdminSigninPage /> },
  { path: "*", element: <>Not found page</> },
];

const Router = createBrowserRouter(routes);

export default Router;
