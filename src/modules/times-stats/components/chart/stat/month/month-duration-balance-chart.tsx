'use client';

import 'chartjs-adapter-date-fns';

import type { ChartData, ChartOptions } from 'chart.js';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Duration } from 'luxon';
import { useContext, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';

import { MonthStatsContext } from '@/modules/times-stats/contexts/month-stats.ctx';

export type MonthDurationBalanceChartProps = {};

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

// const options: ChartOptions<'bar'> = {
//   responsive: true,
//   scales: {
//     y: {
//       type: 'time',
//       time: {
//         unit: 'minute',
//         displayFormats: {
//           minute: 'h:mm',
//         },
//         tooltipFormat: 'h:mm',
//       },
//       // beginAtZero: true,
//     },
//   },
//   plugins: {
//     title: {
//       text: 'Durations balance chart',
//       display: false,
//     },
//     legend: { display: false },
//   },
// };
const options: ChartOptions<'bar'> = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback(tickValue, _index, _ticks) {
          return Duration.fromObject({ minutes: Number(tickValue) })
            .shiftTo('hours', 'minutes')
            .toFormat('h:mm');
        },
      },
    },
  },
  plugins: {
    title: {
      text: 'Durations balance chart',
      display: false,
    },
    tooltip: {
      displayColors: false,
      callbacks: {
        label(tooltipItem) {
          return `Duration: ${Duration.fromObject({
            minutes: Number(tooltipItem.raw),
          })
            .shiftTo('hours', 'minutes')
            .toFormat("h'h' mm'm'")}`;
        },
      },
    },
    legend: { display: false },
  },
};

function MonthDurationBalanceChart(
  _props: MonthDurationBalanceChartProps,
): React.ReactNode {
  /* Context */
  // Values
  const { statistics, statisticsQuery } = useContext(MonthStatsContext);

  const data: ChartData<'bar'> = useMemo(
    () => ({
      labels: ['Total', 'Overtime', 'Recovery'],
      datasets: [
        {
          label: 'Duration',
          data: [
            statistics.totalDuration,
            statistics.overtimeTotalDuration,
            statistics.recoveryTotalDuration,
          ],
          backgroundColor: [
            'rgba(54, 162, 235, 0.5)',
            'oklch(71% 0.1906 10.53 / 0.5)', // Overtime color
            'oklch(85% 0.2572 143.46 / 0.5)', // Recovery color
          ],
          borderColor: [
            'rgb(54, 162, 235)',
            'oklch(71% 0.1906 10.53)', // Overtime color
            'oklch(85% 0.2572 143.46)', // Recovery color
          ],
          borderWidth: 2,
          borderRadius: 5,
        },
      ],
    }),
    [statisticsQuery.dataUpdatedAt],
  );

  /* Render */
  return (
    <div className="card card-border border-base-300 bg-base-100">
      <div className="card-body">
        <h3 className="card-title">Balance</h3>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default MonthDurationBalanceChart as React.FC<MonthDurationBalanceChartProps>;
