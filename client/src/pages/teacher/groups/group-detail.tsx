import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGroupStudents } from "../service/query/useGroupStudent";
import { useCreateGrade } from "../service/mutation/useCreateGrade";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  ArrowLeft,
  Search,
  User,
  Clock,
  Calendar,
  Users,
  Award,
  FileText,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<{
    id?: string;
    name: string;
  } | null>(null);
  const [behavior, setBehavior] = useState("");
  const [grade, setGrade] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: groupData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGroupStudents(id);

  const { mutate: evaluateStudent, isPending: isEvaluating } = useCreateGrade();

  const filteredStudents =
    groupData?.students?.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleGradeSubmit = () => {
    if (!selectedStudent) {
      alert("Talaba tanlanmagan!");
      return;
    }
    if (!selectedStudent.id) {
      alert("Talaba ID si bo'sh! Iltimos, qayta tanlang.");
      return;
    }
    if (!grade.trim()) {
      alert("Iltimos, bahoni kiriting");
      return;
    }

    evaluateStudent(
      {
        studentId: selectedStudent.id,
        grade: grade,
        behavior: behavior || undefined,
      },
      {
        onSuccess: () => {
          alert("Baho muvaffaqiyatli saqlandi!");
          refetch();
          setSelectedStudent(null);
          setGrade("");
          setBehavior("");
          setIsDialogOpen(false);
        },
        onError: (error: any) => {
          console.error("Baho saqlash xatosi:", error);
          alert(
            error.response?.data?.message?.uz ||
              "Baho saqlashda xatolik yuz berdi"
          );
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="mb-6">
          <Skeleton className="h-10 w-full max-w-md" />
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
            {error?.message || "Guruh ma'lumotlarini yuklashda xatolik"}
          </AlertDescription>
          <div className="mt-4">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Orqaga qaytish
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (!groupData) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Guruh topilmadi</CardTitle>
            <CardDescription>
              Ushbu ID ga ega guruh mavjud emas yoki o'chirilgan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Orqaga qaytish
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const gradedStudents = groupData.students.filter((s) => s.grade).length;
  const ungradedStudents = groupData.students.length - gradedStudents;
  const averageGrade =
    gradedStudents > 0
      ? (
          groupData.students
            .filter((s) => s.grade)
            .reduce((sum, s) => sum + parseFloat(s.grade || "0"), 0) /
          gradedStudents
        ).toFixed(1)
      : "0.0";

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Orqaga
        </Button>

        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                {groupData.name}
              </h1>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>
                    {groupData.startTime} - {groupData.endTime}
                  </span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  <span>O'qituvchi: {groupData.teacher.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {groupData.students.length}
                </CardTitle>
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
                <CardTitle className="text-2xl text-green-600">
                  {gradedStudents}
                </CardTitle>
                <CardDescription>Baholanganlar</CardDescription>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-yellow-600">
                  {ungradedStudents}
                </CardTitle>
                <CardDescription>Baholanmaganlar</CardDescription>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{averageGrade}</CardTitle>
                <CardDescription>O'rtacha baho</CardDescription>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Talaba ismi bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredStudents.length} ta talaba topildi
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Talabalar ro'yxati</CardTitle>
          <CardDescription>
            Guruh talabalari va ularning baholari
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredStudents.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Talaba Ismi</TableHead>
                    <TableHead>Baho</TableHead>
                    <TableHead>Xulq-atvor</TableHead>
                    <TableHead className="text-right">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              {student.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{student.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={student.grade ? "default" : "outline"}
                          className={
                            student.grade
                              ? student.grade === "5"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : student.grade === "4"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                : student.grade === "3"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                              : ""
                          }
                        >
                          {student.grade || "Baholanmagan"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">
                          {student.behavior || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog
                          open={
                            isDialogOpen && selectedStudent?.id === student.id
                          }
                          onOpenChange={(open) => {
                            if (!open) {
                              setSelectedStudent(null);
                              setGrade("");
                              setBehavior("");
                            }
                            setIsDialogOpen(open);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedStudent({
                                  id: student.id,
                                  name: student.name,
                                });
                                setIsDialogOpen(true);
                              }}
                              disabled={isEvaluating}
                            >
                              Baho qo'yish
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>
                                {student.name} uchun baho qo'yish
                              </DialogTitle>
                              <DialogDescription>
                                Talaba uchun baho va sharh qoldiring
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="grade">Baho *</Label>
                                <Select value={grade} onValueChange={setGrade}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Bahoni tanlang" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="5">5 (A'lo)</SelectItem>
                                    <SelectItem value="4">
                                      4 (Yaxshi)
                                    </SelectItem>
                                    <SelectItem value="3">
                                      3 (Qoniqarli)
                                    </SelectItem>
                                    <SelectItem value="2">
                                      2 (Qoniqarsiz)
                                    </SelectItem>
                                    <SelectItem value="1">
                                      1 (Juda yomon)
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="behavior">
                                  Xulq-atvor (ixtiyoriy)
                                </Label>
                                <Textarea
                                  id="behavior"
                                  value={behavior}
                                  onChange={(e) => setBehavior(e.target.value)}
                                  placeholder="Xulq-atvor haqida izoh..."
                                  rows={3}
                                />
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setSelectedStudent(null);
                                  setGrade("");
                                  setBehavior("");
                                  setIsDialogOpen(false);
                                }}
                                disabled={isEvaluating}
                              >
                                Bekor qilish
                              </Button>
                              <Button
                                onClick={handleGradeSubmit}
                                disabled={isEvaluating || !grade}
                                className="min-w-[120px]"
                              >
                                {isEvaluating ? "Saqlanmoqda..." : "Saqlash"}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
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
                <AlertTitle>
                  {searchTerm ? "Talaba topilmadi" : "Talabalar mavjud emas"}
                </AlertTitle>
                <AlertDescription>
                  {searchTerm
                    ? "Boshqa qidiruv kalit so'zini kiriting"
                    : "Ushbu guruhda hozircha talabalar yo'q"}
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

      <Card>
        <CardHeader>
          <CardTitle>Guruh ma'lumotlari</CardTitle>
          <CardDescription>Guruhning to'liq ma'lumotlari</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Asosiy ma'lumotlar</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Guruh nomi
                    </span>
                    <span className="font-medium">{groupData.name}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Dars vaqti
                    </span>
                    <span className="font-medium">
                      {groupData.startTime} - {groupData.endTime}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Davomiyligi
                    </span>
                    <span className="font-medium">
                      {groupData.durationInMonths} oy
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">O'qituvchi</h3>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar>
                    <AvatarFallback>
                      {groupData.teacher.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{groupData.teacher.name}</div>
                    <div className="text-sm text-muted-foreground">
                      O'qituvchi
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Statistika</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Baholanganlar foizi
                    </span>
                    <span className="font-medium">
                      {groupData.students.length > 0
                        ? Math.round(
                            (gradedStudents / groupData.students.length) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">
                  Baholash statistikasi
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {["5", "4", "3", "2", "1"].map((gradeNum) => {
                    const count = groupData.students.filter(
                      (s) => s.grade === gradeNum
                    ).length;
                    return (
                      <div
                        key={gradeNum}
                        className="flex items-center justify-between p-2 bg-muted/30 rounded"
                      >
                        <span className="text-sm">{gradeNum} ball</span>
                        <Badge variant="secondary">{count} ta</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
