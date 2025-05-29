import type { Metadata } from 'next';
import { Suspense } from 'react';

import getMyPersonalInformations from '@/_shared/services/my-account/get-my-personal-informations';

import PersonalInformationsForm from './_components/form/personal-informations/personal-informations-form';
import PersonalInformationsLabel from './_components/form/personal-informations/personal-informations-label';
import PersonalInformationsFormPlaceholder from './_components/placeholder/form/personal-informations-form-placeholder';

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
        <PersonalInformationsLabel>
          <Suspense fallback={<PersonalInformationsFormPlaceholder />}>
            <PersonalInformationsForm
              fetchPersonalInformations={getMyPersonalInformations()}
            />
          </Suspense>
        </PersonalInformationsLabel>
      </div>
    </>
  );
}
