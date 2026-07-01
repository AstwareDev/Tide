import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ActivityFilterTabs({ value, onChange, agentNames }) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        {agentNames.map((name) => (
          <TabsTrigger key={name} value={name}>
            {name}
          </TabsTrigger>
        ))}
        <TabsTrigger value="error">Errors</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
