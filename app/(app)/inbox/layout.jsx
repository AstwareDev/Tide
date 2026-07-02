"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { InboxFilterProvider } from "@/components/inbox/inbox-filter-context";
import { LabelFilterSidebar } from "@/components/inbox/label-filter-sidebar";

export default function InboxLayout({ children, detail }) {
  return (
    <InboxFilterProvider>
      <div className="flex h-full">
        <LabelFilterSidebar />
        <PanelGroup direction="horizontal" autoSaveId="inbox-panels" className="flex flex-1 h-full">
          <Panel defaultSize={28} minSize={22} maxSize={50} className="h-full">
            {children}
          </Panel>
          <PanelResizeHandle className="resize-handle" />
          <Panel minSize={35} className="h-full overflow-hidden">
            {detail}
          </Panel>
        </PanelGroup>
      </div>
    </InboxFilterProvider>
  );
}
