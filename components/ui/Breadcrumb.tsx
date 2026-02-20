import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BreadcrumbProps {
  children: React.ReactNode;
  style?: any;
}

interface BreadcrumbLinkProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}

interface BreadcrumbPageProps {
  children: React.ReactNode;
  style?: any;
}

interface BreadcrumbSeparatorProps {
  style?: any;
  children?: React.ReactNode;
}

interface BreadcrumbEllipsisProps {
  style?: any;
}

export function Breadcrumb({ children, style }: BreadcrumbProps) {
  return <View style={[styles.breadcrumbContainer, style]}>{children}</View>;
}

export function BreadcrumbList({ children, style }: BreadcrumbProps) {
  return <View style={[styles.list, style]}>{children}</View>;
}

export function BreadcrumbItem({ children, style }: BreadcrumbProps) {
  return <View style={[styles.item, style]}>{children}</View>;
}

export function BreadcrumbLink({ children, onPress, style }: BreadcrumbLinkProps) {
  return (
    <TouchableOpacity onPress={onPress} style={style}>
      <Text style={[styles.linkText, style]}>{children}</Text>
    </TouchableOpacity>
  );
}

export function BreadcrumbPage({ children, style }: BreadcrumbPageProps) {
  return <Text style={[styles.pageText, style]}>{children}</Text>;
}

export function BreadcrumbSeparator({ children, style }: BreadcrumbSeparatorProps) {
  return (
    <View style={[styles.separator, style]}>
    </View>
  );
}

export function BreadcrumbEllipsis({ style }: BreadcrumbEllipsisProps) {
  return (
    <View style={[styles.ellipsisContainer, style]}>
      <Text style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}>More</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color: '#A64B2A',
    fontSize: 14,
  },
  pageText: {
    color: '#333',
    fontSize: 14,
  },
  separator: {
    marginHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ellipsisContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});