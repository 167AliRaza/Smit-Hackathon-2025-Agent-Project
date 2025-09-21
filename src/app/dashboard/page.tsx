import { MadeWithDyad } from "@/components/made-with-dyad";
import { getStudentStatistics } from "@/lib/api";
import { StudentStatisticsCard } from "@/components/dashboard/student-statistics-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default async function DashboardPage() {
  let studentStatistics;
  let error = false;

  try {
    studentStatistics = await getStudentStatistics();
  } catch (e) {
    console.error("Failed to fetch student statistics:", e);
    error = true;
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
      {error ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">Failed to load student statistics. Please try again later.</p>
          </CardContent>
        </Card>
      ) : !studentStatistics ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : (
        <StudentStatisticsCard data={studentStatistics} />
      )}
      <div className="mt-auto"> {/* Pushes MadeWithDyad to the bottom */}
        <MadeWithDyad />
      </div>
    </div>
  );
}