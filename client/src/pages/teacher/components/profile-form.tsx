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
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useEditTeacher } from "../service/mutation/useEditTeacher";

const profileSchema = z.object({
  name: z.string().min(2, "Ism kamida 2 ta belgi bo'lishi kerak"),
});

interface Props {
  teacherId: string;
  defaultValueData?: { data?: { name?: string } };
  closeModel: () => void;
}

export const TeacherProfileForm = ({
  teacherId: _oqituvchiId,
  defaultValueData: boshlangichMa,
  closeModel: yopish,
}: Props) => {
  const { mutate: yuborish, isPending: yuklanmoqda } = useEditTeacher();
  const sorovClient = useQueryClient();

  const forma = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: boshlangichMa?.data?.name || "",
    },
  });

  const yuborishFunksiya = (ma: z.infer<typeof profileSchema>) => {
    yuborish(
      {
        ism: ma.name,
      },
      {
        onSuccess: (javob) => {
          toast.success(javob.data?.message?.uz || "Profil yangilandi", {
            position: "bottom-right",
          });
          sorovClient.invalidateQueries({
            queryKey: ["teacher_profile"],
          });
          yopish();
        },
        onError: () => {
          toast.error("Xatolik yuz berdi");
        },
      }
    );
  };

  return (
    <Form {...forma}>
      <form
        onSubmit={forma.handleSubmit(yuborishFunksiya)}
        className="space-y-6 mt-6"
      >
        <FormField
          control={forma.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ism</FormLabel>
              <FormControl>
                <Input placeholder="Ismingiz" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={yuklanmoqda}>
          {yuklanmoqda ? <Spinner /> : "O'zgarishlarni saqlash"}
        </Button>
      </form>
    </Form>
  );
};

