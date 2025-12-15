import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { TeacherTable } from "../components/table";
import { Spinner } from "@/components/ui/spinner";
import { Button, Avatar, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useToggle } from "@/hooks/useToggle";
import { Link } from "react-router-dom";
import { useGroupsList } from "../service/query/useGroupsList";
import { GroupForm } from "../components/group-form";
import { GroupFormWrapper } from "../components/group-form-wrapper";

type Groups = {
  count: number;
  studentCount: number;
  name: string;
  id?: string;
  isActive: "Active" | "Blocked";
  startTime: string;
  endTime: string;
  teacherId?: string;
  durationInMonths: string;
  teacherName: string;
  teacherAvatarUrl: string;
};

export const Groups = () => {
  const { data, isLoading, refetch } = useGroupsList();
  const { close, isOpen, open } = useToggle();
  const { close: closeEdit, isOpen: isEditOpen, open: openEdit } = useToggle();
  const [editId, setEditId] = React.useState("");

  const columns: ColumnDef<Groups>[] = [
    {
      accessorKey: "count",
      header: "Count",
    },
    {
      accessorKey: "studentCount",
      header: "Student Count",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "startTime",
      header: "Start Time",
    },
    {
      accessorKey: "endTime",
      header: "End Time",
    },
    {
      accessorKey: "durationInMonths",
      header: "Duration In Months",
    },
    {
      accessorKey: "teacherName",
      header: "Teacher Name",
    },
    {
      accessorKey: "teacherAvatarUrl",
      header: "Teacher",
      cell: ({ row }) => {
        const group = row.original;
        const imageUrl = group.teacherAvatarUrl 
          ? (group.teacherAvatarUrl.startsWith('http') 
              ? group.teacherAvatarUrl 
              : `http://localhost:3000/${group.teacherAvatarUrl}`)
          : null;

        return (
          <>
            {group.teacherId ? (
              <Link to={`/app/admin/teacher/${group.teacherId}`}>
                <Avatar
                  size={32}
                  src={imageUrl || undefined}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: "#d9d9d9" }}
                  onError={() => {
                    return true;
                  }}
                />
              </Link>
            ) : (
              <span className="text-gray-400">—</span>
            )}
          </>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
    },
    {
      header: "Action",
      cell: ({ row }) => {
        const group = row.original;
        return (
          <Button
            type="default"
            onClick={() => {
              setEditId(group.id || "");
              openEdit();
            }}
            style={{ borderColor: "#d9d9d9", color: "#000" }}
          >
            Edit
          </Button>
        );
      },
    },
  ];

  const groups: Groups[] = React.useMemo(() => {
    if (!Array.isArray(data?.data)) return [];
    return data.data.map((item, index) => ({
      count: index + 1,
      id: item.id,
      studentCount: item.students.length,
      isActive: item.isActive ? "Active" : "Blocked",
      name: item.name,
      teacherName: item?.teacher?.name,
      teacherAvatarUrl: item?.teacher?.avatarUrl,
      teacherId: item?.teacher?.id,
      startTime: item?.startTime || "0",
      endTime: item?.endTime || "0",
      durationInMonths: `${item?.durationInMonths || "0"}`,
    }));
  }, [data]);

  const closeModal = () => {
    close();
  };

  const closeEditModal = () => {
    setEditId("");
    closeEdit();
    refetch();
  };

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <Modal
            title="Guruhni tahrirlash"
            open={isEditOpen}
            onCancel={closeEditModal}
            footer={null}
          >
            <GroupFormWrapper id={editId} closeEditModal={closeEditModal} />
          </Modal>

          <Modal
            title="Guruh yaratish"
            open={isOpen}
            onCancel={closeModal}
            footer={null}
          >
            <GroupForm closeModal={closeModal} />
          </Modal>

          <Button
            type="primary"
            onClick={open}
            className="mb-5"
            style={{ backgroundColor: "#000", borderColor: "#000", color: "#fff" }}
          >
            Create
          </Button>
          <TeacherTable columns={columns} data={groups} />
        </>
      )}
    </div>
  );
};
