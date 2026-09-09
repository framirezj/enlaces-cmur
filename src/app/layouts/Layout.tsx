import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/AppSidebar";
import { TopInfoBar } from "@/components/TopInfoBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <AppSidebar />
        <main className="flex-1 p-6">
          <header className="flex h-12 items-center justify-between border-b border-border pb-4 mb-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
            </div>
            <TopInfoBar />
          </header>
          {children}
        </main>
      </TooltipProvider>
    </SidebarProvider>
  );
}
