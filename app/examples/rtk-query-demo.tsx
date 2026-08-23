"use client";

import React from "react";
import { 
  useGetEmployeesQuery, 
  useAddEmployeeMutation 
} from "@/lib/store/services/employeeApi";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, User, AlertCircle } from "lucide-react";
import { Typography } from "@/components/ui/typography";

/**
 * Advanced RTK Query Usage Demo Component
 * 
 * Shows how to:
 * 1. Benefit from transformResponse (Component logic is now cleaner)
 * 2. Automatic global error handling (handled in baseQuery)
 * 3. Granular caching and automatic list updates
 */
export default function RTKQueryDemo() {
  // 1. Fetching data - Now returns raw data array thanks to transformResponse
  const { 
    data: employees, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetEmployeesQuery({ page: 1, limit: 10 });

  // 2. Mutation
  const [addEmployee, { isLoading: isAdding }] = useAddEmployeeMutation();

  const handleAddDemoEmployee = async () => {
    try {
      // Data is already unpacked by transformResponse
      const newEmployee = await addEmployee({
        fullName: "Advanced Employee " + Date.now(),
        email: `adv.${Date.now()}@example.com`,
        phoneNumber: "1234567890",
        countryCode: "+966",
        jobTitle: "Software Engineer",
        seniorityLevel: "Mid",
        department: "Programming",
        role: "Employee",
        permissions: {
          createUsers: false,
          editUsers: false,
          deleteUsers: false,
          manageRoles: false,
          viewReports: false,
          downloadReports: false,
          setTasks: false,
          viewTasks: false,
          systemSettings: false,
          manageDepartments: false,
          viewSalary: false,
          editSalary: false,
          chatsArchive: false,
          tasksArchive: false,
          manageDocuments: false,
        }
      }).unwrap(); 
      
      console.log("New employee created:", newEmployee);
    } catch (err) {
      console.error("Mutation failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader2 className="animate-spin size-6 text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-destructive">
          <AlertCircle className="size-5" />
          <Typography className="font-bold">
            Failed to load data
          </Typography>
        </div>
        <Typography variant="bodyMuted" className="text-sm">
          {/* Detailed error info from RTK Query */}
          {JSON.stringify(error)}
        </Typography>
        <Button onClick={() => refetch()} variant="outline">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="display" className="text-2xl font-bold">
          Team Members
        </Typography>
        <Button 
          onClick={handleAddDemoEmployee} 
          disabled={isAdding}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          {isAdding ? <Loader2 className="animate-spin size-4" /> : <Plus className="size-4" />}
          Add Member
        </Button>
      </div>

      <div className="grid gap-4">
        {/* 'employees' is now directly an array of items thanks to transformResponse */}
        {employees?.items.map((employee) => (
          <div 
            key={employee.id} 
            className="group flex items-center justify-between p-4 bg-white hover:bg-slate-50 rounded-xl border border-border shadow-sm transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <User className="size-5 text-slate-500 group-hover:text-primary transition-colors" />
              </div>
              <div>
                <Typography className="font-bold text-[#343434]">{employee.fullName}</Typography>
                <Typography variant="bodyMuted" className="text-xs">{employee.jobTitle} • {employee.department}</Typography>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <Button variant="ghost" size="sm" className="text-xs h-8">View Details</Button>
            </div>
          </div>
        ))}

        {employees?.items.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <Typography variant="bodyMuted">
              No team members found in the database.
            </Typography>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-slate-100">
        <Typography variant="h2" className="text-lg font-bold mb-3 text-[#343434]">
          Advanced Architecture Highlights:
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <FeatureCard 
             title="Global 401 Handling" 
             desc="Automatically logs out users and redirects to login on session expiry." 
           />
           <FeatureCard 
             title="Smart Retry Logic" 
             desc="Automatically retries failed requests twice with exponential backoff." 
           />
           <FeatureCard 
             title="Unpacked Responses" 
             desc="Components receive raw data directly, eliminating boiler-plate success checks." 
           />
           <FeatureCard 
             title="Granular Tagging" 
             desc="Efficient cache invalidation that only refreshes modified data segments." 
           />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
      <Typography className="text-sm font-bold mb-1 text-primary">{title}</Typography>
      <Typography className="text-[11px] leading-[14px] text-slate-500">{desc}</Typography>
    </div>
  );
}
