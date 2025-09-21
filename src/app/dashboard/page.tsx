import { MadeWithDyad } from "@/components/made-with-dyad";
import { getStudentStatistics } from "@/lib/api";
import { DashboardClientWrapper } from "@/components/dashboard/dashboard-client-wrapper";

export default async function DashboardPage() {
  let studentStatistics = null;
  try {
    studentStatistics = await getStudentStatistics();
  } catch (e) {
    console.error("Failed to fetch initial student statistics on server:", e);
    // Error will be handled by DashboardClientWrapper if initialData is null
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <DashboardClientWrapper initialData={studentStatistics} />
      <div className="mt-auto"> {/* Pushes MadeWithDyad to the bottom */}
        <MadeWithDyad />
      </div>
    </div>
  );
}