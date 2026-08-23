"use client";

import * as React from "react";
import {
  Search,
  Download,
  Eye,
  Trash2,
  FileText,
  LayoutGrid,
  List,
  ChevronDown,
  Check,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadDocumentModal } from "./upload-document-modal";
import { DeleteDocumentModal } from "./delete-document-modal";
import { documentCategories, type DocumentCategory } from "./document-panel";

// ─── Mock data ────────────────────────────────────────────────────────────────

export interface DocumentItem {
  id: string;
  name: string;
  author: string;
  fileType: string;
  size: string;
  uploadedAt: string;
  categoryId: string;
}

const DOCUMENTS: DocumentItem[] = [
  {
    id: "1",
    name: "Marketing Notes Jan 2026.docx",
    author: "John Smith",
    fileType: "Word",
    size: "234 KB",
    uploadedAt: "19/2/2026",
    categoryId: "graphic-design",
  },
  {
    id: "2",
    name: "Marketing Notes Jan 2026.docx",
    author: "John Smith",
    fileType: "Word",
    size: "234 KB",
    uploadedAt: "19/2/2026",
    categoryId: "graphic-design",
  },
  {
    id: "3",
    name: "Marketing Notes Jan 2026",
    author: "John Smith",
    fileType: "Word",
    size: "234 KB",
    uploadedAt: "19/2/2026",
    categoryId: "graphic-design",
  },
  {
    id: "4",
    name: "Marketing Notes Jan 2026.docx",
    author: "John Smith",
    fileType: "Word",
    size: "234 KB",
    uploadedAt: "19/2/2026",
    categoryId: "graphic-design",
  },
  {
    id: "5",
    name: "Marketing Notes Jan 2026.docx",
    author: "John Smith",
    fileType: "Word",
    size: "234 KB",
    uploadedAt: "19/2/2026",
    categoryId: "graphic-design",
  },
  {
    id: "6",
    name: "Q1 Budget Report.pdf",
    author: "Sarah Johnson",
    fileType: "PDF",
    size: "1.2 MB",
    uploadedAt: "15/1/2026",
    categoryId: "finance",
  },
  {
    id: "7",
    name: "Brand Guidelines v2.pdf",
    author: "Alice Brown",
    fileType: "PDF",
    size: "4.5 MB",
    uploadedAt: "10/3/2026",
    categoryId: "marketing",
  },
  {
    id: "8",
    name: "API Documentation.docx",
    author: "Mike Chen",
    fileType: "Word",
    size: "890 KB",
    uploadedAt: "5/2/2026",
    categoryId: "programming",
  },
  {
    id: "9",
    name: "AI Research Paper.pdf",
    author: "Dr. Liu",
    fileType: "PDF",
    size: "2.1 MB",
    uploadedAt: "20/2/2026",
    categoryId: "ai",
  },
  {
    id: "10",
    name: "Blog Post Template.docx",
    author: "Emma Davis",
    fileType: "Word",
    size: "120 KB",
    uploadedAt: "8/3/2026",
    categoryId: "content",
  },
];

// ─── Department badge ─────────────────────────────────────────────────────────

function DeptBadge({ category }: { category: DocumentCategory }) {
  return (
    <span
      className="inline-flex items-center px-[8px] py-[4px] rounded-[4px] text-[12px] font-bold font-janna whitespace-nowrap w-fit "
      style={{ backgroundColor: `${category?.color}1A`, color: category?.color }}>
      {category.name}
    </span>
  );
}

// ─── File type filter ─────────────────────────────────────────────────────────

const FILE_TYPES = ["All", "PDF", "Word", "Excel", "PPT"];

function FileTypeFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-[40px] bg-[#F8FAFC] flex items-center gap-[6px] px-[12px] rounded-[8px] hover:bg-[#EDF2F7] transition-colors">
        <span className="text-[12px] font-bold text-[#343434] font-janna">
          File Type {value !== "All" ? `· ${value}` : ""}
        </span>
        <ChevronDown
          className={cn(
            "size-[12px] text-[#707070] transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 bg-white border border-[#EDF2F7] rounded-[12px] shadow-lg p-[6px] flex flex-col gap-[2px] z-50 min-w-[130px]">
          {FILE_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                onChange(type);
                setOpen(false);
              }}
              className="flex items-center justify-between px-[12px] h-[32px] rounded-[8px] hover:bg-[#343434]/10 transition-colors">
              <span className="text-[12px] font-bold text-[#343434] font-janna">
                {type}
              </span>
              {value === type && (
                <Check className="size-[10px] text-[#0047FF]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Grid card ────────────────────────────────────────────────────────────────

function DocumentCard({
  doc,
  category,
  onDelete,
}: {
  doc: DocumentItem;
  category?: DocumentCategory;
  onDelete: (doc: DocumentItem) => void;
}) {
  return (
    <div className="bg-[#EDF2F7] rounded-[8px] flex flex-col p-[12px] gap-[12px]">
      {/* Author + category */}
      <div className="flex items-center justify-between w-full">
        <span className="text-[12px] font-bold text-[#707070] font-janna">
          by: <span className="text-[#0047FF]">{doc.author}</span>
        </span>
        {category && <DeptBadge category={category} />}
      </div>

      {/* File info */}
      <div className="flex items-center gap-[12px] w-full">
        <div className="size-[48px] bg-[rgba(0,71,255,0.1)] rounded-[11px] flex items-center justify-center shrink-0">
          <FileText className="size-[20px] text-[#0047FF]" />
        </div>
        <div className="flex flex-col gap-[6px] flex-1 min-w-0">
          <span className="text-[14px] font-bold text-[#343434] leading-[16px] truncate font-janna">
            {doc.name}
          </span>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#707070] font-janna">
              {doc.fileType} - {doc.size}
            </span>
            <span className="text-[12px] font-bold text-[#707070] font-janna whitespace-nowrap">
              Uploaded: {doc.uploadedAt}
            </span>
          </div>
        </div>
      </div>

      {/* Divider + Actions */}
      <div className="flex flex-col gap-[12px] w-full">
        <div className="h-px bg-[rgba(0,0,0,0.08)] w-full" />
        <div className="flex items-center gap-[6px]">
          <button className="flex-1 h-[36px] bg-[#0047FF] hover:bg-[#0037cc] rounded-[8px] flex items-center justify-center gap-[8px] transition-colors">
            <Download className="size-[12px] text-white" />
            <span className="text-[12px] font-bold text-white font-janna">
              Download
            </span>
          </button>
          <button className="flex-1 h-[36px] bg-[rgba(0,71,255,0.1)] hover:bg-[rgba(0,71,255,0.2)] rounded-[8px] flex items-center justify-center gap-[8px] transition-colors">
            <Eye className="size-[12px] text-[#0047FF]" />
            <span className="text-[12px] font-bold text-[#0047FF] font-janna">
              View
            </span>
          </button>
          <button
            onClick={() => onDelete(doc)}
            className="px-[12px] h-[36px] bg-[rgba(245,80,80,0.1)] hover:bg-[rgba(245,80,80,0.2)] rounded-[8px] flex items-center justify-center transition-colors shrink-0">
            <Trash2 className="size-[12px] text-[#F55050]" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── List / table row ─────────────────────────────────────────────────────────

function DocumentTableHeader() {
  return (
    <div className="grid grid-cols-[2fr_80px_120px_140px_120px_80px_100px] items-center px-[16px] py-[12px] border-b border-[#EDF2F7]">
      {[
        "File Name",
        "Type",
        "Uploader",
        "Department",
        "Upload Date",
        "Size",
        "Actions",
      ].map((h) => (
        <span
          key={h}
          className="text-[14px] font-bold text-[#343434] font-janna">
          {h}
        </span>
      ))}
    </div>
  );
}

function DocumentRow({
  doc,
  category,
  onDelete,
}: {
  doc: DocumentItem;
  category?: DocumentCategory;
  onDelete: (doc: DocumentItem) => void;
}) {
  return (
    <div className="grid grid-cols-[2fr_80px_120px_140px_120px_80px_100px] items-center px-[16px] py-[10px] border-b border-[#EDF2F7] last:border-b-0 hover:bg-[#EDF2F7]/40 transition-colors">
      {/* File name */}
      <div className="flex items-center gap-[8px] min-w-0">
        <div className="size-[24px] bg-[rgba(0,71,255,0.1)] rounded-[5px] flex items-center justify-center shrink-0">
          <FileText className="size-[10px] text-[#0047FF]" />
        </div>
        <span className="text-[14px] font-bold text-[#343434] font-janna truncate">
          {doc.name}
        </span>
      </div>
      {/* Type */}
      <span className="text-[12px] font-bold text-[#707070] font-janna">
        {doc.fileType}
      </span>
      {/* Uploader */}
      <span className="text-[12px] font-bold text-[#0047FF] font-janna truncate">
        {doc.author}
      </span>
      {/* Department */}
      {category ? <DeptBadge category={category} /> : <span />}
      {/* Date */}
      <span className="text-[12px] font-bold text-[#343434] font-janna">
        {doc.uploadedAt}
      </span>
      {/* Size */}
      <span className="text-[12px] font-bold text-[#707070] font-janna">
        {doc.size}
      </span>
      {/* Actions */}
      <div className="flex items-center gap-[4px]">
        <button className="h-[28px] w-[32px] bg-[#0047FF] hover:bg-[#0037cc] rounded-[8px] flex items-center justify-center transition-colors shrink-0">
          <Download className="size-[10px] text-white" />
        </button>
        <button className="h-[28px] w-[32px] bg-[rgba(0,71,255,0.1)] hover:bg-[rgba(0,71,255,0.2)] rounded-[8px] flex items-center justify-center transition-colors shrink-0">
          <Eye className="size-[10px] text-[#0047FF]" />
        </button>
        <button
          onClick={() => onDelete(doc)}
          className="h-[28px] w-[32px] bg-[rgba(245,80,80,0.1)] hover:bg-[rgba(245,80,80,0.2)] rounded-[8px] flex items-center justify-center transition-colors shrink-0">
          <Trash2 className="size-[10px] text-[#F55050]" />
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface DocumentListProps {
  activeCategoryId: string;
}

export function DocumentList({ activeCategoryId }: DocumentListProps) {
  const [search, setSearch] = React.useState("");
  const [fileTypeFilter, setFileTypeFilter] = React.useState("All");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<DocumentItem | null>(
    null,
  );

  const activeCategory = documentCategories.find(
    (c) => c.id === activeCategoryId,
  );
  const isMyDocuments = activeCategoryId === "my-documents";

  const filtered = DOCUMENTS.filter((doc) => {
    const matchesCategory =
      isMyDocuments || doc.categoryId === activeCategoryId;
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.author.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      fileTypeFilter === "All" || doc.fileType === fileTypeFilter;
    return matchesCategory && matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-[28px] pt-[28px] pb-[20px] shrink-0">
        <h1
          className="font-bold text-[22px] leading-[24px] font-janna"
          style={{ color: activeCategory?.color ?? "#0047FF" }}>
          {isMyDocuments
            ? "My Documents"
            : (activeCategory?.name ?? "Documents")}
        </h1>
        <button
          onClick={() => setUploadOpen(true)}
          className="h-[40px] bg-[#0047FF] flex items-center gap-[8px] px-[20px] rounded-[12px] hover:bg-[#0037cc] transition-colors">
          <Upload className="size-[12px] text-white" />
          <span className="text-[12px] font-bold text-white font-janna whitespace-nowrap">
            Upload Document
          </span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-[10px] px-[28px] pb-[20px] shrink-0">
        <div className="flex-1 bg-[#F8FAFC] h-[40px] flex items-center gap-[8px] px-[12px] rounded-[8px]">
          <Search className="size-[12px] text-[#707070] shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Files..."
            className="flex-1 bg-transparent text-[12px] font-bold text-[#343434] placeholder:text-[#707070] outline-none font-janna"
          />
        </div>
        <FileTypeFilter value={fileTypeFilter} onChange={setFileTypeFilter} />
        {/* View toggle */}
        <div className="flex items-center bg-[#F8FAFC] rounded-[8px] p-[4px] gap-[2px]">
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "size-[32px] flex items-center justify-center rounded-[8px] transition-colors",
              viewMode === "list"
                ? "bg-[#0047FF] shadow-sm"
                : "hover:bg-[#EDF2F7]",
            )}>
            <List
              className={cn(
                "size-[14px]",
                viewMode === "list" ? "text-white" : "text-[#343434]",
              )}
            />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "size-[32px] flex items-center justify-center rounded-[8px] transition-colors",
              viewMode === "grid"
                ? "bg-[#0047FF] shadow-sm"
                : "hover:bg-[#EDF2F7]",
            )}>
            <LayoutGrid
              className={cn(
                "size-[14px]",
                viewMode === "grid" ? "text-white" : "text-[#343434]",
              )}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-[28px] pb-[32px]">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-[12px] text-[#707070]">
            <FileText className="size-[40px] opacity-30" />
            <span className="text-[14px] font-bold font-janna">
              No documents found
            </span>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-[12px]">
            {filtered.map((doc) => (
              <DocumentCard
                key={doc.id}
                doc={doc}
                category={documentCategories.find(
                  (c) => c.id === doc.categoryId,
                )}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#F8FAFC] rounded-[8px] overflow-hidden">
            <DocumentTableHeader />
            {filtered.map((doc) => (
              <DocumentRow
                key={doc.id}
                doc={doc}
                category={documentCategories.find(
                  (c) => c.id === doc.categoryId,
                )}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </div>

      <UploadDocumentModal open={uploadOpen} onOpenChange={setUploadOpen} />
      <DeleteDocumentModal
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        documentName={deleteTarget?.name ?? ""}
        onConfirm={() => setDeleteTarget(null)}
      />
    </div>
  );
}
