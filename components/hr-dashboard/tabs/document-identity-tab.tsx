"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/typography";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FileUpload } from "@/components/ui/file-upload";
import { EmployeeValues } from "@/lib/validations/employee";

interface DocumentIdentityTabProps {
  form: UseFormReturn<EmployeeValues>;
}

const inputCls =
  "bg-[#EDF2F7] border-none h-[40px] px-[16px] rounded-[8px] text-[12px] text-[#343434] font-bold focus-visible:ring-0 outline-none w-full shadow-none";

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

function DatePickerField({ value, onChange }: { value?: Date; onChange: (d: Date | undefined) => void }) {
  return (
    <Popover>
      <PopoverTrigger className="w-full">
        <div className={cn(
          "w-full bg-[#EDF2F7] border-none h-[40px] px-[16px] rounded-[8px] flex items-center justify-between font-bold text-[12px] cursor-pointer",
          value ? "text-[#343434]" : "text-[#707070]"
        )}>
          {value ? format(value, "dd/MM/yyyy") : "dd/mm/yyyy"}
          <CalendarIcon className="size-[12px] text-[#707070]" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none shadow-2xl" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className="bg-white rounded-[12px]"
        />
      </PopoverContent>
    </Popover>
  );
}

export function DocumentIdentityTab({ form }: DocumentIdentityTabProps) {
  const { register, control } = form;

  return (
    <div className="flex flex-col gap-[24px] w-full">
      {/* ── National ID ── */}
      <SectionTitle>National ID</SectionTitle>
      
      <div className="grid grid-cols-2 gap-[12px]">
        <FormField label="ID Number">
          <Input className={inputCls} {...register("nationalIdNumber")} placeholder="1234567890" />
        </FormField>
        
        <FormField label="Expiry Date">
          <Controller
            control={control}
            name="nationalIdExpiry"
            render={({ field }) => (
              <DatePickerField value={field.value} onChange={field.onChange} />
            )}
          />
        </FormField>
        
        <FileUpload
           label="ID Front Copy"
           hint="Upload a clear image of the front side (Max 5MB)"
           className="col-span-2"
           onChange={(file) => {
              // In a real app, upload the file and set the returned URL to the form field.
              // We'll just simulate it for now.
              if (file) {
                 form.setValue("nationalIdFrontFile", "uploaded_front.jpg");
              } else {
                 form.setValue("nationalIdFrontFile", "");
              }
           }}
        />
        
        <FileUpload
           label="ID Back Copy"
           hint="Upload a clear image of the back side (Max 5MB)"
           className="col-span-2"
           onChange={(file) => {
              if (file) {
                 form.setValue("nationalIdBackFile", "uploaded_back.jpg");
              } else {
                 form.setValue("nationalIdBackFile", "");
              }
           }}
        />
      </div>

      <Divider />

      {/* ── Passport ── */}
      <SectionTitle>Passport Details</SectionTitle>
      
      <div className="grid grid-cols-2 gap-[12px]">
        <FormField label="Passport Number">
          <Input className={inputCls} {...register("passportNumber")} placeholder="A1234567" />
        </FormField>
        
        <FormField label="Expiry Date">
          <Controller
            control={control}
            name="passportExpiry"
            render={({ field }) => (
              <DatePickerField value={field.value} onChange={field.onChange} />
            )}
          />
        </FormField>
        
        <FileUpload
           label="Passport Copy"
           hint="Upload a clear scanned copy of the passport (Max 5MB)"
           className="col-span-2"
           onChange={(file) => {
              if (file) {
                 form.setValue("passportFile", "uploaded_passport.pdf");
              } else {
                 form.setValue("passportFile", "");
              }
           }}
        />
      </div>

      <Divider />

      {/* ── Driver's License ── */}
      <SectionTitle>Driving License</SectionTitle>
      
      <div className="grid grid-cols-2 gap-[12px]">
        <FormField label="License Number">
          <Input className={inputCls} {...register("drivingLicenseNumber")} placeholder="DL-12345678" />
        </FormField>
        
        <FormField label="Expiry Date">
          <Controller
            control={control}
            name="drivingLicenseExpiry"
            render={({ field }) => (
              <DatePickerField value={field.value} onChange={field.onChange} />
            )}
          />
        </FormField>
      </div>

      <Divider />
      
      {/* ── Employment Contract ── */}
      <SectionTitle>Employment Contract</SectionTitle>
      
      <FileUpload
         label="Signed Contract Copy"
         accept=".pdf,.doc,.docx"
         hint="Upload the signed employment contract in PDF or DOC format (Max 10MB)"
         onChange={(file) => {
            if (file) {
               form.setValue("contractFile", "uploaded_contract.pdf");
            } else {
               form.setValue("contractFile", "");
            }
         }}
      />
    </div>
  );
}
