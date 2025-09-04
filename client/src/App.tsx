import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import Projects from "@/pages/projects";
import ProjectDetail from "@/pages/project-detail";
import Chat from "@/pages/chat";
import LoginPage from "@/pages/admin/login";
import DashboardPage from "@/pages/admin/dashboard";
import FloatingNav from "@/components/floating-nav";
import BottomTabBar from "@/components/bottom-tab-bar";

function Router() {
  return (
    <>
      <FloatingNav />
      <BottomTabBar />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/projects" component={Projects} />
        <Route path="/projects/:id" component={ProjectDetail} />
        <Route path="/chat" component={Chat} />
        <Route path="/admin/login" component={LoginPage} />
        <Route path="/admin/dashboard" component={DashboardPage} />
        <Route component={NotFound} />
      </Switch>
    </>
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
