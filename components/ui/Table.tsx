import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type TableProps = {
  children: React.ReactNode;
  className?: any;
};

export function Table({ children, className }: TableProps) {
  return (
    <ScrollView horizontal style={[styles.container, className]}>
      <View>{children}</View>
    </ScrollView>
  );
}

export function TableHeader({ children, className }: TableProps) {
  return <View style={[styles.header, className]}>{children}</View>;
}

export function TableBody({ children, className }: TableProps) {
  return <View style={[styles.body, className]}>{children}</View>;
}

export function TableFooter({ children, className }: TableProps) {
  return <View style={[styles.footer, className]}>{children}</View>;
}

type TableRowProps = {
  children: React.ReactNode;
  selected?: boolean;
  className?: any;
};

export function TableRow({ children, selected, className }: TableRowProps) {
  return (
    <View
      style={[
        styles.row,
        selected && styles.rowSelected,
        className,
      ]}
    >
      {children}
    </View>
  );
}

type TableCellProps = {
  children: React.ReactNode;
  isHeader?: boolean;
  className?: any;
  width?: number | string;
};

export function TableCell({ children, isHeader, width, className }: TableCellProps) {
  return (
    <View style={[isHeader ? styles.cellHeader : styles.cell, { width }, className]}>
      <Text style={isHeader ? styles.textHeader : styles.text}>{children}</Text>
    </View>
  );
}

export function TableCaption({ children, className }: TableProps) {
  return (
    <Text style={[styles.caption, className]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  body: {
    flexDirection: "column",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#F3F4F6",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    minHeight: 40,
    alignItems: "center",
  },
  rowSelected: {
    backgroundColor: "#E5E7EB",
  },
  cell: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  cellHeader: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  text: {
    fontSize: 14,
  },
  textHeader: {
    fontWeight: "600",
    fontSize: 14,
  },
  caption: {
    marginTop: 8,
    fontSize: 12,
    color: "#6B7280",
  },
});