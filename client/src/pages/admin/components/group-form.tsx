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

import { useQueryClient } from "@tanstack/react-query";
import { useTeachersList } from "../service/query/useTeachersList";
import { Spinner } from "@/components/ui/spinner";
import { useCreateGroup } from "../service/mutation/useCreateGroup";
import { useEditGroup } from "../service/mutation/useEditGroup";
import { useEffect } from "react";

const formSchema = z.object({
  startTime: z.string().min(2).max(50),
  endTime: z.string().min(2).max(50),
  durationInMonths: z.string(),
  teacherId: z.string(),
  name: z.string().min(2).max(50),
});

interface FormProps {
  closeModal: () => void;
  defaultValueData?: {
    data?: {
      name: string;
      startTime: string | null;
      endTime: string | null;
      durationInMonths: number | null;
      teacher?: {
        id: string;
      };
    };
  };
  groupId?: string;
}

export const GroupForm = ({ closeModal, defaultValueData, groupId }: FormProps) => {
  const client = useQueryClient();

  const { data, isLoading } = useTeachersList();
  const { mutate, isPending } = useCreateGroup();
  const { mutate: editMutate, isPending: editPending } = useEditGroup(groupId || "");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      startTime: "",
      endTime: "",
      durationInMonths: "",
      teacherId: "",
    },
  });

  useEffect(() => {
    if (defaultValueData?.data) {
      const group = defaultValueData.data;
      form.reset({
        name: group.name || "",
        startTime: group.startTime || "",
        endTime: group.endTime || "",
        durationInMonths: group.durationInMonths?.toString() || "",
        teacherId: group.teacher?.id || "",
      });
    }
  }, [defaultValueData, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (groupId && defaultValueData) {
      editMutate(
        {
          name: data.name,
          startTime: data.startTime,
          endTime: data.endTime,
          durationInMonths: Number(data.durationInMonths),
          teacherId: data.teacherId,
        },
        {
          onSuccess: () => {
            closeModal();
          },
        }
      );
    } else {
      mutate(
        { ...data, durationInMonths: Number(data.durationInMonths) },
        {
          onSuccess: () => {
            client.invalidateQueries({ queryKey: ["groups"] });
            closeModal();
          },
        }
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-[30px] space-y-[30px]"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="teacherId"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Teacher</FormLabel>
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
                        {data?.data?.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item?.name} {item.specifications[0]?.name}
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
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time</FormLabel>
              <FormControl>
                <Input type="time" placeholder="Time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <Input type="time" placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="durationInMonths"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input
                  min={1}
                  max={8}
                  type="number"
                  placeholder="1234"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={isPending || editPending}>
          {isPending || editPending ? <Spinner /> : ""} {groupId ? "O'zgartirish" : "Yaratish"}
        </Button>
      </form>
    </Form>
  );
};
