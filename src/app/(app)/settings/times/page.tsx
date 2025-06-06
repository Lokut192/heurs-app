import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import getMySettingByCode from '@/_shared/services/my-account/get-my-setting-by-code';
import { authOptions } from '@/modules/auth/modules/next-auth/auth.options';
import DeleteAllTimesForm from '@/modules/times/components/form/settings/times-settings-form';

import EmailNotificationsForm from './_components/form/email-notifications/email-notfications-form';
import EmailNotificationsLabel from './_components/form/email-notifications/email-notifications-label';
import EmailNotificationsFormPlaceholder from './_components/placeholder/form/email-notifications-placeholder';

type TimesSettingsIndexProps = {
  searchParams: Promise<Record<string, string>>;
};

export const generateMetadata = async (
  _props: TimesSettingsIndexProps,
): Promise<Metadata> => {
  return {
    title: 'Times',
  };
};

export default async function TimesSettingsIndex(
  _props: TimesSettingsIndexProps,
): Promise<React.ReactNode> {
  /* Session */
  const session = await getServerSession(authOptions);

  /* Render */
  return (
    <>
      <div className="divide-base-200 divide-y">
        {/* Email notifications */}
        <EmailNotificationsLabel>
          <Suspense fallback={<EmailNotificationsFormPlaceholder />}>
            <EmailNotificationsForm
              fetchMyMonthlyEmailNotificationPreference={getMySettingByCode(
                'MONTHLY_TIMES_STATS_EMAIL',
                session,
              )}
              fetchMyWeeklyEmailNotificationPreference={getMySettingByCode(
                'WEEKLY_TIMES_STATS_EMAIL',
                session,
              )}
            />
          </Suspense>
        </EmailNotificationsLabel>

        <DeleteAllTimesForm />
      </div>
    </>
  );
}
