"use client";

import { usePathname, useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { InboxFilterProvider } from "@/components/inbox/inbox-filter-context";
import { LabelFilterSidebar } from "@/components/inbox/label-filter-sidebar";

export default function InboxLayout({ children, detail }) {
  const pathname = usePathname();
  const router = useRouter();
  const threadOpen = /^\/inbox\/[^/]+/.test(pathname || "");

  return (
    <InboxFilterProvider>
      <div className="flex h-full">
        <LabelFilterSidebar />
        <div className="flex-1 h-full overflow-hidden">{children}</div>
      </div>
      <Dialog open={threadOpen} onOpenChange={(open) => !open && router.push("/inbox")}>
        <DialogContent showClose={false} className="max-w-3xl w-full h-[85vh] p-0 flex flex-col overflow-hidden">
          {detail}
        </DialogContent>
      </Dialog>
    </InboxFilterProvider>
  );
}
