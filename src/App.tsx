
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Index />} />
          {/* These routes will be implemented in future iterations */}
          <Route path="/orders" element={<NotFound />} />
          <Route path="/warehouse" element={<NotFound />} />
          <Route path="/customers" element={<NotFound />} />
          <Route path="/couriers" element={<NotFound />} />
          <Route path="/financial" element={<NotFound />} />
          <Route path="/reports" element={<NotFound />} />
          <Route path="/settings" element={<NotFound />} />
          <Route path="/support" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
