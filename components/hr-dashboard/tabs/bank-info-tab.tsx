"use client";

import * as React from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeValues } from "@/lib/validations/employee";

interface BankInfoTabProps {
  form: UseFormReturn<EmployeeValues>;
}

const inputCls =
  "bg-[#EDF2F7] border-none h-[40px] px-[16px] rounded-[8px] text-[12px] text-[#343434] font-bold focus-visible:ring-0 outline-none w-full shadow-none";

const selectTriggerCls =
  "bg-[#EDF2F7] border-none h-[40px] px-[16px] rounded-[8px] text-[12px] font-bold text-[#343434] outline-none w-full shadow-none";

const selectContentCls = "bg-white rounded-[10px] border-[#EDF2F7] shadow-xl p-1";
const selectItemCls = "text-[12px] font-bold py-2.5 focus:bg-[#0047FF]/10 rounded-[6px]";

function FormField({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-[6px] items-start", className ?? "w-full")}>
      <Label className="text-[#343434] text-[14px] font-bold leading-[22.4px]">{label}</Label>
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

export function BankInfoTab({ form }: BankInfoTabProps) {
  const { register, control } = form;

  return (
    <div className="flex flex-col gap-[24px] w-full">
      {/* ── Salary Info ── */}
      <SectionTitle>Salary Details</SectionTitle>

      <div className="grid grid-cols-2 gap-[12px]">
        {/* Currency */}
        <FormField label="Currency">
          <Controller
            control={control}
            name="currency"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger className={selectTriggerCls}>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className={selectContentCls}>
                  <SelectItem value="sar" className={selectItemCls}>SAR - Saudi Riyal</SelectItem>
                  <SelectItem value="usd" className={selectItemCls}>USD - US Dollar</SelectItem>
                  <SelectItem value="eur" className={selectItemCls}>EUR - Euro</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        {/* Salary */}
        <FormField label="Salary Amount">
          <Input type="number" className={inputCls} {...register("salary")} placeholder="e.g. 5000" />
        </FormField>

        {/* Salary Transfer Day */}
        <FormField label="Salary Transfer Day">
           <Controller
            control={control}
            name="salaryDay"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger className={selectTriggerCls}>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent className={selectContentCls}>
                  <SelectItem value="1" className={selectItemCls}>1st of month</SelectItem>
                  <SelectItem value="25" className={selectItemCls}>25th of month</SelectItem>
                  <SelectItem value="28" className={selectItemCls}>28th of month</SelectItem>
                  <SelectItem value="last" className={selectItemCls}>Last day of month</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>

      <Divider />

      {/* ── Bank Account Info ── */}
      <SectionTitle>Bank Account Details</SectionTitle>

      <div className="grid grid-cols-2 gap-[12px]">
        <FormField label="Bank Name" className="col-span-2">
          <Input className={inputCls} {...register("bankName")} placeholder="e.g. Al Rajhi Bank" />
        </FormField>

        <FormField label="Bank Branch" className="col-span-2">
          <Input className={inputCls} {...register("bankBranch")} placeholder="e.g. Olaya Branch" />
        </FormField>

        <FormField label="Account Holder Name" className="col-span-2">
          <Input className={inputCls} {...register("accountHolderName")} placeholder="John Smith" />
        </FormField>

        <FormField label="IBAN Number" className="col-span-2">
          <Input className={inputCls} {...register("iban")} placeholder="SA00 0000 0000 0000 0000 0000" />
        </FormField>
        
        <FormField label="SWIFT Code" className="col-span-2">
          <Input className={inputCls} {...register("swiftCode")} placeholder="e.g. RJHISAXX" />
        </FormField>
      </div>
    </div>
  );
}
