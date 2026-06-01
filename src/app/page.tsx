import {
  Activity,
  AlertTriangle,
  Baby,
  Bell,
  CalendarDays,
  Camera,
  CheckCircle2,
  ClipboardList,
  FileSignature,
  Heart,
  Home,
  LockKeyhole,
  MessageCircle,
  Milk,
  Moon,
  ShieldCheck,
  Sparkles,
  Utensils,
  UsersRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const parentUpdates = [
  {
    time: "8:12 AM",
    title: "Checked in",
    detail: "Mia was checked in by Ana with digital signature.",
    icon: CheckCircle2,
  },
  {
    time: "9:30 AM",
    title: "Breakfast",
    detail: "Ate oatmeal, banana, and milk.",
    icon: Utensils,
  },
  {
    time: "11:45 AM",
    title: "Photo shared",
    detail: "Outdoor play photo added to Mia's private feed.",
    icon: Camera,
  },
  {
    time: "12:20 PM",
    title: "Nap started",
    detail: "Mia started nap time in the toddler classroom.",
    icon: Moon,
  },
];

const adminStats = [
  { label: "Checked in", value: "42", icon: Baby },
  { label: "Absent", value: "6", icon: Home },
  { label: "Unread messages", value: "9", icon: MessageCircle },
  { label: "Reports pending", value: "5", icon: ClipboardList },
];

const featureGroups = [
  {
    title: "Parent communication",
    icon: MessageCircle,
    items: ["Parent messaging", "Announcements", "Newsletters", "School calendar"],
  },
  {
    title: "Daily reports",
    icon: Activity,
    items: ["Meals", "Bottles", "Naps", "Diapers", "Potty", "Activities"],
  },
  {
    title: "Photos and videos",
    icon: Camera,
    items: ["Private uploads", "Child tagging", "Photo consent", "Downloads"],
  },
  {
    title: "Attendance",
    icon: CheckCircle2,
    items: ["Parent check-in", "Digital signatures", "Pickup tracking", "Reports"],
  },
  {
    title: "Forms and documents",
    icon: FileSignature,
    items: ["Enrollment forms", "Medical forms", "Permission slips", "Signatures"],
  },
  {
    title: "Safety and records",
    icon: ShieldCheck,
    items: ["Incident reports", "Allergy alerts", "Medical notes", "Audit logs"],
  },
];

const teacherTasks = [
  { label: "Add meal", icon: Utensils },
  { label: "Add bottle", icon: Milk },
  { label: "Add nap", icon: Moon },
  { label: "Upload photo", icon: Camera },
  { label: "Send note", icon: MessageCircle },
  { label: "Incident report", icon: AlertTriangle },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f7f8fb] text-slate-950">
      <section className="relative overflow-hidden border-b bg-white">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-sky-100 blur-3xl" />
        <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-amber-100 blur-3xl" />

        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
              <Heart className="size-5" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight">CareLoop</p>
              <p className="text-xs text-slate-500">Childcare updates made simple</p>
            </div>
          </div>

          <div className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="hover:text-slate-950">Features</a>
            <a href="#demo" className="hover:text-slate-950">Demo</a>
            <a href="#security" className="hover:text-slate-950">Security</a>
          </div>

          <Button className="rounded-full px-5">Open demo</Button>
        </nav>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-8 md:grid-cols-[1.05fr_0.95fr] md:items-center md:pb-24 md:pt-14">
          <div>
            <Badge className="mb-5 rounded-full bg-sky-100 px-4 py-2 text-sky-800 hover:bg-sky-100">
              Built for real daycare parents and staff
            </Badge>

            <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-slate-950 md:text-7xl">
              A calm, simple daycare app parents can actually use.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
              CareLoop helps childcare centers share check-ins, daily reports, photos,
              forms, messages, menus, learning updates, and incident reports in one
              secure parent-friendly place.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="h-13 rounded-full px-7 text-base">
                View product demo
              </Button>
              <Button size="lg" variant="outline" className="h-13 rounded-full px-7 text-base">
                See feature list
              </Button>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              <MiniMetric value="Mobile first" label="Works on phones" />
              <MiniMetric value="Private" label="Child-safe access" />
              <MiniMetric value="Simple" label="Older-parent friendly" />
            </div>
          </div>

          <div className="mx-auto w-full max-w-sm rounded-[2.5rem] border bg-slate-950 p-3 shadow-2xl">
            <div className="rounded-[2rem] bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Today</p>
                  <h2 className="text-xl font-bold">Mia's day</h2>
                </div>
                <div className="flex size-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Baby className="size-5" />
                </div>
              </div>

              <div className="rounded-3xl bg-sky-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <CheckCircle2 className="size-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Checked in safely</p>
                    <p className="text-sm text-slate-500">8:12 AM by Ana</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {parentUpdates.slice(1).map((item) => (
                  <div key={item.title} className="flex gap-3 rounded-2xl border p-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                      <item.icon className="size-5 text-slate-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-slate-400">{item.time}</p>
                      </div>
                      <p className="text-sm text-slate-500">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <QuickAction icon={MessageCircle} label="Message" />
                <QuickAction icon={CalendarDays} label="Calendar" />
                <QuickAction icon={FileSignature} label="Forms" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="rounded-full px-4 py-2">
            Version 1 scope
          </Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
            Focused on what your daycare actually needs first.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Billing and payroll can come later. The first version focuses on parent
            trust, daily updates, attendance, records, and clean communication.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featureGroups.map((group) => (
            <Card key={group.title} className="rounded-3xl border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-slate-100">
                  <group.icon className="size-6 text-slate-800" />
                </div>
                <h3 className="text-xl font-bold">{group.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Badge key={item} variant="secondary" className="rounded-full">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="demo" className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-5">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Badge className="rounded-full bg-emerald-100 px-4 py-2 text-emerald-800 hover:bg-emerald-100">
                Product preview
              </Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
                Three simple views for the real users.
              </h2>
            </div>
            <p className="max-w-xl text-slate-600">
              Parents get a clean timeline. Admins get a command center. Teachers
              get fast buttons, not confusing software.
            </p>
          </div>

          <Tabs defaultValue="parent" className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-3 rounded-2xl bg-slate-100 p-1">
              <TabsTrigger value="parent" className="rounded-xl py-3">Parent</TabsTrigger>
              <TabsTrigger value="admin" className="rounded-xl py-3">Admin</TabsTrigger>
              <TabsTrigger value="staff" className="rounded-xl py-3">Staff</TabsTrigger>
            </TabsList>

            <TabsContent value="parent" className="mt-6">
              <Card className="rounded-3xl border-0 bg-[#f7f8fb] shadow-sm">
                <CardContent className="grid gap-6 p-5 md:grid-cols-[0.85fr_1.15fr] md:p-8">
                  <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex size-16 items-center justify-center rounded-3xl bg-pink-100">
                        <Baby className="size-8 text-pink-700" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Mia Johnson</h3>
                        <p className="text-slate-500">Toddler Room • Checked in</p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <InfoTile label="Last meal" value="Breakfast" />
                      <InfoTile label="Nap" value="12:20 PM" />
                      <InfoTile label="Mood" value="Happy" />
                      <InfoTile label="Pickup" value="Ana" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {parentUpdates.map((item) => (
                      <TimelineItem key={item.title} {...item} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin" className="mt-6">
              <Card className="rounded-3xl border-0 bg-[#f7f8fb] shadow-sm">
                <CardContent className="p-5 md:p-8">
                  <div className="grid gap-4 md:grid-cols-4">
                    {adminStats.map((stat) => (
                      <Card key={stat.label} className="rounded-3xl border-0 shadow-sm">
                        <CardContent className="p-5">
                          <stat.icon className="mb-4 size-6 text-slate-500" />
                          <p className="text-3xl font-bold">{stat.value}</p>
                          <p className="text-sm text-slate-500">{stat.label}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <Card className="rounded-3xl border-0 shadow-sm">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold">Needs attention</h3>
                        <div className="mt-4 space-y-3">
                          <AdminRow icon={FileSignature} title="3 incident reports need parent signature" />
                          <AdminRow icon={Bell} title="2 classrooms have unsent daily reports" />
                          <AdminRow icon={AlertTriangle} title="1 allergy alert updated today" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-0 shadow-sm">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold">Classroom counts</h3>
                        <div className="mt-4 space-y-4">
                          <ProgressRow label="Infants" value="8 / 10" percent="80%" />
                          <ProgressRow label="Toddlers" value="14 / 16" percent="88%" />
                          <ProgressRow label="Preschool" value="20 / 22" percent="91%" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="staff" className="mt-6">
              <Card className="rounded-3xl border-0 bg-[#f7f8fb] shadow-sm">
                <CardContent className="grid gap-6 p-5 md:grid-cols-[0.85fr_1.15fr] md:p-8">
                  <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <Badge className="rounded-full bg-amber-100 text-amber-800 hover:bg-amber-100">
                      Toddler Room
                    </Badge>
                    <h3 className="mt-4 text-2xl font-bold">Fast daily logging</h3>
                    <p className="mt-2 text-slate-600">
                      Teachers should be able to update parents in seconds, not fight
                      with confusing forms.
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {teacherTasks.map((task) => (
                        <button
                          key={task.label}
                          className="flex items-center gap-3 rounded-2xl border bg-white p-4 text-left font-semibold shadow-sm transition hover:bg-slate-50"
                        >
                          <task.icon className="size-5 text-slate-600" />
                          {task.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white p-6 shadow-sm">
                    <h3 className="text-xl font-bold">Create update</h3>
                    <div className="mt-4 rounded-3xl border bg-slate-50 p-4">
                      <p className="text-sm font-semibold text-slate-500">Selected children</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {["Mia", "Noah", "Sofia"].map((name) => (
                          <Badge key={name} className="rounded-full bg-white text-slate-800 shadow-sm hover:bg-white">
                            {name}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-5 text-sm font-semibold text-slate-500">Update</p>
                      <div className="mt-3 rounded-2xl bg-white p-4 text-slate-600">
                        Outdoor play went great today. The class practiced sharing,
                        counting, and cleanup.
                      </div>
                      <Button className="mt-4 w-full rounded-2xl">Post to parents</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <section id="security" className="mx-auto max-w-7xl px-5 py-16">
        <div className="rounded-[2rem] bg-slate-950 p-6 text-white md:p-10">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <Badge className="rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/10">
                Security first
              </Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-5xl">
                Private child data needs serious permissions.
              </h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">
                Parents only see their own children. Photos are private. Staff only
                get the access they need. Every sensitive action should eventually
                be logged.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <SecurityItem icon={LockKeyhole} title="Parent-only access" />
              <SecurityItem icon={Camera} title="Private photo sharing" />
              <SecurityItem icon={UsersRound} title="Role-based accounts" />
              <SecurityItem icon={ClipboardList} title="Audit-ready records" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function MiniMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <p className="text-sm font-bold">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
}: {
  icon: typeof MessageCircle;
  label: string;
}) {
  return (
    <button className="rounded-2xl bg-slate-100 p-3 text-center">
      <Icon className="mx-auto mb-1 size-5 text-slate-700" />
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}

function TimelineItem({
  time,
  title,
  detail,
  icon: Icon,
}: {
  time: string;
  title: string;
  detail: string;
  icon: typeof MessageCircle;
}) {
  return (
    <div className="flex gap-4 rounded-3xl bg-white p-4 shadow-sm">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
        <Icon className="size-6 text-slate-700" />
      </div>
      <div>
        <div className="flex flex-wrap items-center gap-x-2">
          <p className="font-bold">{title}</p>
          <p className="text-sm text-slate-400">{time}</p>
        </div>
        <p className="mt-1 text-sm leading-6 text-slate-600">{detail}</p>
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}

function AdminRow({
  icon: Icon,
  title,
}: {
  icon: typeof MessageCircle;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
      <Icon className="size-5 text-slate-600" />
      <p className="font-medium">{title}</p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  percent,
}: {
  label: string;
  value: string;
  percent: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="font-semibold">{label}</p>
        <p className="text-sm text-slate-500">{value}</p>
      </div>
      <div className="h-3 rounded-full bg-slate-100">
        <div className="h-3 rounded-full bg-slate-950" style={{ width: percent }} />
      </div>
    </div>
  );
}

function SecurityItem({
  icon: Icon,
  title,
}: {
  icon: typeof MessageCircle;
  title: string;
}) {
  return (
    <div className="rounded-3xl bg-white/10 p-5">
      <Icon className="mb-4 size-7 text-white" />
      <p className="font-bold">{title}</p>
    </div>
  );
}
