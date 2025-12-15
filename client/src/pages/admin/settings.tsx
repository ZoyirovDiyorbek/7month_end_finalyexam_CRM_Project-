import { Card, Typography } from "antd";

const { Title } = Typography;

export const Settings = () => {
  return (
    <Card>
      <Title level={4}>Settings</Title>
      <p className="text-gray-500">Application settings</p>
    </Card>
  );
};
