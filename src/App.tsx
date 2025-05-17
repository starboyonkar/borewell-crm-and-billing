
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CustomerProvider } from "./context/CustomerContext";
import { InventoryProvider } from "./context/InventoryContext";
import { ThemeProvider } from "./components/ThemeProvider";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CustomerForm from "./pages/CustomerForm";
import Customers from "./pages/Customers";
import CustomerDetail from "./pages/CustomerDetail";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,  // Improve form performance
      staleTime: 30000,             // Reduce unnecessary refetches
      retry: 1                      // Limit retries
    },
  },
});

// Auth Guard Component for protecting routes
const AuthGuard = ({ allowedRoles, redirectPath = "/login" }: { allowedRoles?: string[], redirectPath?: string }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // Check user role against allowed roles if roles are specified
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider defaultTheme="light" storageKey="borewell-theme">
        <AuthProvider>
          <CustomerProvider>
            <InventoryProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/login" element={<Login />} />
                    
                    {/* Public routes */}
                    <Route index element={<Navigate to="/dashboard" />} />
                    
                    {/* Protected routes for all authenticated users */}
                    <Route element={<AuthGuard />}>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="/customers/:id" element={<CustomerDetail />} />
                      <Route path="/add-customer" element={<CustomerForm />} />
                    </Route>
                    
                    {/* Admin-only routes */}
                    <Route element={<AuthGuard allowedRoles={['admin']} />}>
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/settings" element={<Settings />} />
                    </Route>
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </InventoryProvider>
          </CustomerProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
