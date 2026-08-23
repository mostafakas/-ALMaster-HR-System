import { TasksOverview } from "@/components/tasks/tasks-overview";

export const metadata = {
  title: "AlMaster Tasks",
  description:
    "Overview of every task across projects — Board, List and Calendar views.",
};

export default function PMHomePage() {
  return <TasksOverview />;
}
