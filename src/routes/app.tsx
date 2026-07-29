import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PublicLandPrompt } from "@/components/public-land-prompt";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <>
      <AppShell />
      <PublicLandPrompt />
    </>
  );
}
