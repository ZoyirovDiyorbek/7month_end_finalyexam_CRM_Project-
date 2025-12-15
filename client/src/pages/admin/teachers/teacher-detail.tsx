import { useNavigate, useParams } from "react-router-dom";
import { useTeacherDetail } from "../service/query/useTeacherDetail";
import { Spinner } from "@/components/ui/spinner";
import { UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeacherForm } from "../components/teacher-form";
import React from "react";
import { toast } from "sonner";
import { useUploadTeacherImage } from "../service/mutation/useUploadTeacherImage";
import { useQueryClient } from "@tanstack/react-query";

export const TeacherDetail = () => {
  const { id } = useParams();
  const client = useQueryClient();
  const { data, isLoading, isFetching } = useTeacherDetail(id as string);
  const { mutate, isPending } = useUploadTeacherImage(id as string);
  const navigate = useNavigate();

  const closeModal = () => {
    navigate(-1);
  };

  const uploadIMage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxSize = 5 * 1024 * 1024;
    if (e.target?.files) {
      if (maxSize < e.target?.files[0].size) {
        toast("File hajmi katta", {
          position: "bottom-right",
        });
      } else {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        mutate(formData, {
          onSuccess: () => {
            client.invalidateQueries({ queryKey: ["teacher", id] });
            toast("OK", {
              position: "bottom-right",
            });
          },
          onError: () => {},
        });
      }
    }
  };

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div>
          {data?.data.avatarUrl ? (
            <div>
              <div className="rounded-full ml-5 overflow-hidden flex items-center justify-center border h-[90px] w-[90px]">
                {isPending || isFetching ? (
                  <Spinner />
                ) : (
                  <img
                    className="w-full h-full object-cover"
                    src={data.data.avatarUrl}
                    alt="url"
                  />
                )}
              </div>
              <label
                className="cursor-pointer hover:text-amber-400"
                htmlFor="upload_image"
              >
                Change image
              </label>
              <input
                hidden
                accept="image/png, image/jpg, image/jpeg"
                id="upload_image"
                onChange={uploadIMage}
                type="file"
              />
            </div>
          ) : (
            <>
              <Button
                className="rounded-full border h-[90px] w-[90px]"
                variant={"ghost"}
              >
                <UserIcon className="size-16" />
              </Button>
              <label htmlFor="upload_image">Upload image</label>
              <input id="upload_image" type="file" />
            </>
          )}
          <TeacherForm
            closeModal={closeModal}
            teacherId={id}
            defaultValueData={data}
          />
        </div>
      )}
    </div>
  );
};
