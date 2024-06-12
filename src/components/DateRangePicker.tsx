import { useState, useRef, useEffect, FC } from 'react';
import { FormControl, InputGroup, Button } from 'react-bootstrap';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import { DateRangePicker, DateRange } from 'react-date-range';

const MyDateRangePicker: FC = () => {
  const [selectionRange, setSelectionRange] = useState<DateRange>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleDateChange = (ranges: { [key: string]: DateRange }) => {
    setSelectionRange(ranges.selection);
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
