import { Duration } from 'luxon';

export const useDurationString: (duration: number) => string = (duration) => {
  return Duration.fromObject({ minutes: Math.abs(duration) })
    .shiftTo('hours', 'minutes')
    .toFormat("h'h' mm'm'");
};
