"use client"

import * as React from "react"
import { Palette, Edit2, PartyPopper } from "lucide-react"
import { ScreenCard } from "./screen-card"
import { DepartmentHeader } from "@/components/hr-dashboard/departments/department-header"
import type { EmployeeStatus as TrackingStatus } from "@/components/ui/status-dropdown"

interface EmployeeTracking {
  name: string
  role: string
  status: TrackingStatus
  avatar?: string
  screenshotUrl?: string
  screenSharingOff?: boolean
}

interface Department {
  name: string
  employeesCount: number
  onlineCount: number
  icon: React.ElementType
  employees: EmployeeTracking[]
}

const TIME = "12:08:56 PM"

const departments: Department[] = [
  {
    name: "Graphic Design Team",
    employeesCount: 3,
    onlineCount: 1,
    icon: Palette,
    employees: [
      {
        name: "Daniel Brown",
        role: "Company Super Admin",
        status: "Online",
        avatar: "https://ui.shadcn.com/avatars/01.png",
        screenshotUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
      },
      {
        name: "Daniel Brown",
        role: "Company Super Admin",
        status: "Online",
        avatar: "https://ui.shadcn.com/avatars/01.png",
        screenshotUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      },
      {
        name: "Daniel Brown",
        role: "Company Super Admin",
        status: "Online",
        avatar: "https://ui.shadcn.com/avatars/01.png",
        screenshotUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80",
      },
      {
        name: "John Smith",
        role: "Graphic Designer",
        status: "Offline",
        avatar: "https://ui.shadcn.com/avatars/02.png",
        screenSharingOff: true,
      },
      {
        name: "Daniel Brown",
        role: "Company Super Admin",
        status: "Online",
        avatar: "https://ui.shadcn.com/avatars/01.png",
        screenshotUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
      },
    ],
  },
  {
    name: "Content Team",
    employeesCount: 4,
    onlineCount: 2,
    icon: Edit2,
    employees: [
      {
        name: "Daniel Brown",
        role: "Company Super Admin",
        status: "Meeting",
        avatar: "https://ui.shadcn.com/avatars/01.png",
        screenshotUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80",
      },
      {
        name: "Daniel Brown",
        role: "Company Super Admin",
        status: "Online",
        avatar: "https://ui.shadcn.com/avatars/01.png",
        screenshotUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      },
    ],
  },
  {
    name: "Artificial Intelligence Team",
    employeesCount: 3,
    onlineCount: 2,
    icon: PartyPopper,
    employees: [],
  },
]

export function TrackingGrid() {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    "Graphic Design Team": true,
    "Content Team": true,
    "Artificial Intelligence Team": false,
  })

  const toggleSection = (name: string) => {
    setExpandedSections((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div className="flex flex-col gap-[20px]">
      {departments.map((dept, i) => {
        const isExpanded = expandedSections[dept.name]
        return (
          <div
            key={i}
            className="w-full bg-[#f8fafc] rounded-[16px] p-[16px] flex flex-col gap-[20px] transition-all"
          >
            {/* Section Header */}
            <DepartmentHeader
              name={dept.name}
              icon={dept.icon}
              employeesCount={dept.employeesCount}
              onlineCount={dept.onlineCount}
              isExpanded={isExpanded}
              onToggle={() => toggleSection(dept.name)}
            />

            {/* Cards Grid */}
            {isExpanded && dept.employees.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[12px] w-full">
                {dept.employees.map((emp, j) => (
                  <ScreenCard key={j} {...emp} time={TIME} />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

