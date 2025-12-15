import { Typography, Table, Button, Modal, Form, Input, Select, Space, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useStudentsList } from "../service/query/useStudentsList";
import { useEvaluateStudent } from "../service/mutation/useEvaluateStudent";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";

const { Title } = Typography;
const { TextArea } = Input;

export const Students = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string;
    name: string;
    grade: number | null;
    behavior: string | null;
  } | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading, refetch } = useStudentsList(
    searchParams.get("page") || "1",
    searchParams.get("pageSize") || "10"
  );
  const { mutate: evaluateStudent, isPending } = useEvaluateStudent(
    selectedStudent?.id || ""
  );

  const handleEvaluate = (student: any) => {
    setSelectedStudent({
      id: student.id,
      name: student.name,
      grade: student.grade,
      behavior: student.behavior,
    });
    form.setFieldsValue({
      grade: student.grade?.toString() || undefined,
      behavior: student.behavior || undefined,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (values: { grade: string; behavior?: string }) => {
    if (!selectedStudent) return;

    const payload: { grade: number; behavior?: string } = {
      grade: Number(values.grade),
    };

    if (values.behavior && values.behavior.trim()) {
      payload.behavior = values.behavior.trim();
    }

    evaluateStudent(
      payload,
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setSelectedStudent(null);
          form.resetFields();
          refetch();
        },
      }
    );
  };

  const columns = [
    {
      title: "№",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "Ism",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Guruh",
      dataIndex: ["group", "name"],
      key: "group",
    },
    {
      title: "Baho",
      dataIndex: "grade",
      key: "grade",
      render: (grade: number | null) => {
        if (grade === null) {
          return <Tag color="default">Baholanmagan</Tag>;
        }
        const color =
          grade === 5 ? "green" : grade === 4 ? "blue" : grade === 3 ? "orange" : "red";
        return <Tag color={color}>{grade}</Tag>;
      },
    },
    {
      title: "Izoh",
      dataIndex: "behavior",
      key: "behavior",
      render: (behavior: string | null) => behavior || "—",
    },
    {
      title: "Holat",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"}>{isActive ? "Faol" : "Nofaol"}</Tag>
      ),
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_: any, record: any) => (
        <Button
          type="default"
          icon={<EditOutlined />}
          onClick={() => handleEvaluate(record)}
          style={{ borderColor: "#d9d9d9", color: "#000" }}
        >
          Baho qo'yish
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <Title level={3} style={{ marginBottom: 20 }}>
        O'quvchilar
      </Title>

      <Table
        columns={columns}
        dataSource={data?.data || []}
        rowKey="id"
        pagination={{
          current: data?.currentPage || 1,
          total: data?.totalElements || 0,
          pageSize: data?.pageSize || 10,
          onChange: (page, pageSize) => {
            setSearchParams({ page: `${page}`, pageSize: `${pageSize}` });
          },
        }}
      />

      <Modal
        title={`${selectedStudent?.name} uchun baho qo'yish`}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            grade: selectedStudent?.grade?.toString() || undefined,
            behavior: selectedStudent?.behavior || undefined,
          }}
        >
          <Form.Item
            name="grade"
            label="Baho"
            rules={[
              { required: true, message: "Bahoni kiriting" },
              {
                validator: (_, value) => {
                  if (value && (Number(value) < 1 || Number(value) > 5)) {
                    return Promise.reject("Baho 1 dan 5 gacha bo'lishi kerak");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Select placeholder="Bahoni tanlang" size="large">
              <Select.Option value="5">5 - A'lo</Select.Option>
              <Select.Option value="4">4 - Yaxshi</Select.Option>
              <Select.Option value="3">3 - Qoniqarli</Select.Option>
              <Select.Option value="2">2 - Qoniqarsiz</Select.Option>
              <Select.Option value="1">1 - Yomon</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="behavior" label="Izoh">
            <TextArea
              rows={4}
              placeholder="O'quvchi haqida izoh yozing..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={isPending}
                style={{ backgroundColor: "#000", borderColor: "#000", color: "#fff" }}
              >
                Saqlash
              </Button>
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedStudent(null);
                  form.resetFields();
                }}
              >
                Bekor qilish
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
