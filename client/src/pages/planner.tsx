import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskForm from "@/components/planner/task-form";
import Timetable from "@/components/planner/timetable";

export default function Planner() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Study Planner</h1>
        <p className="text-muted-foreground">Organize tasks, schedule study time, and track revision topics</p>
      </div>

      <Tabs defaultValue="todo" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3" data-testid="tabs-planner">
          <TabsTrigger value="todo" data-testid="tab-todo">To-Do</TabsTrigger>
          <TabsTrigger value="timetable" data-testid="tab-timetable">Timetable</TabsTrigger>
          <TabsTrigger value="revision" data-testid="tab-revision">Revision</TabsTrigger>
        </TabsList>

        <TabsContent value="todo">
          <TaskForm />
        </TabsContent>

        <TabsContent value="timetable">
          <Timetable />
        </TabsContent>

        <TabsContent value="revision">
          <div className="text-center py-12">
            <h3 className="text-xl font-bold mb-2">Revision Planner</h3>
            <p className="text-muted-foreground">Coming soon - Advanced spaced repetition scheduling</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
