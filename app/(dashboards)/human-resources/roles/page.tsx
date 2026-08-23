"use client";

import { RolePanel, rolesData } from "@/components/hr-dashboard/roles/role-panel";
import { RoleDetails } from "@/components/hr-dashboard/roles/role-details";
import { CreateRoleModal } from "@/components/hr-dashboard/roles/create-role-modal";
import { EditRoleModal } from "@/components/hr-dashboard/roles/edit-role-modal";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { openModal, closeModal } from "@/lib/store/slices/ui-slice";

export default function RolesPage() {
  const dispatch = useAppDispatch();
  const activeRoleId = useAppSelector((state) => state.roles.activeRoleId);
  const activeModal = useAppSelector((state) => state.ui.activeModal);

  const activeRole = rolesData.find((r) => r.id === activeRoleId) ?? rolesData[0];

  return (
    <>
      <RolePanel />

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10">
        <RoleDetails
          role={activeRole}
          onEdit={() => dispatch(openModal("edit-role"))}
        />
      </main>

      <CreateRoleModal
        open={activeModal === "create-role"}
        onOpenChange={(open) =>
          open ? dispatch(openModal("create-role")) : dispatch(closeModal())
        }
      />
      <EditRoleModal
        open={activeModal === "edit-role"}
        onOpenChange={(open) =>
          open ? dispatch(openModal("edit-role")) : dispatch(closeModal())
        }
        role={activeRole}
      />
    </>
  );
}
