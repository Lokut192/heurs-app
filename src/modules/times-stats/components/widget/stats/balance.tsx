'use client';

import { useDurationString } from '@/modules/times-stats/hooks/use-duration-string';

export type BalanceStatsWidgetProps = {
  balance: number;
  title?: string | undefined;
  description?: React.ReactNode | undefined;
};

function BalanceStatsWidget({
  balance,
  title,
  description,
}: BalanceStatsWidgetProps): React.ReactNode {
  // Format duration
  const strDuration = useDurationString(balance);

  // Render
  return (
    <div className="stat">
      <h3 className="stat-title">{title ?? 'Balance'}</h3>

      <div className="stat-value">
        {balance > 0 ? '+' : ''} {strDuration}
      </div>

      {description}
    </div>
  );
}

export default BalanceStatsWidget as React.FC<BalanceStatsWidgetProps>;
