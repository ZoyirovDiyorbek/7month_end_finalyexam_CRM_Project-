import { Spinner } from "@/components/ui/spinner";
import { useTeacherDetail } from "../service/query/useTeacherDetail";
import { TeacherForm } from "./teacher-form";

export const TeacherFormWrapper = ({
  id,
  closeEditModal,
}: {
  id: string;
  closeEditModal: () => void;
}) => {
  const { data, isLoading } = useTeacherDetail(id);

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <TeacherForm
          closeModal={closeEditModal}
          teacherId={id}
          defaultValueData={data}
        />
      )}
    </div>
  );
};
