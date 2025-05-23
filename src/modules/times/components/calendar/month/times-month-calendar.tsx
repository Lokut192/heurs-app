'use client';

import { DateTime, Duration } from 'luxon';
import { useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { TimesTableContext } from '@/modules/times/contexts/times-table.ctx';
import { ApiTimeType } from '@/modules/times/enums/time-type.enum';
import type { ApiGetTime } from '@/modules/times/types/time';

type TimesMonthCalendarProps = object;

type Day = {
  date: string;
  isSelected: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
  times: ApiGetTime[];
  balance: number;
};

type DaysReducerAction =
  | { type: 'reset'; payload: Day[] }
  | { type: 'select-day'; date: string }
  | { type: 'reset-times' }
  | { type: 'insert-times'; times: ApiGetTime[] };

const daysReducer: React.Reducer<Day[], DaysReducerAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case 'reset':
      return action.payload;
    case 'select-day':
      return state.map((day) => ({
        ...day,
        isSelected: day.date === action.date,
      }));
    case 'reset-times':
      return state.map((day) => ({ ...day, times: [] }));
    case 'insert-times':
      return state.map((day) => ({
        ...day,
        times: [
          ...day.times,
          ...action.times.filter((t) => t.date === day.date),
        ],
        balance: [
          ...day.times,
          ...action.times.filter((t) => t.date === day.date),
        ].reduce((acc, t) => {
          switch (t.type) {
            case ApiTimeType.Overtime:
              return acc + t.duration;
            case ApiTimeType.Recovery:
              return acc - t.duration;
            default:
              return acc;
          }
        }, 0),
      }));
    default:
      return state;
  }
};

const getDurationString: (duration: number) => string = (duration) => {
  return Duration.fromObject({ minutes: Math.abs(duration) })
    .shiftTo('hours', 'minutes')
    .toFormat("h'h' mm'm'");
};

