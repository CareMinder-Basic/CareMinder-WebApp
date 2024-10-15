import { ReactComponent as Notice } from "@assets/menuIcons/notice.svg";
import MenuLayout from "./MenuLayout";
import RoutePath from "@routes/routePath";

export default function NoticeMenu() {
  return (
    // <SwitchCase
    //   value={user?.type as UserType}
    //   caseBy={{
    //     main: <MenuLayout routePath={RoutePath.StaffNotice} pageName={"공지"} icon={Notice} />,
    //     staff: <MenuLayout routePath={RoutePath.StaffNotice} pageName={"공지"} icon={Notice} />,
    //   }}
    // />
    <MenuLayout routePath={RoutePath.StaffNotice} pageName={"공지"} icon={Notice} />
  );
}
