import React, { createContext, useContext, useId } from "react";
import {
    Controller,
    FormProvider,
    useFormContext,
    useFormState,
    type ControllerProps,
    type FieldPath,
    type FieldValues,
} from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";

const FormFieldContext = createContext<{ name: string }>({} as any);
const FormItemContext = createContext<{ id: string }>({} as any);

export const Form = FormProvider;

export function FormField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>(props: ControllerProps<TFieldValues, TName>) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}

export function useFormField() {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  return {
    id: itemContext.id,
    name: fieldContext.name,
    error: fieldState.error,
  };
}

export function FormItem({ children }: { children: React.ReactNode }) {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <View style={styles.item}>{children}</View>
    </FormItemContext.Provider>
  );
}


export function FormLabel({ children }: { children: React.ReactNode }) {
  const { error } = useFormField();

  return (
    <Text style={[styles.label, error && styles.labelError]}>
      {children}
    </Text>
  );
}


export function FormControl({ children }: { children: React.ReactNode }) {
  return <View>{children}</View>;
}


export function FormDescription({ children }: { children: React.ReactNode }) {
  return <Text style={styles.description}>{children}</Text>;
}


export function FormMessage() {
  const { error } = useFormField();

  if (!error?.message) return null;

  return <Text style={styles.error}>{String(error.message)}</Text>;
}


const styles = StyleSheet.create({
  item: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "#111",
  },
  labelError: {
    color: "red",
  },
  description: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  error: {
    fontSize: 12,
    color: "red",
    marginTop: 4,
  },
});