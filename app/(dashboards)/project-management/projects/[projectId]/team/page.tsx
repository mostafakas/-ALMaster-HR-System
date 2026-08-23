"use client";

import * as React from "react";
import SubTabPlaceholder from "@/components/project-management/shared/sub-tab-placeholder";

export default function TeamPage({ params }: { params: Promise<{ projectId: string }> }) {
  const unwrappedParams = React.use(params);
  return <SubTabPlaceholder params={unwrappedParams} title="Team" />;
}
