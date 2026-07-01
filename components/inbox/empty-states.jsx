import { Mail, ChevronRight, PartyPopper } from "lucide-react";

export function EmptyInbox({ hasQuery }) {
  if (hasQuery) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Mail size={32} strokeWidth={1.25} className="mb-3" />
        <p className="text-sm">No emails match</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
      <PartyPopper size={32} strokeWidth={1.25} className="mb-3" />
      <p className="text-sm font-medium text-muted-foreground">Inbox zero — nice.</p>
    </div>
  );
}

export function EmptyDetail() {
  return (
    <div className="flex-1 flex items-center justify-center text-muted-foreground">
      <div className="text-center">
        <ChevronRight size={32} strokeWidth={1.25} className="mx-auto mb-3" />
        <p className="text-sm">Select an email to preview</p>
      </div>
    </div>
  );
}
