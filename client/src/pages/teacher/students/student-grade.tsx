import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStudentDetail } from "../service/query/useStudentDetail";
import { useUpdateGrade } from "../service/mutation/useUpdateGrade";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";

const InfoItem = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: boolean;
}) => (
  <div>
    <p className="text-xs text-gray-500 mb-1">{label}</p>
    <p
      className={`font-medium ${highlight ? "text-indigo-600" : "text-gray-900"
        }`}
    >
      {value}
    </p>
  </div>
);

export const StudentGrade = () => {
  const { id: talabaId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: ma, isLoading: yuklanmoqda, isError: xatolik } = useStudentDetail(talabaId!);
  const baholashMutatsiya = useUpdateGrade(talabaId!);

  const [baho, setBaho] = useState<string>("");
  const [xulq, setXulq] = useState<string>("");

  if (yuklanmoqda) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (xatolik || !ma) {
    return (
      <div className="p-6">
        <p className="text-red-500 mb-4">Ma'lumot topilmadi</p>
        <Button onClick={() => navigate("/app/teacher/students")}>
          Orqaga
        </Button>
      </div>
    );
  }

  const talaba = ma.data;

  const yuborishFunksiya = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!baho || !xulq) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }

    try {
      await baholashMutatsiya.mutateAsync({
        baho: Number(baho),
        xulq: String(xulq),
      });

      toast.success("Talaba baholandi");
      setBaho("");
      setXulq("");
    } catch (xatolik: any) {
      toast.error(
        xatolik?.response?.data?.message ||
        "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
      );
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/app/teacher/students")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Orqaga
        </Button>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Talaba baholash
        </h1>
        <p className="text-muted-foreground">
          Talaba ma'lumotlari va baholash
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Talaba ma'lumotlari</CardTitle>
            <CardDescription>
              Talaba haqida asosiy ma'lumotlar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={
                    talaba.url
                      ? `http://localhost:3000/${talaba.url}`
                      : undefined
                  }
                  alt={talaba.name}
                />
                <AvatarFallback className="text-2xl">
                  {talaba.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{talaba.name}</h3>
                <p className="text-sm text-muted-foreground">{talaba.email}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoItem label="Ism" value={talaba.name} />
              <InfoItem label="Email" value={talaba.email} />
              <InfoItem label="Guruh" value={talaba.group?.name || "—"} />

              <div>
                <p className="text-xs text-gray-500 mb-1">Holati</p>
                <Badge
                  variant={talaba.isActive ? "default" : "destructive"}
                  className="mt-1"
                >
                  {talaba.isActive ? "Faol" : "Nofaol"}
                </Badge>
              </div>

              <InfoItem
                label="Baho"
                value={talaba.grade ?? "—"}
                highlight
              />
              <InfoItem
                label="Xulq-atvor"
                value={talaba.behavior ?? "—"}
                highlight
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Talaba baholash</CardTitle>
            <CardDescription>
              Talabaga baho va xulq-atvor bahosini kiriting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={yuborishFunksiya} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="baho">Baho *</Label>
                  <Input
                    id="baho"
                    type="number"
                    min="1"
                    max="5"
                    placeholder="1 - 5"
                    value={baho}
                    onChange={(e) => setBaho(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="xulq">Xulq-atvor *</Label>
                  <Input
                    id="xulq"
                    placeholder="A'lo / Yaxshi / O'rtacha"
                    value={xulq}
                    onChange={(e) => setXulq(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={baholashMutatsiya.isPending}
                className="w-full sm:w-auto"
              >
                {baholashMutatsiya.isPending ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="w-4 h-4" />
                    Saqlanmoqda...
                  </span>
                ) : (
                  "Baholashni saqlash"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

