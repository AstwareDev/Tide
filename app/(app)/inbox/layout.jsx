export default function InboxLayout({ children, detail }) {
  return (
    <div className="flex h-full">
      {children}
      {detail}
    </div>
  );
}
