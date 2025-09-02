import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import TaskGate from "@/pages/task-gate";
import Flashcards from "@/pages/flashcards";
import QA from "@/pages/qa";
import Planner from "@/pages/planner";
import Rewards from "@/pages/rewards";
import Settings from "@/pages/settings";
import Sidebar from "@/components/layout/sidebar";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <Component />
      </main>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={() => <ProtectedRoute component={Home} />} />
          <Route path="/task-gate" component={() => <ProtectedRoute component={TaskGate} />} />
          <Route path="/flashcards" component={() => <ProtectedRoute component={Flashcards} />} />
          <Route path="/qa" component={() => <ProtectedRoute component={QA} />} />
          <Route path="/planner" component={() => <ProtectedRoute component={Planner} />} />
          <Route path="/rewards" component={() => <ProtectedRoute component={Rewards} />} />
          <Route path="/settings" component={() => <ProtectedRoute component={Settings} />} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