function TimesMonthCalendar(_props: TimesMonthCalendarProps): React.ReactNode {
  /* States */
  const [calendarDisplaySaturday, _setCalendarDisplaySaturday] =
    useState<boolean>(false);
  const [calendarDisplaySunday, _setCalendarDisplaySunday] =
    useState<boolean>(false);

  /* Context */
  const { from, times, timesQuery } = useContext(TimesTableContext);

  /* Reducer */
  const [days, dispatchDays] = useReducer(daysReducer, []);

  /* Memoized values */
  const calendarColumnsCount = useMemo(() => {
    let count = 7;

    if (!calendarDisplaySaturday) {
      count--;
    }
    if (!calendarDisplaySunday) {
      count--;
    }

    return count;
  }, [calendarDisplaySaturday, calendarDisplaySunday]);
  const calendarRowsCount = useMemo(() => {
    let count = 6;

    if (!calendarDisplaySaturday && !calendarDisplaySunday) {
      count--;
    }

    return count;
  }, [calendarDisplaySaturday, calendarDisplaySunday]);

  /* Memoized values */
  // const days = useMemo(() => {
  //   const start = DateTime.fromISO(from).startOf('month').startOf('week');
  //   const end = DateTime.fromISO(from).endOf('month').endOf('week');
  // }, [from]);

  /* Effects */
  // Generate calendar days
  useEffect(() => {
    const currentMonth = DateTime.fromISO(from).month;
    const start = (() => {
      if (calendarDisplaySaturday || calendarDisplaySunday) {
        return DateTime.fromISO(from).startOf('month').startOf('week');
      }

      const monthStart = DateTime.fromISO(from).startOf('month');

      if (monthStart.weekday === 6 || monthStart.weekday === 7) {
        return monthStart.plus({ weeks: 1 }).startOf('week');
      }

      return DateTime.fromISO(from).startOf('month').startOf('week');
    })();
    const end = DateTime.fromISO(from).endOf('month').endOf('week');
    const today = DateTime.now().toISODate();

    const newDays: Day[] = [];
    let current = start;

    do {
      if (!calendarDisplaySaturday && current.weekday === 6) {
        current = current.plus({ days: 1 });
        continue;
      }
      if (!calendarDisplaySunday && current.weekday === 7) {
        current = current.plus({ days: 1 });
        continue;
      }
      const dateTimes = times.filter((t) => t.date === current.toISODate());

      newDays.push({
        date: current.toISODate()!,
        isToday: today === current.toISODate(),
        isSelected: today === current.toISODate(),
        isCurrentMonth: current.month === currentMonth,
        times: dateTimes,
        balance: dateTimes.reduce((acc, t) => {
          switch (t.type) {
            case ApiTimeType.Overtime:
              return acc + t.duration;
            case ApiTimeType.Recovery:
              return acc - t.duration;
            default:
              return acc;
          }
        }, 0),
      });

      current = current.plus({ days: 1 });
    } while (current < end);

    dispatchDays({ type: 'reset', payload: newDays });
  }, [from, calendarDisplaySaturday, calendarDisplaySunday]);
  // Insert times
  useEffect(() => {
    dispatchDays({ type: 'insert-times', times });
    return () => {
      dispatchDays({ type: 'reset-times' });
    };
  }, [timesQuery.fetchStatus]);

  /* Render */
  return (
    <>
      {/* {process.env.NODE_ENV === 'development' && (
        <pre>
          <code>{JSON.stringify(days, null, 2)}</code>
        </pre>
      )} */}
      <div className="rounded-box overflow-hidden shadow-sm ring-1 ring-black/5 lg:flex lg:flex-auto lg:flex-col dark:ring-white/5">
        <div
          className="bg-base-200 text-base-content border-base-300 rounded-t-box grid gap-px border-b text-center text-xs/6 font-semibold lg:flex-none"
          style={{
            gridTemplateColumns: `repeat(${calendarColumnsCount}, minmax(0, 1fr))`,
          }}
        >
          <div className="bg-base-100 py-2">
            M<span className="sr-only sm:not-sr-only">on</span>
          </div>
          <div className="bg-base-100 py-2">
            T<span className="sr-only sm:not-sr-only">ue</span>
          </div>
          <div className="bg-base-100 py-2">
            W<span className="sr-only sm:not-sr-only">ed</span>
          </div>
          <div className="bg-base-100 py-2">
            T<span className="sr-only sm:not-sr-only">hu</span>
          </div>
          <div className="bg-base-100 py-2">
            F<span className="sr-only sm:not-sr-only">ri</span>
          </div>
          {calendarDisplaySaturday && (
            <div className="bg-base-100 py-2">
              S<span className="sr-only sm:not-sr-only">at</span>
            </div>
          )}
          {calendarDisplaySunday && (
            <div className="bg-base-100 py-2">
              S<span className="sr-only sm:not-sr-only">un</span>
            </div>
          )}
        </div>
        <div className="bg-base-200 text-base-content flex text-xs/6 lg:flex-auto">
          <div
            className="hidden w-full lg:grid lg:gap-px"
            style={{
              gridTemplateColumns: `repeat(${calendarColumnsCount}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${calendarRowsCount}, minmax(0, 1fr))`,
            }}
          >
            {days.map((day) => (
              <div
                key={day.date}
                data-is-current-month={day.isCurrentMonth ? 'true' : 'false'}
                className="data-[is-current-month=true]:bg-base-100 data-[is-current-month=false]:text-base-content/80 data-[is-current-month=false]:bg-base-200 relative px-3 py-2 lg:h-32"
              >
                <div className="flex w-full items-center justify-between">
                  <time
                    dateTime={day.date}
                    data-is-today={day.isToday ? 'true' : 'false'}
                    className="data-[is-today=true]:bg-primary data-[is-today=true]:flex data-[is-today=true]:size-6 data-[is-today=true]:items-center data-[is-today=true]:justify-center data-[is-today=true]:rounded-full data-[is-today=true]:font-semibold data-[is-today=true]:text-white"
                  >
                    {day.date.split('-').pop()!.replace(/^0/, '')}
                  </time>

                  {day.times.length > 0 && (
                    <span
                      data-positive={day.balance > 0 ? 'true' : 'false'}
                      data-negative={day.balance < 0 ? 'true' : 'false'}
                      data-balanced={day.balance === 0 ? 'true' : 'false'}
                      className="data-[positive=true]:text-overtime data-[negative=true]:text-recovery font-medium data-[balanced=true]:text-blue-500"
                    >
                      {(() => {
                        switch (true) {
                          case day.balance > 0:
                            return '+ ';
                          case day.balance < 0:
                            return '- ';
                          default:
                            return '';
                        }
                      })()}
                      {getDurationString(Math.abs(day.balance))}
                    </span>
                  )}
                </div>
                {day.times.length > 0 && (
                  <ol className="mt-2 flex flex-col gap-0.5">
                    {day.times.slice(0, 2).map((time) => (
                      <li
                        key={time.id}
                        data-type={time.type}
                        className="text-base-content data-[type=OVERTIME]:bg-overtime/50 data-[type=RECOVERY]:bg-recovery/50 rounded-field flex px-1"
                      >
                        <p className="text-base-content flex-auto truncate font-medium">
                          {(() => {
                            switch (time.type) {
                              case ApiTimeType.Overtime:
                                return 'Overtime';
                              case ApiTimeType.Recovery:
                                return 'Recovery';
                              default:
                                return time.type;
                            }
                          })()}
                        </p>
                        <span className="text-base-content/80 ml-3 hidden flex-none xl:block">
                          {getDurationString(time.duration)}
                        </span>
                      </li>
                    ))}
                    {day.times.length > 2 && (
                      <li className="text-base-content/80">
                        + {day.times.length - 2} more
                      </li>
                    )}
                  </ol>
                )}
              </div>
            ))}
          </div>
          <div
            className="isolate grid w-full gap-px lg:hidden"
            style={{
              gridTemplateColumns: `repeat(${calendarColumnsCount}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${calendarRowsCount}, minmax(0, 1fr))`,
            }}
            // onClick={(ev) => {
            //   const target = ev.target as HTMLDivElement;
            //   const button = target.closest(
            //     'button[data-action]',
            //   ) as HTMLButtonElement | null;

            //   if (!button) return;

            //   const action = button.dataset.action;
            //   const date = button.dataset.date;

            //   switch (action) {
            //     case 'select-day':
            //       if (date) dispatchDays({ type: 'select-day', date });
            //       break;
            //     default:
            //       break;
            //   }
            // }}
          >
            {days.map((day) => (
              <button
                key={day.date}
                type="button"
                data-action="select-day"
                data-date={day.date}
                data-is-current-month={day.isCurrentMonth ? 'true' : 'false'}
                data-is-selected={day.isSelected ? 'true' : 'false'}
                data-is-today={day.isToday ? 'true' : 'false'}
                className={twMerge(
                  day.isCurrentMonth ? 'bg-base-100' : 'bg-base-200',
                  (day.isSelected || day.isToday) && 'font-semibold',
                  day.isSelected && 'text-white',
                  !day.isSelected && day.isToday && 'text-accent',
                  !day.isSelected &&
                    day.isCurrentMonth &&
                    !day.isToday &&
                    'text-base-content',
                  !day.isSelected &&
                    !day.isCurrentMonth &&
                    !day.isToday &&
                    'text-base-content/80',
                  'hover:bg-base-content/20 flex h-14 flex-col px-3 py-2 focus:z-10',
                )}
              >
                <time
                  dateTime={day.date}
                  className={twMerge(
                    day.isSelected &&
                      'flex size-6 items-center justify-center rounded-full',
                    day.isSelected && day.isToday && 'bg-primary',
                    day.isSelected && !day.isToday && 'bg-base-content/20',
                    'ml-auto',
                  )}
                >
                  {day.date.split('-').pop()!.replace(/^0/, '')}
                </time>
                <span className="sr-only">{day.times.length} times</span>
                {day.times.length > 0 && (
                  <span
                    data-positive={day.balance > 0 ? 'true' : 'false'}
                    data-negative={day.balance < 0 ? 'true' : 'false'}
                    data-balanced={day.balance === 0 ? 'true' : 'false'}
                    className="data-[positive=true]:text-overtime data-[negative=true]:text-recovery font-medium whitespace-nowrap data-[balanced=true]:text-blue-500"
                  >
                    {(() => {
                      switch (true) {
                        case day.balance > 0:
                          return '+ ';
                        case day.balance < 0:
                          return '- ';
                        default:
                          return '';
                      }
                    })()}
                    {getDurationString(Math.abs(day.balance))}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default TimesMonthCalendar as React.FC<TimesMonthCalendarProps>;
