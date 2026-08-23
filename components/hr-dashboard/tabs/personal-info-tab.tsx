"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EmployeeValues } from "@/lib/validations/employee";

interface PersonalInfoTabProps {
  form: UseFormReturn<EmployeeValues>;
}

const COUNTRY_CODES = [
  { code: "+966", flag: "🇸🇦", label: "SA" },
  { code: "+20", flag: "🇪🇬", label: "EG" },
  { code: "+971", flag: "🇦🇪", label: "AE" },
  { code: "+1", flag: "🇺🇸", label: "US" },
];

const inputCls =
  "bg-[#EDF2F7] border-none h-[40px] px-[16px] rounded-[8px] text-[12px] text-[#343434] font-bold focus-visible:ring-0 outline-none w-full shadow-none";

const selectTriggerCls =
  "bg-[#EDF2F7] border-none h-[40px] px-[16px] rounded-[8px] text-[12px] font-bold text-[#343434] outline-none w-full shadow-none";

const selectContentCls = "bg-white rounded-[10px] border-[#EDF2F7] shadow-xl p-1";
const selectItemCls = "text-[12px] font-bold py-2.5 focus:bg-[#0047FF]/10 rounded-[6px]";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <Label className="text-[#343434] text-[14px] font-bold leading-[22.4px]">
      {children}
    </Label>
  );
}

function FormField({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-[6px] items-start", className ?? "w-full")}>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography className="text-[#343434] text-[16px] font-bold leading-[22.4px] pt-[4px]">
      {children}
    </Typography>
  );
}

function Divider() {
  return <div className="h-px bg-[#EDF2F7] w-full" />;
}

export function PersonalInfoTab({ form }: PersonalInfoTabProps) {
  const { register, control, formState: { errors } } = form;

  return (
    <div className="flex flex-col gap-[24px] w-full">

      {/* ── Profile Photo ── */}
      <div className="flex flex-col gap-[8px] items-center w-full">
        <Avatar className="size-[96px] ring-4 ring-[#EDF2F7]">
          <AvatarImage src="https://ui.shadcn.com/avatars/02.png" alt="Employee" />
          <AvatarFallback className="text-[20px] font-bold bg-[#EDF2F7] text-[#343434]">JS</AvatarFallback>
        </Avatar>
        <Typography className="text-[#0047FF] text-[13px] font-bold cursor-pointer hover:underline leading-[20px]">
          Change Photo
        </Typography>
      </div>

      <Divider />

      {/* ── Basic Information ── */}
      <SectionTitle>Basic Information</SectionTitle>

      <div className="grid grid-cols-2 gap-[12px]">
        <FormField label="Full Name" className="col-span-2">
          <Input className={inputCls} {...register("fullName")} />
          {errors.fullName && (
            <span className="text-[10px] text-destructive font-bold">{errors.fullName.message}</span>
          )}
        </FormField>

        <FormField label="Email Address" className="col-span-2">
          <Input className={inputCls} type="email" {...register("email")} />
          {errors.email && (
            <span className="text-[10px] text-destructive font-bold">{errors.email.message}</span>
          )}
        </FormField>

        {/* Phone */}
        <FormField label="Phone Number" className="col-span-2">
          <div className="flex gap-[8px] w-full">
            <div className="w-[110px] shrink-0">
              <Controller
                control={control}
                name="countryCode"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value ?? "+966"}>
                    <SelectTrigger className={selectTriggerCls}>
                      <div className="flex items-center gap-[6px]">
                        <span className="text-[14px]">
                          {COUNTRY_CODES.find((c) => c.code === field.value)?.flag ?? "🇸🇦"}
                        </span>
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent className={selectContentCls}>
                      {COUNTRY_CODES.map((c) => (
                        <SelectItem key={c.code} value={c.code} className={selectItemCls}>
                          {c.flag} {c.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <Input className={cn(inputCls, "flex-1")} {...register("phoneNumber")} placeholder="1012 345 678" />
          </div>
        </FormField>

        {/* Birth Date */}
        <FormField label="Date of Birth">
          <Controller
            control={control}
            name="birthDate"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger className="w-full">
                  <div className={cn(
                    "w-full bg-[#EDF2F7] border-none h-[40px] px-[16px] rounded-[8px] flex items-center justify-between font-bold text-[12px] cursor-pointer",
                    field.value ? "text-[#343434]" : "text-[#707070]"
                  )}>
                    {field.value ? format(field.value, "dd/MM/yyyy") : "dd/mm/yyyy"}
                    <CalendarIcon className="size-[12px] text-[#707070]" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-none shadow-2xl" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    captionLayout="dropdown"
                    fromYear={1950}
                    toYear={new Date().getFullYear() - 18}
                    initialFocus
                    className="bg-white rounded-[12px]"
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </FormField>

        {/* Gender */}
        <FormField label="Gender">
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger className={selectTriggerCls}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className={selectContentCls}>
                  <SelectItem value="male" className={selectItemCls}>Male</SelectItem>
                  <SelectItem value="female" className={selectItemCls}>Female</SelectItem>
                  <SelectItem value="other" className={selectItemCls}>Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        {/* Nationality */}
        <FormField label="Nationality">
          <Input className={inputCls} {...register("nationality")} placeholder="e.g. Saudi" />
        </FormField>

        {/* Marital Status */}
        <FormField label="Marital Status">
          <Controller
            control={control}
            name="maritalStatus"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger className={selectTriggerCls}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className={selectContentCls}>
                  <SelectItem value="single" className={selectItemCls}>Single</SelectItem>
                  <SelectItem value="married" className={selectItemCls}>Married</SelectItem>
                  <SelectItem value="divorced" className={selectItemCls}>Divorced</SelectItem>
                  <SelectItem value="widowed" className={selectItemCls}>Widowed</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>

      {/* Personal Address */}
      <FormField label="Home Address">
        <Input className={inputCls} {...register("personalAddress")} placeholder="Street, city, country" />
      </FormField>

      <Divider />

      {/* ── Emergency Contact ── */}
      <SectionTitle>Emergency Contact</SectionTitle>

      <div className="grid grid-cols-2 gap-[12px]">
        <FormField label="Contact Name" className="col-span-2">
          <Input className={inputCls} {...register("emergencyContactName")} placeholder="Full name" />
        </FormField>
        <FormField label="Phone Number">
          <Input className={inputCls} {...register("emergencyContactPhone")} placeholder="+966 ..." />
        </FormField>
        <FormField label="Relationship">
          <Input className={inputCls} {...register("emergencyContactRelation")} placeholder="e.g. Spouse" />
        </FormField>
      </div>
    </div>
  );
}
