import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DatePickerWithTodayProps {
  value: string; // ISO date string (YYYY-MM-DD)
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function DatePickerWithToday({ 
  value, 
  onChange, 
  placeholder = "Pick a date",
  disabled = false,
  required = false,
  className 
}: DatePickerWithTodayProps) {
  const [open, setOpen] = useState(false);

  const dateValue = value ? new Date(value) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'));
      setOpen(false);
    }
  };

  const handleToday = () => {
    const today = new Date();
    onChange(format(today, 'yyyy-MM-dd'));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <span>{value ? format(new Date(value), 'PPP') : placeholder}</span>
          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <div className="p-3 border-b">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleToday}
            size="sm"
          >
            Today
          </Button>
        </div>
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleSelect}
          initialFocus
          required={required}
        />
      </PopoverContent>
    </Popover>
  );
}
