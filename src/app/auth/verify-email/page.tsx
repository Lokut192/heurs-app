import { faSpinnerThird } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { z } from 'zod/v4';

import getAxiosInstance from '@/_shared/services/get-axios-instance';
import verifyMyEmail from '@/modules/me/services/verify-my-email.service';

import VerifyEmailSuccessBlock from './_components/block/sucess/verify-email-success-block';

// #region Types

type VerifyEmailIndexProps = {
  searchParams: Promise<Record<string, string>>;
};

// #endregion Types

// #region Metadata

export const generateMetadata = async (
  _props: VerifyEmailIndexProps,
): Promise<Metadata> => {
  return {
    title: 'Verify email',
  };
};

// #endregion Metadata

// #region Schemas

const verifyEmailIndexSearchParametersSchema = z.object({
  token: z.string().trim().nonempty(),
});

// #endregion Schemas

// #region Page

export default async function VerifyEmailIndex({
  searchParams: awaitableSearchParams,
}: VerifyEmailIndexProps) {
  /* Search parameters */
  const searchParams = await awaitableSearchParams;

  // Parse search parameters
  const parameters =
    verifyEmailIndexSearchParametersSchema.safeParse(searchParams);

  if (!parameters.success) {
    notFound();
  }

  const api = await getAxiosInstance();

  /* Render */
  return (
    <>
      <div className="card card-border border-base-300 bg-base-100 mx-auto w-full max-w-sm shadow sm:w-full sm:max-w-md">
        <div className="card-body">
          {/* <h1 className="card-title">Email verification</h1> */}

          <div className="">
            <Suspense
              fallback={
                <div className="text-primary flex flex-col items-center justify-center gap-4">
                  <FontAwesomeIcon
                    icon={faSpinnerThird}
                    className="fa-3x text-primary animate-spin"
                  />
                  <div className="text-base/6 font-bold text-inherit">
                    Verifying your email address...
                  </div>
                </div>
              }
            >
              <VerifyEmailSuccessBlock
                verifyEmailPromise={verifyMyEmail(parameters.data.token, api)}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}

// #endregion Page
