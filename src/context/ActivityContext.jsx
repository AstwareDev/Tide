import { createContext, useContext, useState, useEffect, useRef } from "react";

const ActivityContext = createContext(null);

const MOCK_ACTIVITY = [
  { id: "1", timestamp: Date.now() - 60000, agentName: "Ads Deleter", emailSubject: "50% off your next order!", emailFrom: "deals@shop.com", action: "delete", reason: "Promotional email from retail store." },
  { id: "2", timestamp: Date.now() - 120000, agentName: "Education Labeler", emailSubject: "Your course completion certificate", emailFrom: "noreply@udemy.com", action: "label", labelApplied: "Education", reason: "Completion certificate from online course platform." },
  { id: "3", timestamp: Date.now() - 240000, agentName: "Stale Security Notifications", emailSubject: "Your password was changed", emailFrom: "security@google.com", action: "delete", reason: "Stale password change confirmation, no action required." },
  { id: "4", timestamp: Date.now() - 480000, agentName: "Ads Deleter", emailSubject: "New arrivals just for you", emailFrom: "hello@zara.com", action: "delete", reason: "Fashion retailer marketing email." },
  { id: "5", timestamp: Date.now() - 900000, agentName: "Education Labeler", emailSubject: "Week 3 assignment due Friday", emailFrom: "cs101@mit.edu", action: "label", labelApplied: "Education", reason: "Assignment reminder from university course." },
];

export function ActivityProvider({ children }) {
  const [entries, setEntries] = useState(MOCK_ACTIVITY);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (window.api?.onActivityPush) {
      cleanupRef.current = window.api.onActivityPush((entry) => {
        setEntries((prev) => [entry, ...prev].slice(0, 200));
      });
    }
    return () => cleanupRef.current?.();
  }, []);

  const addEntry = (entry) => {
    setEntries((prev) => [{ ...entry, id: crypto.randomUUID(), timestamp: Date.now() }, ...prev].slice(0, 200));
  };

  return (
    <ActivityContext.Provider value={{ entries, addEntry }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  return useContext(ActivityContext);
}
