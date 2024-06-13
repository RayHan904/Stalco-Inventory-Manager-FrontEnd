declare module 'react-date-range' {
    import * as React from 'react';
  
    export interface DateRange {
      startDate: Date;
      endDate: Date;
      key: string;
      color?: string;
      autoFocus?: boolean;
      disabled?: boolean;
      showDateDisplay?: boolean;
    }
  
    export interface StaticRange {
      label: string;
      range: () => DateRange;
      isSelected?: (range: DateRange) => boolean;
    }
  
    export interface DateRangePickerProps {
      ranges: DateRange[];
      onChange: (ranges: { [key: string]: DateRange }) => void;
      moveRangeOnFirstSelection?: boolean;
      className?: string;
      minDate?: Date;
      maxDate?: Date;
      direction?: 'vertical' | 'horizontal';
      months?: number;
      weekStartsOn?: number;
      showMonthAndYearPickers?: boolean;
      showSelectionPreview?: boolean;
      editableDateInputs?: boolean;
      fixedHeight?: boolean;
      rangeColors?: string[];
      dragSelectionEnabled?: boolean;
      color?: string;
      disabledDates?: Date[];
      disabledDay?: (date: Date) => boolean;
      renderStaticRangeLabel?: (range: DateRange) => React.ReactNode;
      inputRanges?: any[];
      staticRanges?: StaticRange[];
    }
  
    export class DateRangePicker extends React.Component<DateRangePickerProps, any> {}
  }
  