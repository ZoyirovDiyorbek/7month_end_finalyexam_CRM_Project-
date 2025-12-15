import { useProfile } from "../service/query/useProfile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

export const Profile = () => {
  const {
    data: teacherData,
    isLoading,
    isError,
    error,
    refetch,
  } = useProfile();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center space-y-4">
                  <Skeleton className="h-32 w-32 rounded-full" />
                  <div className="text-center space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-10 w-full" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
            {error?.message || "Profil ma'lumotlarini yuklashda xatolik"}
            <div className="mt-4">
              <Button onClick={() => refetch()} variant="outline">
                Qayta yuklash
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Profil ma'lumotlari topilmadi</CardTitle>
            <CardDescription>
              Profil ma'lumotlarini yuklashda muammo yuz berdi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()}>Qayta urinish</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const teacher = teacherData.data;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Profil</h1>
        <p className="text-muted-foreground">
          Shaxsiy ma'lumotlaringizni ko'ring va tahrirlang
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage
                    src={
                      teacher.url
                        ? `http://localhost:3000/${teacher.url}`
                        : undefined
                    }
                    alt={teacher.name}
                  />
                  <AvatarFallback className="text-4xl">
                    {teacher.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{teacher.name}</CardTitle>
                <CardDescription className="mt-1">
                  @{teacher.username}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    ID:
                  </span>
                  <span className="text-sm font-mono text-muted-foreground">
                    {teacher.id.substring(0, 8)}...
                  </span>
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Holati:
                  </span>
                  <Badge variant={teacher.isActive ? "default" : "destructive"}>
                    {teacher.isActive ? "Faol" : "Nofaol"}
                  </Badge>
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Rol:
                  </span>
                  <span className="text-sm font-medium">
                    {teacher.role === "TEACHER" ? "O'qituvchi" : teacher.role}
                  </span>
                </div>
                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Qo'shilgan sana:
                  </span>
                  <span className="text-sm">
                    {new Date(teacher.createdAt).toLocaleDateString("uz-UZ")}
                  </span>
                </div>
              </div>

              {teacher.specifications.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">
                      MAXORATLAR
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.specifications.map((spec) => (
                        <Badge
                          key={spec.id}
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          {spec.name}
                          {spec.category && (
                            <span className="text-xs text-muted-foreground ml-1">
                              ({spec.category})
                            </span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profil ma'lumotlari</TabsTrigger>
              <TabsTrigger value="edit">Tahrirlash</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shaxsiy ma'lumotlar</CardTitle>
                  <CardDescription>
                    Profilingizning asosiy ma'lumotlari
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name-view">To'liq ism</Label>
                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      {teacher.name}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username-view">Username</Label>
                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      @{teacher.username}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Holati</Label>
                    <div className="flex items-center">
                      <Badge
                        variant={teacher.isActive ? "default" : "destructive"}
                      >
                        {teacher.isActive ? "Faol" : "Nofaol"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profilni tahrirlash</CardTitle>
                  <CardDescription>
                    Profilingiz ma'lumotlarini yangilang
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ism Familya</Label>
                    <Input
                      id="name"
                      defaultValue={teacher.name}
                      placeholder="Ismingizni kiriting"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      defaultValue={teacher.username}
                      placeholder="Username"
                    />
                  </div>

                  <Separator className="my-4" />
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">
                      Parolni o'zgartirish
                    </h4>
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Joriy parol</Label>
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="Joriy parolingizni kiriting"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Yangi parol</Label>
                      <Input
                        id="new-password"
                        type="password"
                        placeholder="Yangi parol kiriting"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Yangi parolni tasdiqlash
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Yangi parolni qayta kiriting"
                      />
                    </div>
                  </div>

                  <Separator className="my-4" />
                  <div className="flex justify-end">
                    <Alert className="mb-4 border-blue-200 bg-blue-50 text-blue-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Profilni yangilash funksiyasi tez orada qo'shiladi
                      </AlertDescription>
                    </Alert>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Bekor qilish</Button>
                    <Button disabled className="cursor-not-allowed">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Tez orada...
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
