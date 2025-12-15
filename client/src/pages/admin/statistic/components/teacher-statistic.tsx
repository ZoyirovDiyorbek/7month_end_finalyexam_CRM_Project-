import { Pie, PieChart } from "recharts";

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTeacherStatistic } from "../../service/query/useTeacherStatistic";
import { Spinner } from "@/components/ui/spinner";

export function TeacherStatistic() {
  const { data, isLoading } = useTeacherStatistic();

  const chartConfig = {
    groups: {
      label: "Groups",
    },
  } as ChartConfig;

  const chartData2 = data?.data.map((item) => {
    chartConfig[item.objectName] = {
      label: item.teacherName,
      color: item.colorClass,
    };
    return {
      teacher: item.objectName,
      groups: item.groupCount,
      fill: `var(--color-${item.objectName})`,
    };
  });

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="groups" />} />
            <Pie className="border" data={chartData2} dataKey="groups" />

            <ChartLegend
              content={<ChartLegendContent nameKey="teacher" />}
              className="flex flex-wrap gap-[30px]"
            />
          </PieChart>
        </ChartContainer>
      )}
    </div>
  );
}
