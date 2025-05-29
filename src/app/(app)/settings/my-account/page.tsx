import type { Metadata } from 'next';
import { Suspense } from 'react';

import getMyPersonalInformations from '@/_shared/services/my-account/get-my-personal-informations';

import PersonalInformationsForm from './_components/form/personal-informations-form';

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
  /* Render */
  return (
    <>
      <div className="divide-base-200 divide-y">
        <Suspense>
          <PersonalInformationsForm
            fetchPersonalInformations={getMyPersonalInformations()}
          />
        </Suspense>
      </div>
    </>
  );
}
