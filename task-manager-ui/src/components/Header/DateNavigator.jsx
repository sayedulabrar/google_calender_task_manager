import React from 'react';
import { format } from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiCalendar } from 'react-icons/fi';
import { Button } from '../Common/Button';
import '../../styles/header.css';

/**
 * DateNavigator component for moving between dates
 */
export const DateNavigator = ({
  currentDate,
  onPreviousClick,
  onNextClick,
  onTodayClick,
  viewMode,
}) => {
  const formatDateLabel = () => {
    if (viewMode === 'day') {
      return format(currentDate, 'EEEE, MMMM d, yyyy');
    } else if (viewMode === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    } else if (viewMode === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (viewMode === 'year') {
      return format(currentDate, 'yyyy');
    }
    return format(currentDate, 'MMM d, yyyy');
  };

  return (
    <div className="date-navigator">
      <Button
        variant="ghost"
        size="sm"
        onClick={onPreviousClick}
        aria-label="Previous"
        title="Previous"
      >
        <FiChevronLeft size={20} />
      </Button>

      <div className="date-label">
        <FiCalendar size={18} />
        <span>{formatDateLabel()}</span>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onNextClick}
        aria-label="Next"
        title="Next"
      >
        <FiChevronRight size={20} />
      </Button>

      {viewMode === 'day' && (
        <Button variant="ghost" size="sm" onClick={onTodayClick}>
          Today
        </Button>
      )}
    </div>
  );
};

export default DateNavigator;
