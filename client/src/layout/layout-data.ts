import {
  Home,
  Group,
  Users,
  GroupIcon,
  User,
  GraduationCap,
} from "lucide-react";

export const links = {
  admin: [
    {
      title: "Home",
      url: "/app/admin",
      icon: Home,
    },
    {
      title: "Teachers",
      url: "/app/admin/teachers",
      icon: Users,
    },
    {
      title: "Groups",
      url: "/app/admin/groups",
      icon: Group,
    },
    {
      title: "Students",
      url: "/app/admin/students",
      icon: GraduationCap,
    },
  ],
  teacher: [
    {
      title: "My Groups",
      url: "/app/teacher",
      icon: GroupIcon,
    },
    {
      title: "Profile",
      url: "/app/teacher/profile",
      icon: User,
    },
    {
      title: "My Students",
      url: "/app/teacher/students",
      icon: Users,
    },
  ],
};
