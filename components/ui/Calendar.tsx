import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CalendarProps, DateData, Calendar as RNCalendar } from 'react-native-calendars';

interface Props extends Partial<CalendarProps> {
  onDayPress?: (day: DateData) => void;
  selectedDate?: string; // YYYY-MM-DD
}

export function Calendar({ onDayPress, selectedDate, ...props }: Props) {
  return (
    <View style={styles.container}>
      <RNCalendar
        onDayPress={onDayPress}
        markedDates={
          selectedDate
            ? {
                [selectedDate]: {
                  selected: true,
                  selectedColor: '#A64B2A',
                },
              }
            : {}
        }
        theme={{
          todayTextColor: '#A64B2A',
          arrowColor: '#A64B2A',
          textSectionTitleColor: '#000',
          monthTextColor: '#000',
          textDayFontWeight: '400',
          textMonthFontWeight: '600',
          textDayHeaderFontWeight: '500',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
        renderArrow={(direction: 'left' | 'right') =>
          direction === 'left' ? (
            <Feather name="chevron-left" size={20} color="#A64B2A" />
          ) : (
            <Feather name="chevron-right" size={20} color="#A64B2A" />
          )
        }
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});