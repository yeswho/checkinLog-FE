import React from 'react';
import { Button } from '@nextui-org/react';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

interface DateRangeSelectorProps {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  className?: string;
}

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({ onDateRangeChange, className }) => {
  const [activePreset, setActivePreset] = React.useState<string>('thisMonth');
  const [dateRangeText, setDateRangeText] = React.useState<string>('');

  const setDateRange = (preset: string) => {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (preset) {
      case 'today':
        startDate = today;
        endDate = today;
        break;
      case 'yesterday':
        startDate = addDays(today, -1);
        endDate = addDays(today, -1);
        break;
      case 'thisWeek':
        startDate = startOfWeek(today);
        endDate = endOfWeek(today);
        break;
      case 'thisMonth':
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
        break;
      default:
        startDate = startOfMonth(today);
        endDate = endOfMonth(today);
    }

    setActivePreset(preset);
    setDateRangeText(`${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`);
    onDateRangeChange(startDate, endDate);
  };

  React.useEffect(() => {
    setDateRange('thisMonth');
  }, []);

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {['today', 'yesterday', 'thisWeek', 'thisMonth'].map((preset) => (
          <Button
            key={preset}
            size="sm"
            variant={activePreset === preset ? 'solid' : 'bordered'}
            color="primary"
            className="text-xs sm:text-sm"
            onPress={() => setDateRange(preset)}
          >
            {preset.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
          </Button>
        ))}
      </div>
      {dateRangeText && (
        <div className="text-sm text-default-500 dark:text-default-400">
          {dateRangeText}
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;