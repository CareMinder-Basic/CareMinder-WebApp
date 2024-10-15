const RoutePath = {
  //main
  Home: "/",
  StaffHomePage: "/staff",
  Requests: "/request",
  PatientManagement: "/management",
  Diet: "/diet",
  Notice: "/notice",
  Settings: "/settings",

  //staff
  StaffCompletedRequests: "/staff/completed",
  StaffWardManagement: "/staff",
  StaffWardInOut: "/staff/inout",
  StaffNotice: "/staff/notice",
  StaffNoticeWrite: "/staff/noticeWrite",
  StaffSettings: "staff/settings",

  //admin
  AdminWardManagement: "/staff/admin",

  Signin: "/sign-in",
  AdminSignin: "/sign-in/admin",
} as const;

export default RoutePath;
