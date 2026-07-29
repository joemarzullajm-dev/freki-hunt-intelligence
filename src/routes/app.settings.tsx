import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Freki" },
      { name: "description", content: "Account, units, and integrations." },
    ],
  }),
  component: Settings,
});

function Settings() {
  return (
    <>
      <PageHeader title="Settings" description="Configure your account, units, and future integrations." />
      <PageBody>
        <Tabs defaultValue="account">
          <TabsList className="flex-wrap h-auto">
            {["account","profile","notifications","units","properties","privacy","ai","integrations","subscription","team"].map((t) => (
              <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="account" className="mt-6 space-y-4 max-w-xl">
            <SettingsCard title="Account">
              <F label="Email"><Input defaultValue="demo@freki.app" /></F>
              <F label="Name"><Input defaultValue="Demo hunter" /></F>
              <Button onClick={() => toast.success("Account saved")}>Save changes</Button>
            </SettingsCard>
          </TabsContent>

          <TabsContent value="profile" className="mt-6 max-w-xl">
            <SettingsCard title="Profile">
              <F label="Default species"><Input defaultValue="Whitetail deer" /></F>
              <F label="Home region"><Input defaultValue="Upstate New York" /></F>
              <Button onClick={() => toast.success("Profile saved")}>Save</Button>
            </SettingsCard>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 max-w-xl space-y-3">
            <SettingsCard title="Notifications">
              <ToggleRow label="Weekly intelligence brief" defaultChecked />
              <ToggleRow label="Daily hunt outlook" defaultChecked />
              <ToggleRow label="High-confidence camera detections" defaultChecked />
              <ToggleRow label="Weather change alerts" />
            </SettingsCard>
          </TabsContent>

          <TabsContent value="units" className="mt-6 max-w-xl">
            <SettingsCard title="Units">
              <UnitRow label="Temperature" opts={["Fahrenheit","Celsius"]} />
              <UnitRow label="Area" opts={["Acres","Hectares"]} />
              <UnitRow label="Distance" opts={["Miles","Kilometers"]} />
              <UnitRow label="Precipitation" opts={["Inches","Millimeters"]} />
            </SettingsCard>
          </TabsContent>

          <TabsContent value="properties" className="mt-6 max-w-xl">
            <SettingsCard title="Properties">
              <p className="text-sm text-muted-foreground">Manage properties from the Properties page.</p>
            </SettingsCard>
          </TabsContent>

          <TabsContent value="privacy" className="mt-6 max-w-xl space-y-3">
            <SettingsCard title="Data & privacy">
              <ToggleRow label="Share anonymized detection data to improve species models" />
              <ToggleRow label="Allow Freki AI to reference property notes" defaultChecked />
              <Button variant="outline" onClick={() => toast("Export prepared")}>Export my data</Button>
            </SettingsCard>
          </TabsContent>

          <TabsContent value="ai" className="mt-6 max-w-xl">
            <SettingsCard title="AI preferences">
              <ToggleRow label="Always show supporting & conflicting evidence" defaultChecked />
              <ToggleRow label="Include unknowns in every response" defaultChecked />
              <ToggleRow label="Suggest next actions" defaultChecked />
            </SettingsCard>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Weather provider","Mapping provider","Cellular trail cameras","Email reports","SMS alerts","Calendar","Supabase Cloud"
            ].map((i) => (
              <div key={i} className="surface-panel p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{i}</div>
                  <div className="text-xs text-muted-foreground">Not connected</div>
                </div>
                <Badge variant="secondary">Coming later</Badge>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="subscription" className="mt-6 max-w-xl">
            <SettingsCard title="Subscription">
              <div className="text-sm">You're on the <strong>Demo plan</strong>. Real billing arrives with public launch.</div>
              <Button variant="outline" disabled>Manage subscription</Button>
            </SettingsCard>
          </TabsContent>

          <TabsContent value="team" className="mt-6 max-w-xl">
            <SettingsCard title="Team members">
              <p className="text-sm text-muted-foreground">Invite hunting partners or club members. Coming with cloud sync.</p>
              <Button variant="outline" disabled>Invite member</Button>
            </SettingsCard>
          </TabsContent>
        </Tabs>
      </PageBody>
    </>
  );
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="surface-panel p-5 space-y-3">
      <h2 className="font-display text-base font-semibold">{title}</h2>
      {children}
    </div>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid gap-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
function ToggleRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return <label className="flex items-center justify-between text-sm"><span>{label}</span><Switch defaultChecked={defaultChecked} /></label>;
}
function UnitRow({ label, opts }: { label: string; opts: string[] }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span>{label}</span>
      <RadioGroup defaultValue={opts[0]} className="flex gap-3">
        {opts.map((o) => (
          <label key={o} className="flex items-center gap-1.5 text-xs">
            <RadioGroupItem value={o} id={label + o} />
            {o}
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
