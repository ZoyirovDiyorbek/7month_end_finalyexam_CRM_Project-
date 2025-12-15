import React from "react";
import {
  useTeachersListPagination,
} from "../service/query/useTeachersList";
import type { ColumnDef } from "@tanstack/react-table";
import { TeacherTable } from "../components/table";
import { Spinner } from "@/components/ui/spinner";

import { Button, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useToggle } from "@/hooks/useToggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TeacherForm } from "../components/teacher-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TeacherFormWrapper } from "../components/teacher-form-wrapper";
import { Skeleton } from "@/components/ui/skeleton";

type Payment = {
  count: number;
  name: string;
  id?: string;
  specification: string;
  isActive: "Active" | "Blocked";
  groups: number;
  username: string;
  avatarUrl?: string;
};

export const Teachers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading, isFetching } = useTeachersListPagination(
    searchParams.get("page") || "1"
  );
  const { close, isOpen, open } = useToggle();
  const buttons = Array(data?.totalPages || 1).fill(null);

  const { close: close2, isOpen: isOpen2, open: open2 } = useToggle();
  const [editId, setEditID] = React.useState("");

  const navigate = useNavigate();

  const teachers: Payment[] = React.useMemo(() => {
    if (!Array.isArray(data?.data)) return [];
    return data.data.map((item, index) => ({
      groups: item.groups?.length || 0,
      id: item.id,
      count: index + 1,
      isActive: item.isActive ? "Active" : "Blocked",
      name: item.name,
      specification: item.specifications.map((item) => item.name).join(", "),
      username: item.username,
      avatarUrl: item.avatarUrl,
    }));
  }, [data]);

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "count",
      header: "Count",
    },
    {
      accessorKey: "avatarUrl",
      header: "Avatar",
      cell: ({ row }) => {
        const teacher = row.original;
        const imageUrl = teacher.avatarUrl 
          ? (teacher.avatarUrl.startsWith('http') 
              ? teacher.avatarUrl 
              : `http://localhost:3000/${teacher.avatarUrl}`)
          : null;

        return (
          <Avatar
            size={32}
            src={imageUrl || undefined}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#d9d9d9" }}
            onError={() => {
              return true;
            }}
          />
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "specification",
      header: "Specification",
    },
    {
      accessorKey: "username",
      header: "Username",
    },
    {
      accessorKey: "groups",
      header: "Groups",
    },
    {
      accessorKey: "isActive",
      header: "Status",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const teacher = row.original;

        const editTeacher = () => {
          if (teacher.id) {
            setEditID(teacher.id);
            open2();
          }
        };
        return (
          <>
            <Button.Group>
              <Button
                type="default"
                onClick={editTeacher}
                style={{ borderColor: "#d9d9d9" }}
              >
                Edit
              </Button>
              <Button
                type="default"
                onClick={() => navigate(`/app/admin/teacher/${teacher.id}`)}
                style={{ borderColor: "#d9d9d9" }}
              >
                View
              </Button>
            </Button.Group>
          </>
        );
      },
    },
  ];

  const closeEditModal = () => {
    setEditID("");
    close2();
  };

  return (
    <div>
      {isLoading || isFetching ? (
        <Spinner />
      ) : (
        <>
          <Dialog onOpenChange={closeEditModal} open={isOpen2}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Teacher Edit</DialogTitle>
                <DialogDescription>
                  <TeacherFormWrapper
                    closeEditModal={closeEditModal}
                    id={editId}
                  />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Dialog onOpenChange={close} open={isOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Teacher Create</DialogTitle>
                <DialogDescription>
                  <TeacherForm closeModal={close} />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <Button
            type="primary"
            onClick={open}
            className="mb-5"
            style={{ backgroundColor: "#000", borderColor: "#000", color: "#fff" }}
          >
            Create
          </Button>

          <TeacherTable columns={columns} data={teachers} />
          {isFetching || isLoading ? (
            <Skeleton className="h-[30px] w-[300px]" />
          ) : (
            <div className="flex justify-end gap-2 mt-5">
              {buttons.map((_, index) => (
                <Button
                  key={index}
                  type={index + 1 === data?.currentPage ? "primary" : "default"}
                  onClick={() => {
                    setSearchParams({ page: `${index + 1}` });
                  }}
                  style={
                    index + 1 === data?.currentPage
                      ? { backgroundColor: "#000", borderColor: "#000", color: "#fff" }
                      : { backgroundColor: "#fff", borderColor: "#d9d9d9", color: "#000" }
                  }
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
