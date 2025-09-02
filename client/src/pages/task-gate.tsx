import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskGateModal from "@/components/common/task-gate-modal";
import { useState } from "react";

export default function TaskGate() {
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-lock text-secondary text-2xl"></i>
          </div>
          <CardTitle className="text-2xl">Daily Discipline Check</CardTitle>
          <p className="text-muted-foreground">Add your first task for today to unlock the app</p>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground mb-6">
            StudyHub helps you build consistent study habits. Start each day by committing to at least one learning task.
          </p>
          
          <TaskGateModal 
            open={showModal} 
            onClose={() => setShowModal(false)}
            onTaskCreated={() => window.location.href = '/'}
          />
        </CardContent>
      </Card>
    </div>
  );
}
