import React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { TeacherTable } from "../../admin/components/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeacherGroups } from "../service/query/useGroupList";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface GroupRow {
  count: number;
  id: string;
  name: string;
  lessonTime: string;
  durationInMonths: number;
  studentsCount: number | string;
  isActive: "Faol" | "Faol emas";
  startTime?: string;
  endTime?: string;
}

export const Groups = () => {
  const { data, isLoading, isFetching, error } = useTeacherGroups();
  const navigate = useNavigate();

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Xato yuz berdi: {(error as Error).message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const groups: GroupRow[] = React.useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) return [];

    return data.data.map((item: any, index: number) => ({
      id: item.id,
      count: index + 1,
      name: item.name,
      lessonTime: item.lessonTime || `${item.startTime} - ${item.endTime}`,
      durationInMonths: item.durationInMonths,
      studentsCount: item.studentsCount ?? "-",
      isActive: item.isActive ? "Faol" : "Faol emas",
      startTime: item.startTime,
      endTime: item.endTime,
    }));
  }, [data]);

  const columns: ColumnDef<GroupRow>[] = [
    {
      accessorKey: "count",
      header: "№",
      size: 60,
    },
    {
      accessorKey: "name",
      header: "Guruh nomi",
      size: 200,
      cell: ({ row }) => (
        <div className="font-medium text-foreground">{row.original.name}</div>
      ),
    },
    {
      accessorKey: "lessonTime",
      header: "Dars vaqti",
      size: 150,
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.original.lessonTime}</div>
      ),
    },
    {
      accessorKey: "durationInMonths",
      header: "Davomiyligi",
      size: 120,
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal">
          {row.original.durationInMonths} oy
        </Badge>
      ),
    },
    {
      accessorKey: "studentsCount",
      header: "Talabalar soni",
      size: 120,
      cell: ({ row }) => (
        <div className="font-medium">{row.original.studentsCount}</div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Holati",
      size: 100,
      cell: ({ row }) => (
        <Badge
          variant={row.original.isActive === "Faol" ? "default" : "destructive"}
          className="font-normal"
        >
          {row.original.isActive}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Amallar",
      size: 100,
      cell: ({ row }) => {
        const group = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menyu ochish</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigate(`/app/teacher/group/${group.id}`)}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                Batafsil ko'rish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Mening guruhlarim</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Guruhlar ro'yxati</CardTitle>
          <CardDescription>{groups.length} ta guruh mavjud</CardDescription>
        </CardHeader>
        <CardContent>
          {groups.length === 0 ? (
            <div className="text-center py-16">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Hozircha sizda guruhlar yo'q
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            <>
              <TeacherTable columns={columns} data={groups} />

              {isFetching && (
                <div className="mt-4 flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <span className="text-sm text-muted-foreground">
                      Yangilanmoqda...
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
