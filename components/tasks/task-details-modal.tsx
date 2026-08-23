"use client";

import * as React from "react";
import {
  X,
  Check,
  Smile,
  Paperclip,
  Send,
  File as FileIcon,
} from "lucide-react";
import { Edit2 } from "@/components/shared/icons";
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  TASK_DEPARTMENT_META,
  TASK_PRIORITY_META,
  TASK_PROJECT_LABELS,
  TASK_STATUS_META,
  TASK_WEIGHT_LABELS,
  type TaskComment,
  type TaskRecord,
} from "@/lib/types/task";

export interface TaskDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskRecord | null;
  onEdit?: (task: TaskRecord) => void;
  onMarkAsDone?: (task: TaskRecord) => void;
}

/**
 * Read mode for a task with side-by-side details and threaded comments
 * (Figma details modal). Closing returns to the underlying view; "Edit"
 * hands off to the SetTaskModal in edit mode.
 */
export function TaskDetailsModal({
  open,
  onOpenChange,
  task,
  onEdit,
  onMarkAsDone,
}: TaskDetailsModalProps) {
  const [comments, setComments] = React.useState<TaskComment[]>([]);
  const [draft, setDraft] = React.useState("");

  React.useEffect(() => {
    if (task) setComments(task.comments ?? []);
  }, [task]);

  if (!task) return null;

  const status = TASK_STATUS_META[task.status];
  const department = TASK_DEPARTMENT_META[task.department];
  const priority = TASK_PRIORITY_META[task.priority];
  const formattedDate = (() => {
    try {
      return format(parseISO(task.dueDate), "d/M/yyyy");
    } catch {
      return task.dueDate;
    }
  })();

  const handleSend = () => {
    if (!draft.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        authorId: "me",
        authorName: "Daniel Brown",
        authorRole: "Content Writer",
        authorAvatar: "https://ui.shadcn.com/avatars/01.png",
        content: draft.trim(),
        createdAt: format(new Date(), "h:mm a"),
      },
    ]);
    setDraft("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-foreground/60 backdrop-blur-[2px]" />
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[960px] max-w-[960px] w-[95vw] p-0 gap-0 overflow-hidden border-none rounded-[16px] bg-[#f8fafc] shadow-2xl flex flex-col max-h-[92vh]"
      >
        {/* Top Header Bar */}
        <div className="px-7 py-5 flex items-center justify-between gap-4 shrink-0 border-b border-border">
          <div className="flex items-center gap-3 min-w-0">
            <Typography className="text-foreground text-[20px] font-bold leading-[22.4px] truncate">
              {task.title}
            </Typography>
            <div
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px]",
                status.tintBg,
                status.tintFg
              )}
            >
              <Typography className="text-[12px] font-bold leading-[14px]">
                {status.label}
              </Typography>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-secondary size-9 rounded-full flex items-center justify-center hover:bg-secondary/80 transition-colors outline-none"
          >
            <X className="size-4 text-foreground/70" strokeWidth={2.5} />
          </button>
        </div>

        {/* Content Body Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden">
          {/* Left Column: Details & Attachments & Action Buttons */}
          <div className="md:col-span-7 border-r border-border overflow-y-auto no-scrollbar p-7 flex flex-col gap-6 min-h-0 justify-between">
            <div className="flex flex-col gap-6">
              <Section title="Description">
                <Typography className="text-muted-foreground text-[14px] leading-[20px] font-normal">
                  {task.description}
                </Typography>
              </Section>

              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <Section title="Due Date">
                  <Typography className="text-foreground text-[14px] font-bold tabular-nums">
                    {formattedDate}
                  </Typography>
                </Section>
                <Section title="Priority">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-[#f55050]" />
                    <Typography className="text-[#f55050] text-[14px] font-bold">
                      {priority.label}
                    </Typography>
                  </div>
                </Section>
                <Section title="Project">
                  <Typography className="text-foreground text-[14px] font-bold">
                    {TASK_PROJECT_LABELS[task.project]}
                  </Typography>
                </Section>
                <Section title="Cost">
                  <Typography className="text-foreground text-[14px] font-bold tabular-nums">
                    {task.cost ? `${task.cost.toLocaleString()} EGP` : "—"}
                  </Typography>
                </Section>
                <Section title="Assigned by">
                  <MemberPill
                    name={task.createdBy.name}
                    avatar={task.createdBy.avatar}
                  />
                </Section>
                <Section title="Assigned to">
                  <MemberPill
                    name={task.assignees[0]?.name ?? "—"}
                    avatar={task.assignees[0]?.avatar}
                    suffix={task.assignees[0]?.name === "Daniel Brown" ? " (You)" : ""}
                  />
                </Section>
                <Section title="Weight">
                  <Typography className="text-primary text-[14px] font-bold">
                    {TASK_WEIGHT_LABELS[task.weight]}
                  </Typography>
                </Section>
                <Section title="Department">
                  <div className="inline-flex items-center bg-[#f55050] px-2.5 py-1 rounded-[4px]">
                    <Typography className="text-[12px] font-bold text-white">
                      {department.label}
                    </Typography>
                  </div>
                </Section>
              </div>

              {task.attachments && task.attachments.length > 0 && (
                <Section title="Attachments">
                  <div className="flex flex-col gap-2.5">
                    {task.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between bg-[#edf2f7] rounded-[8px] p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-12 rounded-[10px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <FileIcon className="size-5" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <Typography className="text-foreground text-[14px] font-bold leading-none">
                              {att.name}
                            </Typography>
                            <Typography className="text-muted-foreground text-[12px] font-bold leading-none">
                              {att.type.toUpperCase()} - {att.size}
                            </Typography>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            className="size-8 rounded-[8px] bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
                          >
                            <Send className="size-3.5 rotate-90" />
                          </button>
                          <button
                            type="button"
                            className="size-8 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>

            {/* Left Column Action Buttons */}
            <div className="flex items-center gap-3 pt-4 border-t border-border/50">
              <Button
                variant="ghost"
                onClick={() => onEdit?.(task)}
                className="bg-secondary hover:bg-secondary/80 h-11 px-5 rounded-[10px] text-foreground text-[14px] font-bold flex items-center gap-2"
              >
                <Edit2 className="size-4 text-muted-foreground" />
                Edit
              </Button>
              <Button
                onClick={() => onMarkAsDone?.(task)}
                className="bg-primary hover:bg-primary/90 h-11 px-6 flex-1 rounded-[10px] text-white text-[14px] font-bold flex items-center justify-center gap-2"
              >
                <Check className="size-4" strokeWidth={3} />
                Mark Task as Done
              </Button>
            </div>
          </div>

          {/* Right Column: Comments Area */}
          <div className="md:col-span-5 overflow-y-auto no-scrollbar p-7 flex flex-col gap-4 min-h-0 bg-[#edf2f7]/50">
            <Typography className="text-foreground text-[18px] font-bold">
              Comments ({comments.length})
            </Typography>

            <div className="flex flex-col gap-4 flex-1 overflow-y-auto no-scrollbar pr-1">
              {comments.length === 0 && (
                <Typography className="text-muted-foreground text-[13px]">
                  No comments yet.
                </Typography>
              )}
              {comments.map((comment) => (
                <CommentBubble key={comment.id} comment={comment} />
              ))}
            </div>

            {/* Bottom Input Field Bar */}
            <div className="mt-auto pt-2">
              <div className="flex items-center gap-2">
                <div className="bg-background border-2 border-primary rounded-[10px] flex items-center gap-2 px-3 py-2 flex-1 shadow-sm">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    className="bg-transparent border-none outline-none text-[14px] font-bold text-foreground placeholder:text-muted-foreground flex-1"
                    placeholder="OK|"
                  />
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Smile className="size-5" />
                  </button>
                </div>
                <button
                  type="button"
                  className="size-11 rounded-[10px] bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors flex items-center justify-center shrink-0"
                >
                  <Paperclip className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  className="size-11 rounded-[10px] bg-primary hover:bg-primary/90 text-white transition-colors flex items-center justify-center shrink-0"
                >
                  <Send className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Typography className="text-foreground text-[16px] font-bold leading-none">
        {title}
      </Typography>
      {children}
    </div>
  );
}

function MemberPill({
  name,
  avatar,
  suffix,
}: {
  name: string;
  avatar?: string;
  suffix?: string;
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <Avatar className="size-8 rounded-full border border-background shadow-sm">
        <AvatarImage src={avatar} />
        <AvatarFallback className="text-[10px] font-bold">{name[0]}</AvatarFallback>
      </Avatar>
      <Typography className="text-foreground text-[14px] font-bold">
        {name}
        {suffix}
      </Typography>
    </div>
  );
}

function CommentBubble({ comment }: { comment: TaskComment }) {
  const isMe = comment.authorId === "u1" || comment.authorId === "me";
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <Avatar className="size-7 rounded-full">
          <AvatarImage src={comment.authorAvatar} />
          <AvatarFallback className="text-[10px] font-bold">
            {comment.authorName[0]}
          </AvatarFallback>
        </Avatar>
        <Typography className="text-foreground text-[13px] font-bold">
          {comment.authorName}
        </Typography>
        {comment.authorRole && (
          <Typography className="text-primary text-[12px] font-bold">
            [{comment.authorRole}]
          </Typography>
        )}
      </div>
      <div
        className={cn(
          "rounded-[12px] px-4 py-3 text-[14px] font-bold leading-[20px]",
          isMe
            ? "bg-primary text-white self-end ml-9"
            : "bg-background text-foreground self-start ml-9 shadow-sm"
        )}
      >
        {comment.content}
      </div>
      <Typography
        className={cn(
          "text-muted-foreground text-[11px] font-bold",
          isMe ? "self-end" : "self-start ml-9"
        )}
      >
        {comment.createdAt}
      </Typography>
    </div>
  );
}
