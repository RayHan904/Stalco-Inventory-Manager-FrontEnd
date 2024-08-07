import { useState, useRef, useEffect } from 'react';
import { FormControl, InputGroup, Button } from 'react-bootstrap';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import { DateRangePicker, DateRange, StaticRange } from 'react-date-range';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, addMonths } from 'date-fns';


interface DateRangePickerProps {
  dateRange: DateRange;
  handleDateRangeChange:(ranges: { [key: string]: DateRange; }) => void;
  setApiCallToggle: () => void;

}

const MyDateRangePicker: React.FC<DateRangePickerProps> = ({dateRange,  handleDateRangeChange, setApiCallToggle}) => {

  const [showCalendar, setShowCalendar] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);


  const handleInputClick = () => {
    setShowCalendar(!showCalendar);
  };

  const handleSelectClick = () => {
    setApiCallToggle()
    setShowCalendar(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setApiCallToggle()
      setShowCalendar(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formattedStartDate = dateRange.startDate ? dateRange.startDate.toISOString().split('T')[0] : '';
  const formattedEndDate = dateRange.endDate ? dateRange.endDate.toISOString().split('T')[0] : '';

  const createStaticRange = (label: string, rangeFunc: () => DateRange): StaticRange => ({
    label,
    range: rangeFunc,
    isSelected: (range: DateRange): boolean => {
      const definedRange = rangeFunc();
      return (
        range.startDate?.getTime() === definedRange.startDate.getTime() &&
        range.endDate?.getTime() === definedRange.endDate.getTime()
      );
    }
  });

  const customStaticRanges: StaticRange[] = [
    createStaticRange('Today', () => ({
      startDate: new Date(),
      endDate: new Date(),
      key: 'today'
    })),
    createStaticRange('Yesterday', () => ({
      startDate: addDays(new Date(), -1),
      endDate: addDays(new Date(), -1),
      key: 'yesterday'
    })),
    createStaticRange('This Week', () => ({
      startDate: startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday
      endDate: endOfWeek(new Date(), { weekStartsOn: 1 }), // Sunday
      key: 'thisWeek'
    })),
    createStaticRange('Last Week', () => ({
      startDate: startOfWeek(addDays(new Date(), -7), { weekStartsOn: 1 }), // Monday
      endDate: endOfWeek(addDays(new Date(), -7), { weekStartsOn: 1 }), // Sunday
      key: 'lastWeek'
    })),
    createStaticRange('This Month', () => ({
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date()),
      key: 'thisMonth'
    })),
    createStaticRange('Last Month', () => ({
      startDate: startOfMonth(addDays(new Date(), -30)),
      endDate: endOfMonth(addDays(new Date(), -30)),
      key: 'lastMonth'
    })),
    createStaticRange('Last 3 Months', () => ({
      startDate: startOfMonth(addMonths(new Date(), -3)),
      endDate: endOfMonth(addMonths(new Date(), -1)),
      key: 'last3Months'
    })),
    createStaticRange('This Year', () => ({
      startDate: startOfYear(new Date()),
      endDate: endOfYear(new Date()),
      key: 'thisYear'
    })),
  ];

  return (
    <div ref={wrapperRef} style={{ position: 'relative' }}>
      <InputGroup>
        <FormControl
          type="text"
          value={`${formattedStartDate} to ${formattedEndDate}`}
          onClick={handleInputClick}
          readOnly
        />
      </InputGroup>
      {showCalendar && (
        <div className="calendar-container" style={calendarStyle}>
          <DateRangePicker
            editableDateInputs={true}
            onChange={handleDateRangeChange}
            moveRangeOnFirstSelection={false}
            ranges={[dateRange]}
            staticRanges={customStaticRanges}
            inputRanges={[]}
          />
          <hr />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
            <Button  className="mb-3" variant="primary"  onClick={handleSelectClick}>Select</Button>
          </div>
        </div>
      )}
    </div>
  );
};

const calendarStyle = {
  position: 'absolute',
  top: '100%',
  left: "12px",
  zIndex: 1000,
  backgroundColor: '#fff',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '4px',
  overflow: 'hidden'
} as const;

export default MyDateRangePicker;
