  "use client";

import * as React from "react";
import {
  Clock,
  ChevronDown,
  Layout,
  Activity,
  Download,
  ArrowUpRight,
  Check,
  Plus as PlusIcon,
  Video,
  VideoOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeReportModal } from "../employee-report-modal";
import { SuspendEmployeeModal } from "../modals/suspend-employee-modal";
import { RemoveEmployeeModal } from "../modals/remove-employee-modal";
import { TaskCard } from "../task-card";
import { Typography } from "@/components/ui/typography";


// FIGMA ASSETS (From Design Nodes 141:7637, 141:7718, 141:7874)
const ASSETS = {
  ADMIN_AVATAR: "https://ui.shadcn.com/avatars/01.png",
  JOHN_SMITH_AVATAR: "https://ui.shadcn.com/avatars/02.png",
  USER_02: "https://ui.shadcn.com/avatars/03.png",
  USER_08: "https://ui.shadcn.com/avatars/04.png",
  TRACKING_MAIN: "http://localhost:3845/assets/884390fb6710390ee7ba0aa70889381de906fefe.png",
  TRACKING_THUMB: "http://localhost:3845/assets/70c7d9d441b492d59376e3f2d41e259aebc01982.png",
  ICONS: {
    CLOCK_ORANGE: "http://localhost:3845/assets/edfbbc0afaeef83f545946dcefb867e446f6f102.svg",
    ANGLE_DOWN: "http://localhost:3845/assets/1f63d67a4cfdb992656b69a3f73fd4a7bdd35b74.svg",
    EDIT_BLUE: "http://localhost:3845/assets/7fcd35a23400557eec0c9c82230941990693b9d5.svg",
    BLOCK_ORANGE: "http://localhost:3845/assets/670f14a11fd2a5a390811205c09a3e0048e70def.svg",
    TRASH_RED: "http://localhost:3845/assets/fe47ed12686d1e53ac51bd17217504864a48babf.svg"
  }
};

type EmployeeStatus = "Online" | "Meeting" | "Break" | "IDLE" | "Offline";

interface EmployeeProfileData {
  id: string;
  name: string;
  role: string;
  status: EmployeeStatus;
  avatar?: string;
  email?: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
  levelOfAuthority?: string;
}

interface EmployeeProfilePanelProps {
  employee: EmployeeProfileData;
}

const profileSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number"),
  department: z.string().min(1, "Select a department"),
  jobTitle: z.string().min(2, "Job title is too short"),
  levelOfAuthority: z.string().min(1, "Select authority level"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const mockTasks = [
  {
    title: "Review The Latest Article content",
    status: "In Progress",
    statusColor: "var(--success)",
    date: "12/2/2026",
    by: ASSETS.ADMIN_AVATAR,
    to: [ASSETS.USER_02]
  },
  {
    title: "Review The Latest Article content",
    status: "In Progress",
    statusColor: "var(--success)",
    date: "12/2/2026",
    by: ASSETS.ADMIN_AVATAR,
    to: [ASSETS.USER_02, ASSETS.USER_08, ASSETS.ADMIN_AVATAR]
  },
  {
    title: "Review The Latest Article content",
    status: "In Progress",
    statusColor: "var(--success)",
    date: "12/2/2026",
    by: ASSETS.ADMIN_AVATAR,
    to: [ASSETS.USER_02, ASSETS.ADMIN_AVATAR]
  },
];


export function EmployeeProfilePanel({ employee }: EmployeeProfilePanelProps) {
  const [isReportOpen, setIsReportOpen] = React.useState(false);
  
  return (
    <>
      <EmployeeProfilePanelContent 
        employee={employee} 
        onShowReport={() => setIsReportOpen(true)} 
      />
      <EmployeeReportModal 
        open={isReportOpen}
        onOpenChange={setIsReportOpen}
        employee={{
          id: employee.id,
          name: employee.name,
          avatar: employee.avatar
        }}
      />

    </>
  );
}

function EmployeeProfilePanelContent({ 
  employee, 
  onShowReport 
}: { 
  employee: EmployeeProfileData; 
  onShowReport: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: employee.name,
      email: employee.email || `${employee.name.toLowerCase().replace(" ", ".")}@almaster.co`,
      phone: employee.phone || "+20 1012345678",
      department: employee.department || "Graphic Design Department",
      jobTitle: employee.jobTitle || employee.role,
      levelOfAuthority: employee.levelOfAuthority || "Team Lead",
    }
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuspendModalOpen, setIsSuspendModalOpen] = React.useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = React.useState(false);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    console.log("Submitting to backend:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
  };

  return (
    <div className="flex-1 bg-muted overflow-y-auto no-scrollbar pb-20">
      <div className="p-6 flex flex-col gap-6 w-full max-w-full">
        {/* Profile Title and Action Buttons (Detailed Node: 141:7658) */}
        <div className="flex items-center justify-between w-full">
          <Typography as="h1" className="text-2xl font-bold text-foreground leading-[20px]">
            {employee.name} Profile
          </Typography>
          <button className="bg-primary flex items-center gap-2 px-5 py-2.5 rounded-xl h-10 text-primary-foreground hover:bg-primary/90 transition-all font-bold text-xs">
            <PlusIcon className="w-3.5 h-3.5" />
            Create New Role
          </button>
        </div>


        {/* Profile Information (Detailed Node: 141:7667) */}
        <section className="bg-background border border-border/50 border-t-4 border-t-success rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex flex-col gap-0.5">
              <Typography as="h2" className="text-lg font-bold text-foreground leading-[22.4px]">Profile Information</Typography>
              <Typography as="p" className="text-sm text-muted-foreground font-bold leading-[22.4px]">Your personal information and account details</Typography>
            </div>

            <div className="flex gap-1.5 items-center">
              <button
                type="button"
                className="bg-primary/10 hover:bg-primary/20 transition-colors w-9 h-9 flex items-center justify-center rounded-lg shrink-0"
              >
                <Image src={ASSETS.ICONS.EDIT_BLUE} alt="Edit" width={12} height={12} className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => setIsSuspendModalOpen(true)}
                className="bg-warning/10 hover:bg-warning/20 transition-colors w-9 h-9 flex items-center justify-center rounded-lg shrink-0"
              >
                <Image src={ASSETS.ICONS.BLOCK_ORANGE} alt="Block" width={12} height={12} className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setIsRemoveModalOpen(true)}
                className="bg-destructive/10 hover:bg-destructive/20 transition-colors w-9 h-9 flex items-center justify-center rounded-lg shrink-0"
              >
                <Image src={ASSETS.ICONS.TRASH_RED} alt="Delete" width={12} height={12} className="w-3 h-3" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6 items-start">
            <div className="flex flex-col items-start gap-1.5 shrink-0">
              <Typography as="span" className="text-sm font-bold text-foreground leading-[22.4px]">Avatar</Typography>
              <div className="flex flex-col items-center gap-1.5 shrink-0">
                <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden border border-background shadow-sm bg-muted shrink-0">
                  <Image src={ASSETS.JOHN_SMITH_AVATAR} alt="Avatar" width={100} height={100} className="w-full h-full object-cover object-top" />
                </div>
                <button type="button" className="text-xs font-bold text-primary hover:underline">Change Image</button>
              </div>
            </div>


            <div className="flex-1 flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-5">
                {[
                  { label: "Full Name", name: "fullName" as const, type: "input" },
                  { label: "Email Address", name: "email" as const, type: "input" },
                  { label: "Phone Number", name: "phone" as const, type: "input" },
                  { label: "Department", name: "department" as const, type: "select", options: ["Graphic Design Department", "Programming Department", "HR Department"] },
                  { label: "Job Title", name: "jobTitle" as const, type: "input" },
                  { label: "Level of Authority", name: "levelOfAuthority" as const, type: "select", options: ["Team Lead", "Super Admin", "Manager"] },
                ].map((field) => (
                  <div key={field.name} className="flex flex-col gap-1">
                    <Typography as="span" className="text-sm font-bold text-foreground leading-[22.4px]">{field.label}</Typography>
                    <div className={cn(
                      "h-10 rounded-lg flex items-center justify-between border transition-all relative overflow-hidden",
                      field.type === "input" && "px-4 bg-secondary",
                      errors[field.name] ? "border-destructive bg-destructive/5" : "border-transparent"
                    )}>

                      {field.type === "input" ? (
                        <input
                          {...register(field.name)}
                          className="w-full bg-transparent outline-none text-xs font-bold text-muted-foreground placeholder:text-muted-foreground"
                        />

                      ) : (
                        <div className="w-full relative h-full">
                          <Controller
                            control={control}
                            name={field.name as keyof ProfileFormValues}
                            render={({ field: selectField }) => (
                              <Select onValueChange={selectField.onChange} value={(selectField.value as string) ?? ""}>
                                <SelectTrigger className="w-full h-full bg-secondary border-none px-4 rounded-lg text-xs font-bold! text-muted-foreground outline-none shadow-none focus:ring-0 [&>svg]:size-3.5 [&>svg]:text-muted-foreground justify-between transition-colors hover:bg-secondary/80">
                                  <SelectValue placeholder={field.label} />
                                </SelectTrigger>
                                <SelectContent align="end" className="bg-background border-border rounded-xl p-1.5 font-bold">

                                  {field.options?.map(opt => (
                                    <SelectItem
                                      key={opt}
                                      value={opt}
                                      className={cn(
                                        "rounded-lg px-3.5 py-2 text-xs transition-colors cursor-pointer outline-none",
                                        selectField.value === opt
                                          ? "text-primary bg-primary/5 focus:bg-primary/5 focus:text-primary"
                                          : "text-muted-foreground hover:bg-muted focus:bg-muted"
                                      )}
                                    >

                                      {opt}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1.5 mt-1">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="h-10 px-5 bg-secondary text-foreground text-xs font-bold rounded-xl hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-5 bg-primary text-primary-foreground text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className={cn("w-3.5 h-3.5", isSubmitting && "animate-spin")} />
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>

            </div>
          </form>
        </section>

        {/* Tracking Center (Detailed Node: 141:7718) - FULL WIDTH */}
        <section className="bg-background rounded-2xl p-5 shadow-sm border border-border flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography as="h2" className="text-lg font-bold text-foreground leading-[22.4px]">Tracking Center</Typography>
              <Typography as="p" className="text-sm text-muted-foreground font-bold leading-[22.4px]">Your personal information and account details</Typography>
            </div>

            <div className="flex gap-1.5">
              <div className="bg-primary w-10 h-9 rounded-lg flex items-center justify-center cursor-pointer shadow-sm shadow-primary/10">
                <Layout className="w-3 h-3 text-primary-foreground" />
              </div>
              <div className="bg-secondary w-10 h-9 rounded-lg flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors">
                <Video className="w-3 h-3 text-foreground" />
              </div>
              <div className="bg-primary w-10 h-9 rounded-lg flex items-center justify-center cursor-pointer shadow-sm shadow-primary/10">
                <Activity className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>

          </div>

          <div className="flex gap-3 h-[340px]">
            {/* Main Screen Share */}
            <div className="flex-[1.8] rounded-lg relative overflow-hidden group border border-border/50 shadow-sm bg-slate-900">
              <Image src={ASSETS.TRACKING_MAIN} alt="Main Share" width={600} height={340} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-black/80 pointer-events-none" />
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="text-white text-xs font-bold text-nowrap">{employee.name}&apos;s screen sharing</span>
                <div className="bg-success/10 backdrop-blur-sm px-2 py-1 rounded-md">
                  <span className="text-success text-xs font-bold leading-[14px]">Online</span>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                <div className="bg-primary w-10 h-9 rounded-lg flex items-center justify-center cursor-pointer shadow-lg shadow-primary/30">
                  <Activity className="w-3 h-3 text-primary-foreground" />
                </div>
                <div className="flex items-center gap-1 text-secondary text-[10px] font-bold">
                  <Clock className="w-2.5 h-2.5" />
                  <span>12:08:56 PM</span>
                </div>
              </div>
            </div>


            <div className="flex-1 flex flex-col gap-3">
              {/* Camera Off State */}
              <div className="flex-1 bg-secondary rounded-lg flex flex-col items-center justify-center gap-2 group cursor-default">
                <div className="bg-muted w-12 h-11 rounded-xl flex items-center justify-center shadow-sm relative">
                  <VideoOff className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <span className="text-xs font-bold text-muted-foreground text-center px-4 leading-tight">{employee.name}&apos;s Camera is off</span>
              </div>


              {/* Latest Screenshot */}
              <div className="flex-1 rounded-lg relative overflow-hidden group shadow-sm cursor-pointer bg-slate-900">
                <Image src={ASSETS.TRACKING_THUMB} alt="Latest" width={300} height={160} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-b from-black/80 via-transparent to-black/80 pointer-events-none" />
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-xs font-bold text-white">Latest Screenshot</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                  <div className="bg-primary w-10 h-9 rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
                    <Layout className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <div className="flex items-center gap-1 text-secondary text-[10px] font-bold">
                    <Clock className="w-2.5 h-2.5" />
                    <span>12:08:56 PM</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Tasks and Activity Logs Combined Row (Detailed Node: 141:7765) */}
        <div className="flex gap-3 w-full">
          {/* Task Section (141:7766) */}
          <div className="flex-[1.8] bg-background rounded-xl p-4 flex flex-col gap-4 shadow-sm border border-border/40">
            <div className="flex items-center justify-between">
              <Typography as="h3" className="text-lg font-bold text-foreground leading-[20px]">Tasks</Typography>
              <div className="flex gap-1.5 items-start">
                <button className="h-8 px-3 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-md shadow-primary/10">His Tasks</button>
                <button className="h-8 px-3 bg-secondary text-muted-foreground text-xs font-bold rounded-lg hover:text-foreground">Assigned by him</button>
              </div>
            </div>


            <div className="flex flex-col gap-[9px]">
              {mockTasks.map((task, i) => (
                <TaskCard
                  key={i}
                  title={task.title}
                  status={task.status}
                  date={task.date}
                  variant="detailed"
                  by={task.by}
                  to={task.to}
                />
              ))}
            </div>
          </div>

          {/* Activity Logs Section (141:7874) */}
          <ActivityLogsCard />
        </div>

        {/* Performance and stats (Detailed Node: 141:7911) */}
        <PerformanceStatsCard onShowReport={onShowReport} />

        {/* Tasks Status & Attendance Row (Detailed Node: 141:7947) */}
        <div className="flex gap-3 w-full items-stretch">
          {/* Tasks Status (Detailed Node: 141:7948) */}
          <section className="flex-[1.5] bg-muted border border-border rounded-2xl p-4 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between w-full">
              <Typography as="h3" className="text-lg font-bold text-foreground leading-[20px]">Tasks Status</Typography>
              <TimeRangeSelector color="blue" />
            </div>


            <div className="flex flex-col gap-6 mt-1.5">
              <div className="flex flex-col gap-2.5">
                <div className="flex items-baseline gap-1.5">
                  <Typography as="span" className="text-2xl font-bold text-primary tracking-[-0.96px] leading-[29px]">128</Typography>
                  <Typography as="span" className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total Tasks</Typography>
                </div>
                <div className="h-4 w-full bg-primary/20 rounded-[4px] relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-primary/60 rounded-[4px] w-[83%]" />
                  <div className="absolute inset-y-0 left-0 bg-primary rounded-[4px] w-[68%]" />
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>


              <div className="flex gap-5 w-full">
                {[
                  { label: "Completed", value: "68%", sub: "87 Tasks", color: "bg-primary" },
                  { label: "In Progress", value: "15%", sub: "19 Tasks", color: "bg-primary/60" },
                  { label: "Not started yet", value: "17%", sub: "19 Tasks", color: "bg-primary/20" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-1 gap-2.5 items-start">
                    <div className={cn("w-2 h-3 rounded-[8px] shrink-0 mt-1", item.color)} />
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      <Typography as="span" className="text-base font-bold text-foreground tracking-[-0.64px] leading-tight overflow-hidden text-ellipsis whitespace-nowrap">
                        {item.label}
                      </Typography>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <Typography as="span" className="text-xs font-bold text-muted-foreground">{item.value}</Typography>
                        <div className="w-px h-3 bg-muted-foreground/20 mx-0.5" />
                        <Typography as="span" className="text-xs font-bold text-muted-foreground opacity-70">{item.sub}</Typography>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* Attendance (Detailed Node: 141:7994) */}
          <section className="flex-1 bg-background border border-border rounded-2xl p-4 flex flex-col gap-6 shadow-sm min-h-[224px]">
            <div className="flex items-center justify-between">
              <Typography as="h3" className="text-lg font-bold text-foreground leading-[22.4px]">Attendance Rate</Typography>
              <TimeRangeSelector color="blue" />
            </div>

            <div className="flex items-center gap-2">
              <Typography as="span" className="text-3xl font-bold text-foreground tracking-[-1.28px] leading-none">92%</Typography>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-destructive/10 rounded-md text-destructive">
                <ArrowUpRight className="w-3.5 h-3.5 rotate-180" />
                <Typography as="span" className="text-[11px] font-bold">+1.54%</Typography>
              </div>
              <Typography as="span" className="text-[11px] font-bold text-muted-foreground ml-1">Decreased by last month</Typography>
            </div>


            <div className="flex gap-1.5 flex-1 relative mt-1">
              {/* Y-Labels (42px) */}
              <div className="w-[42px] flex flex-col justify-between py-0.5 h-[84px] text-right">
                {["Week 4", "Week 3", "Week 2", "Week 1"].map((w) => (
                  <span key={w} className="text-[11px] font-bold text-muted-foreground uppercase tracking-tighter h-[18px] flex items-center justify-end">{w}</span>
                ))}
              </div>


              {/* Data Grid Column */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="grid grid-cols-5 gap-2 h-[84px]">
                  {[...Array(5)].map((_, col) => (
                    <div key={col} className="flex flex-col gap-1">
                      {[...Array(4)].map((_, row) => {
                        const statuses = ["var(--primary)", "var(--primary-60)", "var(--secondary)", "var(--destructive)", "var(--success)"];
                        const bg = statuses[(row + col) % 5];
                        return (
                           <div key={row} className="h-[18px] w-full rounded-[5px] cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all shadow-sm" style={{ backgroundColor: bg }} />
                        );
                      })}
                    </div>
                  ))}
                </div>

                 {/* Horizontal Labels */}
                <div className="grid grid-cols-5 gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu"].map((day) => (
                    <span key={day} className="text-xs font-bold text-muted-foreground text-center">{day}</span>
                  ))}
                </div>

              </div>

              {/* Pixel-Perfect Tooltip (141:8455) */}
              <div className="absolute top-0 right-[-10px] z-50">
                <div className="bg-background rounded-xl shadow-[0px_16px_48px_rgba(0,0,0,0.15)] p-2 w-[140px] border border-border flex flex-col gap-1.5">
                  <Typography as="h4" className="text-[11px] font-bold text-foreground">Wed, 19 Feb</Typography>
                  <div className="h-px bg-border -mx-2" />

                  <div className="flex flex-col gap-1.5">
                    {[
                      { label: "Attend", val: "08:11:58 AM", color: "#5AA1FF" },
                      { label: "Work", val: "06:24:58", color: "#00B927" },
                      { label: "Meeting", val: "00:30:12", color: "#F38328" },
                      { label: "Break", val: "00:45:00", color: "#707070" },
                      { label: "IDLE", val: "00:12:19", color: "#F55050" },
                      { label: "Overtime", val: "00:32:57", color: "#0047FF" },
                      { label: "Leave", val: "05:11:58 AM", color: "#5AA1FF" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between text-[10px] font-bold">
                        <span style={{ color: s.color }}>{s.label}</span>
                        <span style={{ color: s.color }} className="text-right">{s.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>


        {/* Performance Overview (Detailed Node: 141:8065) */}
        <section className="bg-background border border-border rounded-2xl p-5 flex flex-col gap-6 shadow-sm w-full">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <Typography as="h2" className="text-lg font-bold text-foreground leading-[22.4px]">Performance Overview</Typography>
              <Typography as="p" className="text-sm font-bold text-muted-foreground leading-[22.4px]">Your personal information and account details</Typography>
            </div>

            <TimeRangeSelector color="blue" />
          </div>

          <div className="flex gap-4 h-[240px] mt-2">
            {/* Y-Axis Labels (0-100%) */}
            <div className="flex flex-col justify-between py-2 text-right w-10 shrink-0">
              {["100%", "75%", "50%", "25%", "0%"].map((v) => (
                <span key={v} className="text-[11px] font-bold text-muted-foreground leading-none">{v}</span>
              ))}
            </div>


            {/* Chart Container */}
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex-1 relative border-l border-b border-border mr-2">
                {/* Horizontal Grid Lines */}
                {[0, 25, 50, 75, 100].map((line) => (
                  <div key={line} className="absolute w-full h-px bg-border" style={{ bottom: `${line}%` }} />
                ))}


                {/* SVG Curve - Peak at Sep (index 8, 72.7%) */}
                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1100 100">
                  <defs>
                    <linearGradient id="performanceGradFinal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0047FF" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#0047FF" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Values: Jan:80, Feb:70, Mar:85, Apr:40, May:30, Jun:60, Jul:50, Aug:35, Sep:1.3, Oct:15, Nov:30, Dec:70 */}
                  <path
                    d="M 0 80 
                       C 100 70, 200 85, 300 40 
                       C 400 30, 500 60, 600 50 
                       C 700 35, 800 1.3, 800 1.3 
                       L 900 15 
                       L 1000 30 
                       L 1100 70"
                    fill="none"
                    stroke="#0047FF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d="M 0 80 
                       C 100 70, 200 85, 300 40 
                       C 400 30, 500 60, 600 50 
                       C 700 35, 800 1.3, 800 1.3 
                       L 900 15 
                       L 1000 30 
                       L 1100 70 
                       V 100 H 0 Z"
                    fill="url(#performanceGradFinal)"
                  />

                  {/* Highlighted Sep Peak Point */}
                  <circle cx="800" cy="1.3" r="4" fill="#0047FF" stroke="white" strokeWidth="2" />
                </svg>

                {/* Tooltip positioned perfectly above Sep (at 800/1100 x-coord = ~72.7%) */}
                <div className="absolute top-[1.3%] left-[72.7%] -translate-x-1/2 -translate-y-[calc(100%+8px)] z-20">
                  <div className="bg-foreground text-background px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl relative scale-100 hover:scale-105 transition-transform cursor-default">
                    <Typography as="span" className="text-xs font-bold">Sep 98.7%</Typography>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-foreground" />
                  </div>
                </div>

              </div>

              {/* X-Axis Monthly Labels - Aligned with Grid points */}
              <div className="flex justify-between -mx-1 pr-1">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                  <span key={m} className={cn(
                    "text-[11px] font-bold transition-colors",
                    m === "Sep" ? "text-primary" : "text-muted-foreground"
                  )}>
                    {m}
                  </span>
                ))}

              </div>
            </div>
          </div>
        </section>
      </div>

      <SuspendEmployeeModal
        open={isSuspendModalOpen}
        onOpenChange={setIsSuspendModalOpen}
        employeeName={employee.name}
      />
      <RemoveEmployeeModal
        open={isRemoveModalOpen}
        onOpenChange={setIsRemoveModalOpen}
        employeeName={employee.name}
      />
    </div>
  );
}

// Reusable Time Range Selector Component
function TimeRangeSelector({
  initial = "This Month",
  color = "blue"
}: {
  initial?: string;
  color?: "blue" | "gray"
}) {
  const [range, setRange] = React.useState(initial);
  const options = ["This Week", "This Month", "This Year", "All Activities"];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(
        "h-8 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-all border-none outline-none",
        color === "blue" ? "bg-primary/10" : "bg-secondary"
      )}>
        <span className={cn(
          "text-xs font-bold leading-[14px]",
          color === "blue" ? "text-primary" : "text-muted-foreground"
        )}>
          {range}
        </span>
        <ChevronDown className={cn(
          "w-3.5 h-3.5",
          color === "blue" ? "text-primary" : "text-muted-foreground"
        )} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="bg-background border-border rounded-xl shadow-lg">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => setRange(opt)}
            className={cn(
              "text-xs font-bold px-4 py-2 cursor-pointer transition-colors",
              range === opt ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-muted"
            )}
          >
            {opt}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>

    </DropdownMenu>
  );
}

function ActivityLogsCard() {
  return (
    <div className="flex-1 bg-background rounded-xl p-4 flex flex-col gap-4 shadow-sm border border-border/50">
      <div className="flex items-center justify-between">
        <Typography as="h3" className="text-lg font-bold text-foreground leading-[20px]">Activity Logs</Typography>
        <TimeRangeSelector initial="All Activities" color="gray" />
      </div>

      <div className="flex flex-col gap-[9px]">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-secondary p-3 rounded-lg flex flex-col gap-1 transition-colors cursor-default">
            <p className="text-sm font-bold text-foreground leading-[20px]">Changed status from break to working</p>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3" />
              <span className="text-xs font-bold leading-[20px]">10 minutes ago</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

function PerformanceStatsCard({ onShowReport }: { onShowReport: () => void }) {
  return (
    <section className="bg-background border border-border rounded-2xl p-5 flex flex-col gap-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <Typography as="h2" className="text-lg font-bold text-foreground leading-[22.4px]">Performance and stats</Typography>
          <Typography as="p" className="text-sm font-bold text-muted-foreground leading-[22.4px]">Your personal information and account details</Typography>
        </div>
        <TimeRangeSelector color="blue" />
      </div>


      <div className="grid grid-cols-5 gap-3">
        {[
          { label: "Working", time: "120:24:58", color: "var(--success)", bg: "bg-success/5" },
          { label: "Meeting", time: "12:20:28", color: "var(--warning)", bg: "bg-warning/5" },
          { label: "Break", time: "09:10:21", color: "var(--muted-foreground)", bg: "bg-muted" },
          { label: "IDLE", time: "03:20:28", color: "var(--destructive)", bg: "bg-destructive/5" },
          { label: "Overtime", time: "00:00:00", color: "var(--primary)", bg: "bg-primary/5" },
        ].map((stat) => (
          <div key={stat.label} className={cn(
            "rounded-xl p-4 flex flex-col items-center justify-center gap-1 border border-transparent hover:border-primary/20 transition-all",
            stat.bg
          )}>
            <Typography as="span" className="text-sm font-bold" style={{ color: stat.color }}>{stat.label}</Typography>
            <Typography as="span" className="text-base font-bold" style={{ color: stat.color }}>{stat.time}</Typography>
          </div>
        ))}

      </div>

      <div className="flex items-center gap-4">
        <Typography as="p" className="text-sm font-bold text-muted-foreground whitespace-nowrap leading-[22.4px]">
          <span className="text-success">135H </span>
          / 180H
        </Typography>
        <div className="flex-none w-px h-6 bg-border" />
        <div className="flex-1 h-4 bg-secondary rounded-[4px] relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 bg-success rounded-[4px]" style={{ width: "75%" }} />
        </div>
        <Typography as="p" className="text-sm font-bold text-success leading-[22.4px]">75%</Typography>
      </div>


      <div className="flex items-center justify-between">
        <Typography as="p" className="text-sm font-bold text-muted-foreground leading-[22.4px]">
          <span className="text-primary">Summary: </span>
          You still need
          <span className="text-primary"> 45 hours </span>
          of work to achieve the monthly target.
        </Typography>
        <button 
          onClick={onShowReport}
          className="h-9 px-5 bg-primary text-primary-foreground text-xs font-bold rounded-xl flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
        >
          <Download className="w-3.5 h-3.5" />
          Export Report
        </button>
      </div>
    </section>

  );
}
