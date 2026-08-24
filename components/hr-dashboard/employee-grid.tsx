"use client"

import * as React from "react"
import { Palette, Edit2, PartyPopper, ChevronDown } from "lucide-react"
import { EmployeeCard } from "./employee-card"
import { cn } from "@/lib/utils"
import { HR_EMPLOYEE_FILTERS } from "@/lib/constants/hr-employees"
import { useGetDepartmentsQuery } from "@/lib/store/services/departmentApi"
import { useGetEmployeesQuery } from "@/lib/store/services/employeeApi"

const departmentIcons: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  "Graphic Design Team": Palette,
  "Content Team": Edit2,
  "Artificial Intelligence Team": PartyPopper,
}


export function EmployeeGrid() {
  const { data: deptData } = useGetDepartmentsQuery()
  const { data: empData } = useGetEmployeesQuery()

  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({})

  const toggleSection = (name: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [name]: !prev[name]
    }))
  }

  const departments = deptData?.items || []
  const employees = empData?.items || []

  // Group employees by department
  const groupedDepts = departments.map(dept => {
    const deptEmployees = employees.filter(e => e.departmentId === dept.id)
    return {
      ...dept,
      employees: deptEmployees,
      employeesCount: deptEmployees.length,
      onlineCount: deptEmployees.length, // Simplified for now since we don't have real-time status yet
      color: "#0047FF", // Default color
    }
  }).filter(d => d.employeesCount > 0) // Only show departments with employees on the dashboard

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* 75:2832 - Company Employees Filter Bar */}
      <div className="flex items-center justify-between w-full h-[32px]">
        <h2 className="text-2xl font-bold text-foreground leading-[20px] whitespace-nowrap">Company Employees</h2>

        <div className="flex items-center gap-1.5 h-full overflow-x-auto no-scrollbar">
          {HR_EMPLOYEE_FILTERS.map((filter, i) => (
             <button 
               key={i} 
               className={cn(
                 "rounded-lg text-sm font-bold h-full px-3 transition-all whitespace-nowrap flex items-center justify-center",
                 filter.active ? cn(filter.color, filter.textColor, "shadow-md shadow-primary/10 hover:opacity-90") : cn(filter.color, filter.textColor, "hover:brightness-95")
               )}
             >
                {filter.label}
             </button>
          ))}
        </div>
      </div>

      {/* Departments Grid Sections */}
      <div className="flex flex-col gap-6">
        {groupedDepts.length === 0 && (
          <div className="w-full bg-muted rounded-2xl p-8 flex items-center justify-center">
            <p className="text-muted-foreground font-bold">No employees found. Add employees to see them here.</p>
          </div>
        )}
        
        {groupedDepts.map((dept, i) => {
          // Default to expanded for now since we map them dynamically
          const isExpanded = expandedSections[dept.name] !== false 
          const IconComp = departmentIcons[dept.name] || Palette;
          
          return (
            <div 
              key={i} 
              className="w-full bg-muted rounded-2xl p-4 flex flex-col gap-5 transition-all"
            >

              {/* Section Header Container */}
              <div className="flex items-center justify-between w-full h-[36px]">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-2">
                      <div className="size-[36px] flex items-center justify-center bg-secondary rounded-lg shrink-0">
                          <IconComp 
                            className="size-[14px]" 
                            style={{ color: dept.color }}
                          />
                      </div>
                      <h3 className="font-bold text-lg text-foreground leading-[20px] whitespace-nowrap">{dept.name}</h3>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="bg-primary/10 px-2 py-1 rounded-[6px] h-auto flex items-center justify-center">
                          <span className="text-xs font-bold text-primary leading-[14px]">{dept.employeesCount} Employees</span>
                      </div>
                      <div className="bg-success/10 px-2 py-1 rounded-[6px] h-auto flex items-center justify-center">
                          <span className="text-xs font-bold text-success leading-[14px]">{dept.onlineCount} Online</span>
                      </div>
                    </div>
                </div>

                <button 
                  onClick={() => toggleSection(dept.name)}
                  className="h-[28px] w-9 bg-secondary rounded-lg flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors"
                >
                    <ChevronDown className={cn(
                      "size-4 text-foreground/60 transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )} />
                </button>

              </div>

              {/* Cards Grid (Expanded State) */}
              {isExpanded && dept.employees.length > 0 && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {dept.employees.map((emp, j) => (
                      <EmployeeCard 
                        key={j} 
                        name={emp.fullName || (emp as any).user?.name || "Unknown"}
                        role={emp.jobTitle || (emp as any).role || "Employee"}
                        status="Online"
                        avatar={(emp as any).user?.image || ""}
                        isFreelance={emp.jobTitle?.includes("Freelancer")}
                      />
                    ))}
                 </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
