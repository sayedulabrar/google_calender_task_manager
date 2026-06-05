import React from 'react';
import { FiGrid, FiList, FiCalendar } from 'react-icons/fi';
import { Button } from '../Common/Button';
import { VIEW_MODES } from '../../utils/constants';
import '../../styles/header.css';

/**
 * ViewSwitcher component for switching between calendar views
 */
export const ViewSwitcher = ({ currentViewMode, onViewChange }) => {
  const views = [
    {
      mode: VIEW_MODES.DAY,
      label: 'Day',
      icon: <FiList size={18} />,
    },
    {
      mode: VIEW_MODES.WEEK,
      label: 'Week',
      icon: <FiGrid size={18} />,
    },
    {
      mode: VIEW_MODES.MONTH,
      label: 'Month',
      icon: <FiCalendar size={18} />,
    },
    {
      mode: VIEW_MODES.YEAR,
      label: 'Year',
      icon: <FiGrid size={18} />,
    },
  ];

  return (
    <div className="view-switcher">
      {views.map((view) => (
        <Button
          key={view.mode}
          variant={currentViewMode === view.mode ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onViewChange(view.mode)}
          title={`Switch to ${view.label} view`}
          className="view-switcher-btn"
        >
          {view.icon}
          <span className="hide-mobile">{view.label}</span>
        </Button>
      ))}
    </div>
  );
};

export default ViewSwitcher;
