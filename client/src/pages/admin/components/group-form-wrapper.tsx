import { GroupForm } from "./group-form";
import { useGroupDetail } from "../service/query/useGroupDetail";
import { Spinner } from "@/components/ui/spinner";

interface GroupFormWrapperProps {
  id: string;
  closeEditModal: () => void;
}

export const GroupFormWrapper = ({ id, closeEditModal }: GroupFormWrapperProps) => {
  const { data, isLoading } = useGroupDetail(id);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <GroupForm
      closeModal={closeEditModal}
      defaultValueData={data}
      groupId={id}
    />
  );
};

