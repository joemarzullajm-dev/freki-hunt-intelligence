import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { FrekiWordmark, FrekiMark } from "@/components/freki-logo";
import {
  LayoutDashboard,
  Map,
  Camera,
  Eye,
  Target,
  History,
  Sparkles,
  FileText,
  Settings,
  Trees,
  Brain,
  ChevronDown,
  Menu,
  X,
  Wind,
} from "lucide-react";
import { property, conditions } from "@/lib/freki-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/app/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/app/properties", label: "Properties", icon: Trees },
  { to: "/app/brain", label: "Property Brain", icon: Brain },
  { to: "/app/map", label: "Map", icon: Map },
  { to: "/app/cameras", label: "Cameras", icon: Camera },
  { to: "/app/observations", label: "Observations", icon: Eye },
  { to: "/app/evaluation", label: "Hunt Evaluation", icon: Target },
  { to: "/app/history", label: "Hunt History", icon: History },
  { to: "/app/ai", label: "Ask Freki", icon: Sparkles },
  { to: "/app/reports", label: "Reports", icon: FileText },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

const mobileNav = nav.slice(0, 5);

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5 text-sidebar-foreground">
          <Link to="/app/dashboard" className="flex items-center gap-2">
            <FrekiMark className="h-6 w-6 text-sidebar-foreground" />
            <span className="font-display text-lg font-semibold tracking-tight">Freki</span>
          </Link>
        </div>
        <PropertySwitcher />
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {nav.map((n) => {
            const active = pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <n.icon className="h-4 w-4 shrink-0" />
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3 text-xs text-sidebar-foreground/60">
          <div className="flex items-center gap-2">
            <Wind className="h-3.5 w-3.5" />
            <span>{conditions.wind.dir} {conditions.wind.speedMph} mph · {conditions.tempF}°F</span>
          </div>
          <div className="mt-1">Pressure {conditions.pressureInHg}" · {conditions.pressureTrend}</div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur lg:hidden">
        <Link to="/app/dashboard"><FrekiWordmark /></Link>
        <Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-sidebar text-sidebar-foreground p-4 overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <FrekiWordmark className="text-sidebar-foreground" />
              <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="mb-3 rounded-md border border-sidebar-border p-3">
              <div className="text-xs text-sidebar-foreground/60">Active property</div>
              <div className="font-medium">{property.name}</div>
              <div className="text-xs text-sidebar-foreground/60">{property.acres} ac · {property.location}</div>
            </div>
            <nav className="space-y-0.5">
              {nav.map((n) => {
                const active = pathname.startsWith(n.to);
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                      active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/70",
                    )}
                  >
                    <n.icon className="h-4 w-4" />
                    {n.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <main className="lg:pl-60 pb-20 lg:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-30 grid grid-cols-5 border-t border-border bg-background/95 backdrop-blur lg:hidden">
        {mobileNav.map((n) => {
          const active = pathname.startsWith(n.to);
          return (
            <Link
              key={n.to}
              to={n.to}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 text-[10px]",
                active ? "text-[var(--bronze)]" : "text-muted-foreground",
              )}
            >
              <n.icon className="h-5 w-5" />
              {n.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function PropertySwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="mx-3 mt-3 flex items-center justify-between gap-2 rounded-md border border-sidebar-border bg-sidebar-accent/40 px-3 py-2 text-left text-sm hover:bg-sidebar-accent transition">
          <div className="min-w-0">
            <div className="truncate font-medium">{property.name}</div>
            <div className="truncate text-xs text-sidebar-foreground/60">{property.acres} ac · {property.location}</div>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-sidebar-foreground/60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Your properties</DropdownMenuLabel>
        <DropdownMenuItem>{property.name} <span className="ml-auto text-xs text-muted-foreground">Active</span></DropdownMenuItem>
        <DropdownMenuItem disabled>Cedar Hollow (demo)</DropdownMenuItem>
        <DropdownMenuItem disabled>Ridgeview Club (demo)</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>+ Add property</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="border-b border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            {description && <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}

export function PageBody({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>;
}
