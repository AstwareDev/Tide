import { MessageDetail } from "@/components/inbox/message-detail";

export default async function ThreadDetailPage({ params }) {
  const { threadId } = await params;
  return <MessageDetail threadId={threadId} />;
}
