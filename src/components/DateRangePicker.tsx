import { useState, useRef, useEffect, FC } from 'react';
import { FormControl, InputGroup, Button } from 'react-bootstrap';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import { DateRangePicker, DateRange, StaticRange } from 'react-date-range';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

const MyDateRangePicker: FC = () => {
  const [selectionRange, setSelectionRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleDateChange = (ranges: { [key: string]: DateRange }) => {
    const newSelection = ranges.selection;
    if (newSelection && newSelection.startDate && newSelection.endDate) {
      console.log('New selection:', newSelection);
      setSelectionRange({
        startDate: newSelection.startDate,
        endDate: newSelection.endDate,
        key: 'selection'
      });
    }
  };

  const handleInputClick = () => {
    setShowCalendar(!showCalendar);
  };

  const handleSelectClick = () => {
    setShowCalendar(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setShowCalendar(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formattedStartDate = selectionRange.startDate ? selectionRange.startDate.toISOString().split('T')[0] : '';
  const formattedEndDate = selectionRange.endDate ? selectionRange.endDate.toISOString().split('T')[0] : '';

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
    createStaticRange('This Year', () => ({
      startDate: startOfYear(new Date()),
      endDate: endOfYear(new Date()),
      key: 'thisYear'
    })),
    createStaticRange('Last Year', () => ({
      startDate: startOfYear(addDays(new Date(), -365)),
      endDate: endOfYear(addDays(new Date(), -365)),
      key: 'lastYear'
    }))
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
        <div style={{ position: 'absolute', zIndex: 1000, border: '1px solid #ccc', borderRadius: '4px', padding: '10px', backgroundColor: 'white', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <DateRangePicker
            editableDateInputs={true}
            onChange={handleDateChange}
            moveRangeOnFirstSelection={false}
            ranges={[selectionRange]}
            staticRanges={customStaticRanges}
            inputRanges={[]}
          />
          <hr />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <Button variant="primary" onClick={handleSelectClick}>Select</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDateRangePicker;
