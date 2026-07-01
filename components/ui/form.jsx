"use client";

import * as React from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const Form = FormProvider;

const FormFieldContext = React.createContext(null);

function FormField({ name, ...props }) {
  return (
    <FormFieldContext.Provider value={{ name }}>
      <Controller name={name} {...props} />
    </FormFieldContext.Provider>
  );
}

function useFormField() {
  const fieldContext = React.useContext(FormFieldContext);
  const { formState } = useFormContext();
  const error = formState.errors[fieldContext.name];
  return { name: fieldContext.name, error };
}

function FormItem({ className, ...props }) {
  return <div className={cn("space-y-1.5", className)} {...props} />;
}

function FormLabel({ className, ...props }) {
  const { error } = useFormField();
  return <Label className={cn(error && "text-red-400", className)} {...props} />;
}

function FormControl({ ...props }) {
  return <div {...props} />;
}

function FormMessage({ className, children, ...props }) {
  const { error } = useFormField();
  const body = error ? String(error?.message ?? "") : children;
  if (!body) return null;
  return (
    <p className={cn("text-xs text-red-400", className)} {...props}>
      {body}
    </p>
  );
}

export { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, useFormField };
