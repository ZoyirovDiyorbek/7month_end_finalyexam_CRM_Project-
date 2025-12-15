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
import { Spinner } from "@/components/ui/spinner";
import { useCreateTeacher } from "../service/mutation/useCreateTeacher";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useEditTeacher } from "../service/mutation/useEditTeacher";
import { useSpecification } from "../service/query/useSpecification";
import type { TeacherDetailT } from "../type";

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().optional(),
  specification: z.string().min(2).max(50),
  name: z.string().min(2).max(50),
});

interface FormProps {
  defaultValueData?: TeacherDetailT;
  closeModal?: () => void;
  teacherId?: string;
}

export const TeacherForm = ({
  closeModal,
  defaultValueData,
  teacherId,
}: FormProps) => {
  const { mutate, isPending } = useCreateTeacher();
  const { mutate: editMutate, isPending: editPending } = useEditTeacher(
    teacherId as string
  );

  const { data, isLoading } = useSpecification();

  const client = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: defaultValueData?.data?.username || "",
      specification: defaultValueData?.data?.specifications[0]?.id || "",
      name: defaultValueData?.data?.name || "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (defaultValueData) {
      return editMutate(
        {
          name: data.name,
          username: data.username,
          specification: [data.specification],
        },
        {
          onSuccess: (res) => {
            toast.success(res.message.uz, {
              position: "bottom-right",
            });

            client.invalidateQueries({ queryKey: ["teacher_list"] });

            if (closeModal) {
              closeModal();
            }
          },
          onError: () => {},
        }
      );
    }
    mutate(
      { ...data, specification: [data.specification] },
      {
        onSuccess: (res) => {
          toast.success(res.message.uz, {
            position: "bottom-right",
          });

          client.invalidateQueries({ queryKey: ["teacher_list"] });

          if (closeModal) {
            closeModal();
          }
        },
        onError: (error: any) => {
          form.setError("username", { message: error.response?.data?.message || "Error" });
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-[30px] space-y-[30px]"
      >
        <FormField
          control={form.control}
          name="specification"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Specification</FormLabel>
                <FormControl>
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <Select
                      key={field.value}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full text-black">
                        <SelectValue
                          className="text-black"
                          placeholder="Specification"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {data?.data.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!defaultValueData ? (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          ""
        )}

        <Button className="w-full" type="submit">
          {isPending || editPending ? <Spinner /> : ""}{" "}
          {defaultValueData ? "Change" : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
