import { useState } from "react";
import { useStudentList } from "../service/query/useStudentList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Search, Users, UserCheck, Building } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [groupFilter, setGroupFilter] = useState<string>("all");

  const {
    data: studentsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useStudentList();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Xatolik yuz berdi</AlertTitle>
          <AlertDescription>
            {error?.message || "Talabalar ma'lumotlarini yuklashda xatolik"}
          </AlertDescription>
          <div className="mt-4">
            <Button onClick={() => refetch()}>Qayta yuklash</Button>
          </div>
        </Alert>
      </div>
    );
  }

  const students = studentsData?.data || [];

  const groupIds = Array.from(
    new Set(students.map((student) => student.groupId))
  );

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGroup =
      groupFilter === "all" || student.groupId === groupFilter;

    return matchesSearch && matchesGroup;
  });

  const activeStudents = students.filter(
    (s) => s.isActive && !s.isDeleted
  ).length;
  const totalStudents = students.length;

  const groupStudents: Record<string, (typeof students)[number][]> = {};
  students.forEach((student) => {
    if (!groupStudents[student.groupId]) {
      groupStudents[student.groupId] = [];
    }
    groupStudents[student.groupId].push(student);
  });

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Mening Talabalarim
        </h1>
        <p className="text-muted-foreground">
          Barcha guruhlardagi talabalar ro'yxati
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{totalStudents}</CardTitle>
                <CardDescription>Jami talabalar</CardDescription>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{activeStudents}</CardTitle>
                <CardDescription>Faol talabalar</CardDescription>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{groupIds.length}</CardTitle>
                <CardDescription>Guruhlar soni</CardDescription>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="search">Talaba qidirish</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Ism, familya yoki email bo'yicha qidirish..."
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="group-filter">Guruh bo'yicha filtrlash</Label>
              <Select value={groupFilter} onValueChange={setGroupFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Barcha guruhlar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Barcha guruhlar</SelectItem>
                  {groupIds.map((groupId) => (
                    <SelectItem key={groupId} value={groupId}>
                      Guruh: {groupId.substring(0, 8)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Talabalar ro'yxati</CardTitle>
              <CardDescription>
                {filteredStudents.length} ta talaba topildi
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-normal">
              Jami: {totalStudents} ta
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStudents.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px]">#</TableHead>
                    <TableHead>Talaba</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Guruh</TableHead>
                    <TableHead>Baho</TableHead>
                    <TableHead className="text-right">Holati</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={
                                student.url
                                  ? `http://localhost:3000/${student.url}`
                                  : undefined
                              }
                              alt={student.name}
                            />
                            <AvatarFallback>
                              {student.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-xs text-muted-foreground">
                              ID: {student.id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm truncate max-w-[200px]">
                          {student.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal">
                          {student.groupId.substring(0, 8)}...
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {student.grade !== null ? (
                          <Badge
                            className={
                              student.grade === 5
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : student.grade === 4
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : student.grade === 3
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {student.grade}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Baholanmagan
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            student.isActive && !student.isDeleted
                              ? "default"
                              : "destructive"
                          }
                        >
                          {student.isActive && !student.isDeleted
                            ? "Faol"
                            : "Nofaol"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Talabalar topilmadi</AlertTitle>
                <AlertDescription>
                  {searchTerm
                    ? "Qidiruv bo'yicha talabalar topilmadi"
                    : "Hozircha talabalar mavjud emas"}
                </AlertDescription>
              </Alert>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm("")}
                  className="mt-4"
                >
                  Barchasini ko'rish
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {Object.keys(groupStudents).length > 0 && (
        <>
          <Separator className="my-8" />
          <Card>
            <CardHeader>
              <CardTitle>Guruhlar bo'yicha taqsimlash</CardTitle>
              <CardDescription>
                Talabalar soni guruhlar bo'yicha
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(groupStudents).map(
                  ([groupId, groupStudentsList]) => (
                    <Card key={groupId}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm font-medium">
                            Guruh: {groupId.substring(0, 8)}...
                          </CardTitle>
                          <Badge variant="secondary" className="font-normal">
                            {groupStudentsList.length} ta
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {groupStudentsList.slice(0, 3).map((student) => (
                            <div
                              key={student.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {student.name.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="truncate max-w-[120px]">
                                  {student.name}
                                </span>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  "text-sm " +
                                  (student.grade === 5
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : student.grade === 4
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                    : student.grade === 3
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-100")
                                }
                              >
                                {student.grade || "-"}
                              </Badge>
                            </div>
                          ))}
                          {groupStudentsList.length > 3 && (
                            <div className="pt-2 border-t">
                              <span className="text-xs text-muted-foreground">
                                +{groupStudentsList.length - 3} boshqa talaba
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Umumiy statistika</CardTitle>
          <CardDescription>Talabalar haqida umumiy ma'lumotlar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">O'rtacha baho</div>
              <div className="text-2xl font-bold">
                {(() => {
                  const grades = students
                    .filter((s) => s.grade != null)
                    .map((s) => Number(s.grade));
                  return grades.length > 0
                    ? (
                        grades.reduce((a, b) => a + b, 0) / grades.length
                      ).toFixed(1)
                    : "-";
                })()}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Baholanganlar</div>
              <div className="text-2xl font-bold text-green-600">
                {students.filter((s) => s.grade).length}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                Baholanmaganlar
              </div>
              <div className="text-2xl font-bold text-yellow-600">
                {students.filter((s) => !s.grade).length}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Faollik foizi</div>
              <div className="text-2xl font-bold">
                {totalStudents > 0
                  ? Math.round((activeStudents / totalStudents) * 100)
                  : 0}
                %
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
