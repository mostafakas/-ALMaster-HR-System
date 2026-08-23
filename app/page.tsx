import { SystemSelector } from "@/components/shared/system-selector";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[#0000FF] flex items-center justify-center p-6">
      <SystemSelector userName="AL Master CEO" />
    </div>
  );
}
