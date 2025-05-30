import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

import getMyPersonalInformations from '@/_shared/services/my-account/get-my-personal-informations';
import getMySettingByCode from '@/_shared/services/my-account/get-my-setting-by-code';
import gatAllTimezones from '@/_shared/services/timezone/get-all';
import { authOptions } from '@/modules/auth/modules/next-auth/auth.options';

import PersonalInformationsForm from './_components/form/personal-informations/personal-informations-form';
import PersonalInformationsLabel from './_components/form/personal-informations/personal-informations-label';
import TimezoneForm from './_components/form/timezone/timezone-form';
import TimezoneLabel from './_components/form/timezone/timezone-label';
import PersonalInformationsFormPlaceholder from './_components/placeholder/form/personal-informations-form-placeholder';
import TimezoneFormPlaceholder from './_components/placeholder/form/timezone-form-placeholder';

type AccountIndexProps = {
  searchParams: Promise<Record<string, string>>;
};

export const generateMetadata = async (
  _props: AccountIndexProps,
): Promise<Metadata> => {
  return {
    title: 'Account',
  };
};

export default async function AccountIndex(
  _props: AccountIndexProps,
): Promise<React.ReactNode> {
  /* Session */
  const session = await getServerSession(authOptions);

  /* Render */
  return (
    <>
      <div className="divide-base-200 divide-y">
        <PersonalInformationsLabel>
          <Suspense fallback={<PersonalInformationsFormPlaceholder />}>
            <PersonalInformationsForm
              fetchPersonalInformations={getMyPersonalInformations(session)}
            />
          </Suspense>
        </PersonalInformationsLabel>
        <TimezoneLabel>
          <Suspense fallback={<TimezoneFormPlaceholder />}>
            <TimezoneForm
              fetchMyTimezone={getMySettingByCode('TIME_ZONE', session)}
              fetchAllTimezone={gatAllTimezones(session)}
            />
          </Suspense>
        </TimezoneLabel>
      </div>
    </>
  );
}
