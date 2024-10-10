import { ReactComponent as Staff } from "@assets/menuIcons/staff.svg";
import MenuLayout from "./MenuLayout";

export default function AdminStaffManagementMenu() {
  return <MenuLayout routePath={"*"} pageName={`스태프\n계정 관리`} icon={Staff} />;
}
