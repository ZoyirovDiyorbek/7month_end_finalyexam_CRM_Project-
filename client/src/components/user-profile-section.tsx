import { useState } from "react";
import { UserProfilePopup } from "./user-profile-popup";
import { Button } from "antd";
import { UserOutlined } from "@ant-design/icons";

interface UserProfileSectionProps {
  role: "admin" | "teacher";
}

export const UserProfileSection = ({ role }: UserProfileSectionProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <Button
        type="text"
        icon={<UserOutlined />}
        onClick={() => setIsPopupOpen(true)}
        style={{ padding: 0, height: "auto" }}
      />
      <UserProfilePopup
        open={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        role={role}
      />
    </>
  );
};

