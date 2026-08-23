"use client";

import * as React from "react";
import { X, Upload, ChevronDown } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { documentSchema, type DocumentValues } from "@/lib/validations/document";
import { documentCategories } from "./document-panel";

// ─── Folder dropdown ──────────────────────────────────────────────────────────

const folderCategories = documentCategories.filter((c) => c.id !== "my-documents");

function FolderDropdown({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const selected = folderCategories.find((c) => c.id === value) ?? null;

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "bg-[#edf2f7] h-[40px] w-full flex items-center justify-between px-[16px] rounded-[8px] transition-all",
          error && "ring-1 ring-[#f55050]",
        )}>
        {selected ? (
          <div className="flex items-center gap-[8px]">
            <selected.icon className="size-[13px] shrink-0" style={{ color: selected.color }} />
            <span className="text-[12px] font-bold font-janna" style={{ color: selected.color }}>
              {selected.name}
            </span>
          </div>
        ) : (
          <span className="text-[12px] font-bold font-janna text-[#707070]">Select a folder</span>
        )}
        <ChevronDown className={cn("size-[14px] text-[#707070] transition-transform shrink-0", open && "rotate-180")} />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-[12px] shadow-lg border border-[#EDF2F7] z-50 p-[6px] flex flex-col gap-[2px]">
          {folderCategories.map((cat) => {
            const isSelected = value === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => { onChange(cat.id); setOpen(false); }}
                className="w-full flex items-center gap-[10px] px-[12px] h-[40px] rounded-[8px] transition-colors"
                style={{ backgroundColor: isSelected ? `${cat.color}1A` : undefined }}
                onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = `${cat.color}1A`; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = ""; }}>
                <cat.icon className="size-[14px] shrink-0" style={{ color: cat.color }} />
                <span className="text-[13px] font-bold font-janna" style={{ color: cat.color }}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface UploadDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UploadDocumentModal({ open, onOpenChange }: UploadDocumentModalProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DocumentValues>({
    resolver: zodResolver(documentSchema),
    defaultValues: { file: "", name: "", departmentFolder: "" },
  });

  React.useEffect(() => {
    if (!open) { reset(); setFileName(null); }
  }, [open, reset]);

  function handleFile(file: File) {
    setFileName(file.name);
    setValue("file", file.name, { shouldValidate: true });
    // auto-fill file name field if empty
    setValue("name", file.name.replace(/\.[^.]+$/, ""), { shouldValidate: true });
  }

  const onSubmit: SubmitHandler<DocumentValues> = async (data) => {
    console.log("Uploading document:", data);
    reset();
    setFileName(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-[#343434]/60 backdrop-blur-[20px]" />
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[507px] max-w-[507px] p-0 gap-0 overflow-visible border-none rounded-[16px] bg-[#f8fafc] shadow-2xl">

        <div className="flex flex-col gap-[24px] p-[28px]">
          {/* Header */}
          <div className="flex items-start justify-between w-full">
            <div className="flex flex-col gap-[4px]">
              <p className="font-bold text-[20px] text-[#343434] leading-[22.4px] font-janna">
                Upload Document
              </p>
              <p className="font-bold text-[14px] text-[#707070] leading-[22.4px] font-janna">
                Share a new document with your mates
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="bg-[#edf2f7] size-[36px] rounded-full flex items-center justify-center hover:bg-[#e2e8f0] transition-colors shrink-0">
              <X className="size-[18px] text-[#343434]" strokeWidth={2.5} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-[40px]">
            <div className="flex flex-col gap-[12px]">

              {/* File upload area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleFile(file);
                }}
                className={cn(
                  "w-full h-[169px] border border-dashed border-[#707070] rounded-[12px] flex flex-col items-center justify-center gap-[16px] cursor-pointer transition-colors",
                  isDragging && "bg-[#0047FF]/5 border-[#0047FF]",
                  errors.file && "border-[#f55050]",
                )}>
                <Upload className="size-[24px] text-[#707070]" strokeWidth={1.5} />
                <div className="flex flex-col items-center gap-[2px]">
                  <span className="text-[14px] font-bold text-[#343434] font-janna leading-[22.4px]">
                    {fileName ?? "Click to upload or drage and drop"}
                  </span>
                  <span className="text-[12px] font-bold text-[#707070] font-janna leading-[22.4px]">
                    PDF, Word, Excel, Images (max. 50MB)
                  </span>
                </div>
              </div>
              {errors.file && (
                <span className="text-[10px] font-bold text-[#f55050] font-janna text-right -mt-[8px]">
                  {errors.file.message}
                </span>
              )}
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />

              {/* File Name */}
              <div className="flex flex-col gap-[6px] w-full">
                <label className="font-bold text-[14px] text-[#343434] leading-[22.4px] font-janna">
                  File Name
                </label>
                <input
                  placeholder="Enter file name"
                  className={cn(
                    "bg-[#edf2f7] h-[40px] px-[16px] rounded-[8px] text-[12px] font-bold text-[#343434] placeholder:text-[#707070] font-janna outline-none w-full transition-all",
                    errors.name && "ring-1 ring-[#f55050]",
                  )}
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-[10px] font-bold text-[#f55050] font-janna text-right">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Destination Department Folder */}
              <div className="flex flex-col gap-[6px] w-full">
                <label className="font-bold text-[16px] text-[#343434] leading-[22.4px] font-janna">
                  Destination Department Folder
                </label>
                <Controller
                  control={control}
                  name="departmentFolder"
                  render={({ field }) => (
                    <FolderDropdown
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.departmentFolder?.message}
                    />
                  )}
                />
                {errors.departmentFolder && (
                  <span className="text-[10px] font-bold text-[#f55050] font-janna text-right">
                    {errors.departmentFolder.message}
                  </span>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-[8px] w-full">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="bg-[#edf2f7] hover:bg-[#e2e8f0] h-[40px] px-[20px] rounded-[12px] font-bold text-[12px] text-[#343434] font-janna transition-colors shrink-0">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#0047ff] hover:bg-[#0037cc] h-[40px] px-[20px] rounded-[12px] font-bold text-[12px] text-white font-janna flex items-center justify-center gap-[8px] transition-all active:scale-[0.98]">
                <Upload className="size-[12px]" />
                Upload Document
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
