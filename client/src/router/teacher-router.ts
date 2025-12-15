import { Groups } from "@/pages/admin/groups/groups";
import { GroupDetail } from "../pages/teacher/groups/group-detail";
import { Profile } from "../pages/teacher/profile/profile";
import { Students } from "../pages/teacher/students/students";

export default [
  {
    path: "teacher",
    page: Groups,
  },
  {
    path: "group/:id",
    page: GroupDetail,
  },
  {
    path: "profile",
    page: Profile,
  },
  {
    path: "students",
    page: Students,
  },
];
