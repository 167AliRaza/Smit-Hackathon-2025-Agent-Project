"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StudentStatistics } from "@/lib/api"; // Assuming StudentStatistics is exported from api.ts

interface StudentStatisticsCardProps {
  data: StudentStatistics;
}

export function StudentStatisticsCard({ data }: StudentStatisticsCardProps) {
  const { summary, department_statistics, recent_students } = data;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Badge className="bg-blue-500 hover:bg-blue-600">Summary</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.total_students}</div>
          <p className="text-xs text-muted-foreground">
            Overall count of students in the campus.
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Students by Department</CardTitle>
          <Badge className="bg-green-500 hover:bg-green-600">Departments</Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {Object.entries(department_statistics.students_by_department).map(([department, count]) => (
              <div key={department} className="flex items-center justify-between">
                <span className="text-sm font-medium">{department}</span>
                <span className="text-sm text-muted-foreground">{count} students</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recent Students</CardTitle>
          <Badge className="bg-purple-500 hover:bg-purple-600">New Admissions</Badge>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Onboarded At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent_students.recent_students.map((student) => (
                <TableRow key={student.student_id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.student_id}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{new Date(student.onboarded_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}