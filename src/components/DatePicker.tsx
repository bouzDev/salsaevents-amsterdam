'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    addMonths,
    subMonths,
    parseISO,
} from 'date-fns';
import { enUS } from 'date-fns/locale';

interface DatePickerProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
    eventDates: string[];
    selectedDateRange?: { start: string; end: string } | null;
    onDateRangeChange?: (range: { start: string; end: string } | null) => void;
    placeholder?: string;
    accentColor?: string;
}

export default function DatePicker({
    selectedDate,
    onDateChange,
    eventDates,
    selectedDateRange,
    onDateRangeChange,
    placeholder = 'Select date',
    accentColor = 'blue',
}: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [rangeStart, setRangeStart] = useState<Date | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                setRangeStart(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Add days from previous month to fill the grid
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());

    // Add days from next month to fill the grid
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));

    const allDays = eachDayOfInterval({ start: startDate, end: endDate });

    const hasEvent = (date: Date) => {
        const dateString = format(date, 'yyyy-MM-dd');
        return eventDates.includes(dateString);
    };

    const isSelected = (date: Date) => {
        if (!selectedDate) return false;
        return isSameDay(date, parseISO(selectedDate));
    };

    const isInRange = (date: Date) => {
        if (!selectedDateRange) return false;
        const start = parseISO(selectedDateRange.start);
        const end = parseISO(selectedDateRange.end);
        return date >= start && date <= end;
    };

    const handleDateClick = (date: Date) => {
        const dateString = format(date, 'yyyy-MM-dd');

        if (onDateRangeChange) {
            // Range selection mode
            if (!rangeStart) {
                setRangeStart(date);
            } else {
                const start = rangeStart <= date ? rangeStart : date;
                const end = rangeStart <= date ? date : rangeStart;

                onDateRangeChange({
                    start: format(start, 'yyyy-MM-dd'),
                    end: format(end, 'yyyy-MM-dd'),
                });
                setRangeStart(null);
                setIsOpen(false);
            }
        } else {
            // Single date selection
            onDateChange(dateString);
            setIsOpen(false);
        }
    };

    const clearSelection = () => {
        onDateChange('');
        if (onDateRangeChange) {
            onDateRangeChange(null);
        }
        setRangeStart(null);
    };

    const getDisplayText = () => {
        if (selectedDateRange) {
            return `${format(parseISO(selectedDateRange.start), 'MMM d')} - ${format(parseISO(selectedDateRange.end), 'MMM d')}`;
        }
        if (selectedDate) {
            return format(parseISO(selectedDate), 'MMM d, yyyy');
        }
        return placeholder;
    };

    const getAccentClasses = () => {
        const colors = {
            blue: {
                bg: 'bg-blue-500',
                hover: 'hover:bg-blue-600',
                text: 'text-blue-600',
                ring: 'ring-blue-500/20',
            },
            purple: {
                bg: 'bg-purple-500',
                hover: 'hover:bg-purple-600',
                text: 'text-purple-600',
                ring: 'ring-purple-500/20',
            },
            emerald: {
                bg: 'bg-emerald-500',
                hover: 'hover:bg-emerald-600',
                text: 'text-emerald-600',
                ring: 'ring-emerald-500/20',
            },
        };
        return colors[accentColor as keyof typeof colors] || colors.blue;
    };

    const accent = getAccentClasses();

    return (
        <div className='relative' ref={dropdownRef}>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
                Date
            </label>

            <button
                type='button'
                onClick={() => setIsOpen(!isOpen)}
                className='w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-left flex items-center justify-between'
            >
                <span
                    className={
                        selectedDate || selectedDateRange
                            ? 'text-gray-900'
                            : 'text-gray-500'
                    }
                >
                    {getDisplayText()}
                </span>
                <Calendar className='w-4 h-4 text-gray-400' />
            </button>

            {isOpen && (
                <div className='absolute z-[9999] mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl p-4 w-80'>
                    {/* Header */}
                    <div className='flex items-center justify-between mb-4'>
                        <button
                            type='button'
                            onClick={() =>
                                setCurrentMonth(subMonths(currentMonth, 1))
                            }
                            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                        >
                            <ChevronLeft className='w-4 h-4 text-gray-600' />
                        </button>

                        <h3 className='font-semibold text-gray-900'>
                            {format(currentMonth, 'MMMM yyyy', {
                                locale: enUS,
                            })}
                        </h3>

                        <button
                            type='button'
                            onClick={() =>
                                setCurrentMonth(addMonths(currentMonth, 1))
                            }
                            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
                        >
                            <ChevronRight className='w-4 h-4 text-gray-600' />
                        </button>
                    </div>

                    {/* Days of week */}
                    <div className='grid grid-cols-7 gap-1 mb-2'>
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(
                            (day) => (
                                <div
                                    key={day}
                                    className='text-center text-xs font-medium text-gray-500 py-2'
                                >
                                    {day}
                                </div>
                            )
                        )}
                    </div>

                    {/* Calendar grid */}
                    <div className='grid grid-cols-7 gap-1'>
                        {allDays.map((date, index) => {
                            const isCurrentMonth = isSameMonth(
                                date,
                                currentMonth
                            );
                            const isSelectedDate = isSelected(date);
                            const isRangeDate = isInRange(date);
                            const hasEventDate = hasEvent(date);
                            const isTodayDate = isToday(date);

                            return (
                                <button
                                    key={index}
                                    type='button'
                                    onClick={() => handleDateClick(date)}
                                    disabled={!isCurrentMonth}
                                    className={`
                                        relative w-10 h-10 text-sm rounded-lg transition-all duration-200
                                        ${
                                            !isCurrentMonth
                                                ? 'text-gray-300 cursor-not-allowed'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }
                                        ${
                                            isSelectedDate
                                                ? `${accent.bg} text-white hover:${accent.hover}`
                                                : ''
                                        }
                                        ${
                                            isRangeDate && !isSelectedDate
                                                ? 'bg-blue-50 text-blue-700'
                                                : ''
                                        }
                                        ${
                                            isTodayDate && !isSelectedDate
                                                ? `ring-2 ${accent.ring}`
                                                : ''
                                        }
                                    `}
                                >
                                    {format(date, 'd')}

                                    {/* Event indicator */}
                                    {hasEventDate && isCurrentMonth && (
                                        <div
                                            className={`
                                            absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full
                                            ${
                                                isSelectedDate
                                                    ? 'bg-white'
                                                    : `${accent.bg}`
                                            }
                                        `}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className='flex items-center justify-between mt-4 pt-3 border-t border-gray-100'>
                        <button
                            type='button'
                            onClick={clearSelection}
                            className='text-sm text-gray-500 hover:text-gray-700 transition-colors'
                        >
                            Clear
                        </button>

                        <div className='text-xs text-gray-500'>
                            {eventDates.length} events available
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
