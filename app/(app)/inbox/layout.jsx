"use client";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function InboxLayout({ children, detail }) {
  return (
    <PanelGroup direction="horizontal" autoSaveId="inbox-panels" className="flex h-full">
      <Panel defaultSize={28} minSize={22} maxSize={50} className="h-full">
        {children}
      </Panel>
      <PanelResizeHandle className="resize-handle" />
      <Panel minSize={35} className="h-full overflow-hidden">
        {detail}
      </Panel>
    </PanelGroup>
  );
}
