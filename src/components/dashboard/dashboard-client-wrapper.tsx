"use client";

import React, { useState, useEffect } from "react";
import { getStudentStatistics, StudentStatistics } from "@/lib/api";
import { StudentStatisticsCard } from "@/components/dashboard/student-statistics-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface DashboardClientWrapperProps {
  initialData: StudentStatistics | null;
}

export function DashboardClientWrapper({ initialData }: DashboardClientWrapperProps) {
  const [studentStatistics, setStudentStatistics] = useState<StudentStatistics | null>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const data = await getStudentStatistics();
      setStudentStatistics(data);
      toast.success("Student statistics refreshed!");
    } catch (e) {
      console.error("Failed to fetch student statistics:", e);
      setError(true);
      toast.error("Failed to refresh student statistics.");
    } finally {
      setIsLoading(false);
    }
  };

  // If initialData is null (e.g., server-side fetch failed), try fetching on client mount
  useEffect(() => {
    if (!initialData) {
      fetchStats();
    }
  }, [initialData]);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <Button onClick={fetchStats} disabled={isLoading} variant="outline" size="sm">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      {error && !studentStatistics ? ( // Only show error card if no data is available
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">Failed to load student statistics. Please try again later.</p>
          </CardContent>
        </Card>
      ) : isLoading && !studentStatistics ? ( // Only show loading card if no data is available
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : studentStatistics ? (
        <StudentStatisticsCard data={studentStatistics} />
      ) : (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>No Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No student statistics available.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}