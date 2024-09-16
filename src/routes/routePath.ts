const RoutePath = {
  Home: "/",
  Requests: "/request",
  CompletedRequests: "/completed",
  PatientManagement: "/management",
  Diet: "/diet",
  Notice: "/notice",
  Settings: "/settings",
  AdminWardManagement: "/admin",
  AdminWardInOut: "/admin/inout",

  AdminStaffManagement: "/admin/staff",

  Signin: "/sign-in",
  AdminSignin: "/sign-in/admin",
} as const;

export default RoutePath;
