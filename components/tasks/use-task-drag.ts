"use client";

import * as React from "react";

/**
 * HTML5 drag-and-drop helpers for the AlMaster Tasks views.
 *
 * Why no `onDragEnter` / `onDragLeave`?
 *  ─────────────────────────────────────
 *  Earlier revisions tracked enter/leave to clear the hover state, but
 *  this fights against children inside the drop target — entering a
 *  chip inside a calendar cell would fire `leave` on the cell even
 *  though we never actually left it. The result was that the drop
 *  event would not fire on the cell because the dragOver / hoveredTarget
 *  state was reset moments before the drop.
 *
 *  This version uses only `onDragOver` (sets hover + preventDefault so
 *  the target accepts the drop) and `onDrop` (commits). Hover state is
 *  cleared on drop or when `onDragEnd` fires on the dragged element.
 *  This is more bulletproof across browsers.
 */
export const TASK_DRAG_MIME = "application/x-task-id";

export function useTaskDrag() {
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [hoveredTarget, setHoveredTarget] = React.useState<string | null>(null);

  /** Forcefully clears the drag/hover state. Use this from custom drop
   * handlers (e.g. the kanban board's reorder flow) so the dragged card
   * doesn't stay faded out when the source DOM node is reparented and
   * `dragend` doesn't fire. */
  const endDrag = React.useCallback(() => {
    setDraggingId(null);
    setHoveredTarget(null);
  }, []);

  const dragHandlers = React.useCallback(
    (taskId: string) => ({
      draggable: true,
      onDragStart: (e: React.DragEvent) => {
        e.dataTransfer.setData(TASK_DRAG_MIME, taskId);
        e.dataTransfer.setData("text/plain", taskId);
        e.dataTransfer.effectAllowed = "move";
        setDraggingId(taskId);
      },
      onDragEnd: () => {
        setDraggingId(null);
        setHoveredTarget(null);
      },
    }),
    []
  );

  const dropHandlers = React.useCallback(
    (targetKey: string, onDrop: (taskId: string) => void) => ({
      onDragOver: (e: React.DragEvent) => {
        // preventDefault is required for the drop event to fire.
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (hoveredTarget !== targetKey) setHoveredTarget(targetKey);
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const id =
          e.dataTransfer.getData(TASK_DRAG_MIME) ||
          e.dataTransfer.getData("text/plain");
        setHoveredTarget(null);
        setDraggingId(null);
        if (id) onDrop(id);
      },
    }),
    [hoveredTarget]
  );

  return {
    draggingId,
    hoveredTarget,
    dragHandlers,
    dropHandlers,
    endDrag,
  };
}
