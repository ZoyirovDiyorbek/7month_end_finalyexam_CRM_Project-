import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PasswordInput } from "@/components/ui/password-input";
import { useLogin } from "./service/useLogin";
import { Spinner } from "@/components/ui/spinner";
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

// Backenddagi Role enumiga mos
const Role = {
  ADMIN: "Admin",
  TEACHER: "Teacher",
} as const;

const formSchema = z.object({
  username: z.string().min(1, "Username kiriting"),
  password: z.string().min(1, "Parol kiriting"),
  role: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const Login = () => {
  const { mutate, isPending } = useLogin();
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "john1234",
      password: "strongPassword123",
      role: "Teacher",
    },
  });

  const onSubmit = (data: FormValues) => {
    const requestData = {
      username: data.username.trim(),
      password: data.password,
      role: data.role,
    };

    console.log(requestData);

    mutate(requestData, {
      onSuccess: (res) => {
        Cookie.set("token", res.data.token);

        // SUPER_ADMIN ni admin ga o'zgartiramiz
        let userRole = res.data.user.role.toLowerCase();
        if (userRole === "super_admin") {
          userRole = "admin";
        }

        Cookie.set("role", userRole);
        toast.success(res.message?.uz || "Muvaffaqiyatli kirish", {
          position: "bottom-right",
        });

        navigate(`/app/${userRole}`);
      },
      onError: (error: any) => {
        console.error("Login xatosi:", error.response?.data);

        const errorData = error.response?.data;
        const errorMessage = errorData?.message;

        if (Array.isArray(errorMessage)) {
          toast.error("Validation xatosi", {
            description: errorMessage.join(", "),
            position: "bottom-right",
          });
        } else if (typeof errorMessage === "string") {
          toast.error("Kirishda xatolik", {
            description: errorMessage,
            position: "bottom-right",
          });
        } else if (errorData?.error) {
          toast.error(errorData.error, {
            description: errorData.message || "Tafsilotlar mavjud emas",
            position: "bottom-right",
          });
        } else {
          toast.error("Kirishda xatolik", {
            description: error?.message || "Noma'lum xatolik yuz berdi",
            position: "bottom-right",
          });
        }
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Button
        className="absolute right-5 top-5 cursor-pointer bg-gray-900 hover:bg-gray-800 text-white"
        onClick={() => navigate("/signup")}
      >
        Ro'yxatdan o'tish
      </Button>

      <div className="w-full max-w-md bg-white shadow-sm border border-gray-200 rounded-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gray-100 rounded-xl">
              <LogIn className="w-8 h-8 text-gray-700" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Kirish</h1>
          <p className="text-gray-600">
            Hisobingizga kirish uchun ma'lumotlarni kiriting
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Role</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full h-11">
                        <SelectValue placeholder="Rol tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                        <SelectItem value={Role.TEACHER}>O'qituvchi</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Username</FormLabel>
                  <FormControl>
                    <Input
                      className="h-11"
                      placeholder="john1234"
                      {...field}
                      value={field.value || "john1234"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      className="h-11"
                      placeholder="strongPassword123"
                      {...field}
                      value={field.value || "strongPassword123"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Spinner className="w-4 h-4" />
                  Kirish...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Kirish
                </span>
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
