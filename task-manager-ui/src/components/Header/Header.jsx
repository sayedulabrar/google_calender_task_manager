import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { DateNavigator } from './DateNavigator';
import { ViewSwitcher } from './ViewSwitcher';
import { Button } from '../Common/Button';
import '../../styles/header.css';

/**
 * Main Header component
 */
export const Header = ({
  currentDate,
  viewMode,
  onPreviousClick,
  onNextClick,
  onTodayClick,
  onViewChange,
  onCreateTaskClick,
}) => {
  return (
    <header className="calendar-header">
      <div className="header-left">
        <div className="header-title">
          <h1>Task Calendar</h1>
        </div>
        <DateNavigator
          currentDate={currentDate}
          onPreviousClick={onPreviousClick}
          onNextClick={onNextClick}
          onTodayClick={onTodayClick}
          viewMode={viewMode}
        />
      </div>

      <div className="header-right">
        <ViewSwitcher currentViewMode={viewMode} onViewChange={onViewChange} />

        <Button
          variant="primary"
          size="md"
          onClick={onCreateTaskClick}
          className="create-task-btn"
        >
          <FiPlus size={20} />
          <span className="hide-mobile">New Task</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
