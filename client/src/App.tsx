import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { AnimatePresence } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { StoreProvider } from "./contexts/StoreContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Menus from "./pages/Menus";
import Templates from "./pages/Templates";
import Complaints from "./pages/Complaints";
import DashboardLayout from "./components/DashboardLayout";
import ClassicMenu from "./pages/menu-templates/ClassicMenu";
// import ModernGrid from "./pages/menu-templates/ModernGrid";
// import Minimalist from "./pages/menu-templates/Minimalist";

function Router() {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait">
    <Switch location={location}>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </Route>
      <Route path="/menus">
        <DashboardLayout>
          <Menus />
        </DashboardLayout>
      </Route>
      <Route path="/templates">
        <DashboardLayout>
          <Templates />
        </DashboardLayout>
      </Route>
      <Route path="/complaints">
        <DashboardLayout>
          <Complaints />
        </DashboardLayout>
      </Route>
      <Route path="/menu/classic" component={ClassicMenu} />
      {/* <Route path="/menu/modern" component={ModernGrid} /> */}
      {/* <Route path="/menu/minimalist" component={Minimalist} /> */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <ThemeProvider defaultTheme="light" switchable>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </StoreProvider>
    </ErrorBoundary>
  );
}

export default App;

