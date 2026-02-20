// ChartNative.tsx
import React, { createContext, useContext, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Circle } from "react-native-svg";
import { LineChart } from "react-native-svg-charts";

export type ChartConfigItem = {
  label?: string;
  color?: string;
  icon?: React.ComponentType;
};

export type ChartConfig = Record<string, ChartConfigItem>;

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = createContext<ChartContextProps | null>(null);

export const useChart = () => {
  const context = useContext(ChartContext);
  if (!context) throw new Error("useChart must be used within <ChartContainer>");
  return context;
};

type ChartContainerProps = {
  config: ChartConfig;
  width?: number;
  height?: number;
  children: React.ReactNode;
};

export const ChartContainer = ({ config, width, height, children }: ChartContainerProps) => {
  return (
    <ChartContext.Provider value={{ config }}>
      <View style={{ width: width || Dimensions.get("window").width - 32, height: height || 220 }}>
        {children}
      </View>
    </ChartContext.Provider>
  );
};

type ChartLineProps = {
  data: number[];
  labels: string[];
  dataKey: string;
};

export const ChartLine = ({ data, labels, dataKey }: ChartLineProps) => {
  const { config } = useChart();
  const color = config[dataKey]?.color || "#007AFF";
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <View>
      <LineChart
        style={{ height: 200 }}
        data={data}
        contentInset={{ top: 20, bottom: 20 }}
        animate
        strokeWidth={2}
        stroke={color}
      >
        
        {data.map((value, index) =>
          selectedIndex === index ? (
            <Circle
              key={index}
              cx={(index / (data.length - 1)) * (Dimensions.get("window").width - 32)}
              cy={200 - (value / Math.max(...data)) * 200}
              r={6}
              fill={color}
            />
          ) : null
        )}
      </LineChart>
      {/* Points pour le tooltip */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {data.map((value, index) => (
          <TouchableOpacity
            key={index}
            style={{
              position: "absolute",
              left: (index / (data.length - 1)) * (Dimensions.get("window").width - 32) - 15,
              top: 0,
              width: 30,
              height: 200,
            }}
            onPress={() => setSelectedIndex(index === selectedIndex ? null : index)}
          >
            {selectedIndex === index && (
              <ChartTooltipContent
                value={value}
                label={config[dataKey]?.label || dataKey}
                color={color}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

type ChartTooltipProps = {
  value: number | string;
  label?: string;
  color?: string;
};

export const ChartTooltipContent = ({ value, label, color }: ChartTooltipProps) => {
  return (
    <View style={[styles.tooltip, { backgroundColor: color || '#000' }]}>
      {label && <Text style={styles.tooltipLabel}>{label}</Text>}
      <Text style={[styles.tooltipValue, { color: '#fff' }]}>{value}</Text>
    </View>
  );
};

type ChartLegendProps = {
  dataKeys: string[];
};

export const ChartLegendContent = ({ dataKeys }: ChartLegendProps) => {
  const { config } = useChart();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.legendContainer}>
      {dataKeys.map((key) => (
        <View key={key} style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: config[key]?.color || "#007AFF" }]} />
          <Text>{config[key]?.label || key}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    padding: 8,
    borderRadius: 4,
    bottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  tooltipLabel: { 
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
    marginBottom: 2,
  },
  tooltipValue: { 
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  legendContainer: { 
    flexDirection: 'row',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  legendItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginRight: 12,
  },
  legendColor: { 
    width: 12, 
    height: 12, 
    marginRight: 6, 
    borderRadius: 2,
  },
});