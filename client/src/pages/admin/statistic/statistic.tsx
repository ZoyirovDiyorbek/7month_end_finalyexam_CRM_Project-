import { Card, Statistic as AntStatistic, Typography, Row, Col, Space, Button } from "antd";
import { 
  UserOutlined, 
  TeamOutlined, 
  UsergroupAddOutlined, 
  BookOutlined,
  ArrowRightOutlined
} from "@ant-design/icons";
import { useStatistic } from "../service/query/useStatistic";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

interface StatCard {
  key: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  link: string;
}

export const Statistic = () => {
  const { data, isLoading } = useStatistic();
  const navigate = useNavigate();
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  const statCards: StatCard[] = [
    {
      key: "adminCount",
      title: "Adminlar",
      icon: <UserOutlined style={{ fontSize: 32 }} />,
      color: "#000",
      link: "/app/admin",
    },
    {
      key: "teacherCount",
      title: "O'qituvchilar",
      icon: <TeamOutlined style={{ fontSize: 32 }} />,
      color: "#000",
      link: "/app/admin/teachers",
    },
    {
      key: "studentCount",
      title: "O'quvchilar",
      icon: <UsergroupAddOutlined style={{ fontSize: 32 }} />,
      color: "#000",
      link: "/app/admin/students",
    },
    {
      key: "groupCount",
      title: "Guruhlar",
      icon: <BookOutlined style={{ fontSize: 32 }} />,
      color: "#000",
      link: "/app/admin/groups",
    },
  ];

  useEffect(() => {
    if (data?.data) {
      const cards: StatCard[] = [
        { key: "adminCount", title: "", icon: null, color: "", link: "" },
        { key: "teacherCount", title: "", icon: null, color: "", link: "" },
        { key: "studentCount", title: "", icon: null, color: "", link: "" },
        { key: "groupCount", title: "", icon: null, color: "", link: "" },
      ];
      
      cards.forEach((card) => {
        const value = data.data[card.key as keyof typeof data.data] || 0;
        let current = 0;
        const increment = Math.max(1, value / 30);
        const timer = setInterval(() => {
          current += increment;
          if (current >= value) {
            current = value;
            clearInterval(timer);
          }
          setAnimatedValues((prev) => ({
            ...prev,
            [card.key]: Math.floor(current),
          }));
        }, 30);
        return () => clearInterval(timer);
      });
    }
  }, [data]);

  if (isLoading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <Text>Ma'lumotlar yuklanmoqda...</Text>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px 0" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card 
          style={{ 
            background: "linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)",
            border: "1px solid #e8e8e8",
            borderRadius: 8
          }}
        >
          <Space direction="vertical" size="small">
            <Title level={2} style={{ margin: 0, color: "#000" }}>
              Xush kelibsiz! 👋
            </Title>
            <Text type="secondary" style={{ fontSize: 16 }}>
              EduManage boshqaruv paneliga xush kelibsiz. Quyida umumiy statistika ma'lumotlari ko'rsatilgan.
            </Text>
          </Space>
        </Card>

        <Row gutter={[16, 16]}>
          {statCards.map((card) => {
            const displayValue = animatedValues[card.key] ?? 0;
            
            return (
              <Col xs={24} sm={12} lg={6} key={card.key}>
                <Card
                  hoverable
                  onClick={() => navigate(card.link)}
                  style={{
                    border: "1px solid #e8e8e8",
                    borderRadius: 8,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  bodyStyle={{ padding: 24 }}
                >
                  <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center" 
                    }}>
                      <div style={{ 
                        width: 56, 
                        height: 56, 
                        borderRadius: 8,
                        background: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: card.color
                      }}>
                        {card.icon}
                      </div>
                      <Button 
                        type="text" 
                        icon={<ArrowRightOutlined />}
                        style={{ color: "#000" }}
                      />
                    </div>
                    <div>
                      <AntStatistic
                        title={
                          <Text style={{ fontSize: 14, color: "#8c8c8c" }}>
                            {card.title}
                          </Text>
                        }
                        value={displayValue}
                        valueStyle={{ 
                          color: "#000", 
                          fontSize: 36, 
                          fontWeight: "bold",
                          lineHeight: 1.2
                        }}
                      />
                    </div>
                  </Space>
                </Card>
              </Col>
            );
          })}
        </Row>

        <Card 
          title={<Title level={4} style={{ margin: 0 }}>Tezkor amallar</Title>}
          style={{ border: "1px solid #e8e8e8", borderRadius: 8 }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Button
                type="default"
                block
                size="large"
                icon={<TeamOutlined />}
                onClick={() => navigate("/app/admin/teachers")}
                style={{
                  height: 60,
                  borderColor: "#d9d9d9",
                  color: "#000",
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                O'qituvchi qo'shish
              </Button>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Button
                type="default"
                block
                size="large"
                icon={<BookOutlined />}
                onClick={() => navigate("/app/admin/groups")}
                style={{
                  height: 60,
                  borderColor: "#d9d9d9",
                  color: "#000",
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                Guruh yaratish
              </Button>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Button
                type="default"
                block
                size="large"
                icon={<UsergroupAddOutlined />}
                onClick={() => navigate("/app/admin/students")}
                style={{
                  height: 60,
                  borderColor: "#d9d9d9",
                  color: "#000",
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                O'quvchi qo'shish
              </Button>
            </Col>
          </Row>
        </Card>
      </Space>
    </div>
  );
};
