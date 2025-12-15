import { Modal, Avatar, Typography, Descriptions, Tag, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useAdminProfile } from "@/pages/admin/service/query/useAdminProfile";
import { useProfile } from "@/pages/teacher/service/query/useProfile";

const { Title, Text } = Typography;

interface UserProfilePopupProps {
  open: boolean;
  onClose: () => void;
  role: "admin" | "teacher";
}

export const UserProfilePopup = ({ open, onClose, role }: UserProfilePopupProps) => {
  const { data: adminData, isLoading: adminLoading } = useAdminProfile({ enabled: role === "admin" && open });
  const { data: teacherData, isLoading: teacherLoading } = useProfile();

  const isLoading = role === "admin" ? adminLoading : teacherLoading;

  if (isLoading) {
    return (
      <Modal
        title="Profil"
        open={open}
        onCancel={onClose}
        footer={null}
      >
        <div style={{ textAlign: "center", padding: 20 }}>
          <Text>Yuklanmoqda...</Text>
        </div>
      </Modal>
    );
  }

  if (role === "admin" && adminData) {
    const admin = adminData.data;
    return (
      <Modal
        title="Profil ma'lumotlari"
        open={open}
        onCancel={onClose}
        footer={null}
        width={500}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
          <Avatar
            size={80}
            src={admin.avatarUrl ? `http://localhost:3000/${admin.avatarUrl}` : undefined}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#87d068" }}
          />
          <Title level={4} style={{ marginTop: 10, marginBottom: 0 }}>
            {admin.fullName}
          </Title>
          <Text type="secondary">@{admin.username}</Text>
        </div>

        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="To'liq ism">{admin.fullName}</Descriptions.Item>
          <Descriptions.Item label="Username">@{admin.username}</Descriptions.Item>
          <Descriptions.Item label="Rol">
            <Tag color="blue">{admin.role}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Qo'shilgan sana">
            {new Date(admin.createdAt).toLocaleDateString("uz-UZ")}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    );
  }

  if (role === "teacher" && teacherData) {
    const teacher = teacherData.data;
    return (
      <Modal
        title="Profil ma'lumotlari"
        open={open}
        onCancel={onClose}
        footer={null}
        width={500}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
          <Avatar
            size={80}
            src={teacher.avatarUrl ? `http://localhost:3000/${teacher.avatarUrl}` : undefined}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#87d068" }}
          />
          <Title level={4} style={{ marginTop: 10, marginBottom: 0 }}>
            {teacher.name}
          </Title>
          <Text type="secondary">@{teacher.username}</Text>
        </div>

        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="To'liq ism">{teacher.name}</Descriptions.Item>
          <Descriptions.Item label="Username">@{teacher.username}</Descriptions.Item>
          <Descriptions.Item label="Rol">
            <Tag color="blue">{teacher.role === "TEACHER" ? "O'qituvchi" : teacher.role}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Holati">
            <Tag color={teacher.isActive ? "green" : "red"}>
              {teacher.isActive ? "Faol" : "Nofaol"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Qo'shilgan sana">
            {new Date(teacher.createdAt).toLocaleDateString("uz-UZ")}
          </Descriptions.Item>
          {teacher.specifications && teacher.specifications.length > 0 && (
            <Descriptions.Item label="Mutaxassisliklar">
              <Space wrap>
                {teacher.specifications.map((spec) => (
                  <Tag key={spec.id} color="default">
                    {spec.name}
                  </Tag>
                ))}
              </Space>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Modal>
    );
  }

  return null;
};

