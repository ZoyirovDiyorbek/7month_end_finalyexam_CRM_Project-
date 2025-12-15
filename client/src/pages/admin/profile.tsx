import { Card, Typography } from "antd";

const { Title } = Typography;

export const Profile = () => {
  return (
    <Card>
      <Title level={4}>Profile</Title>
      <p className="text-gray-500">Admin profile page</p>
    </Card>
  );
};
