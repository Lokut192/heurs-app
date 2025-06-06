'use client';

import {
  faCircleExclamation,
  faFloppyDisk,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from '@tanstack/react-form';
import { isAxiosError } from 'axios';
import { use, useEffect } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod/v4';

import { useUpdateMySetting } from '@/_shared/hooks/mutations/me/settings/use-update-my-setting';
import { apiErrorSchema } from '@/_shared/schemas/api/api-error.schema';
import type { ApiGetUserSetting } from '@/_shared/schemas/api/setting/user/api-user-setting.schema';

export type EmailNotificationsFormProps = {
  fetchMyMonthlyEmailNotificationPreference: Promise<
    | {
        status: number;
        statusText: string;
        headers: Record<string, string>;
        data: ApiGetUserSetting;
        error?: undefined;
      }
    | {
        status: number;
        statusText: string;
        headers: Record<string, string>;
        data: null;
        error: { message: string };
      }
  >;
  fetchMyWeeklyEmailNotificationPreference: Promise<
    | {
        status: number;
        statusText: string;
        headers: Record<string, string>;
        data: ApiGetUserSetting;
        error?: undefined;
      }
    | {
        status: number;
        statusText: string;
        headers: Record<string, string>;
        data: null;
        error: { message: string };
      }
  >;
};

function EmailNotificationsForm({
  fetchMyMonthlyEmailNotificationPreference,
  fetchMyWeeklyEmailNotificationPreference,
}: EmailNotificationsFormProps): React.ReactNode {
  const myMonthlyEmailNotificationPreference = use(
    fetchMyMonthlyEmailNotificationPreference,
  );
  const myWeeklyEmailNotificationPreference = use(
    fetchMyWeeklyEmailNotificationPreference,
  );

  /* Form */
  const form = useForm({
    defaultValues: {
      monthly: z
        .stringbool()
        .catch(false)
        .parse(myMonthlyEmailNotificationPreference?.data?.value),
      weekly: z
        .stringbool()
        .catch(false)
        .parse(myWeeklyEmailNotificationPreference?.data?.value),
    },

    onSubmit({ value }) {
      updateMySettingMutation.mutate({
        value: value.monthly ? 'true' : 'false',
        code: 'MONTHLY_TIMES_STATS_EMAIL',
        toastId: toast.loading('Saving notification setting...'),
      });
      updateMySettingMutation.mutate({
        value: value.weekly ? 'true' : 'false',
        code: 'WEEKLY_TIMES_STATS_EMAIL',
        toastId: toast.loading('Saving notification setting...'),
      });
    },
  });

  /* Mutations */
  const updateMySettingMutation = useUpdateMySetting({
    mutationOptions: {
      onMutate(_variables) {},
      onSuccess(data, { toastId, code }, _context) {
        form.setFieldValue(
          code === 'MONTHLY_TIMES_STATS_EMAIL' ? 'monthly' : 'weekly',
          z.stringbool().catch(false).parse(data.value),
        );
        if (toastId) {
          toast.update(toastId, {
            render: 'Preference saved',
            type: 'success',
            isLoading: false,
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
      },
      onError(error, { toastId }, _context) {
        if (toastId) {
          toast.update(toastId, {
            render: error.message,
            type: 'error',
            isLoading: false,
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
        if (isAxiosError(error)) {
          if (error.response) {
            const safeErrorData = apiErrorSchema.safeParse(error.response.data);
            if (!!safeErrorData.error) {
              toast.error('Something went wrong');
              return;
            }
            switch (error.response.status) {
              default:
                break;
            }
          }
        }
      },
      onSettled(_data, _error, _variables, _context) {},
    },
  });

  /* Effects */
  // Update form with fresh data
  useEffect(() => {
    form.setFieldValue(
      'monthly',
      z
        .stringbool()
        .catch(false)
        .parse(myMonthlyEmailNotificationPreference.data?.value),
    );
  }, [myMonthlyEmailNotificationPreference.data?.value]);
  // Update form with fresh data
  useEffect(() => {
    form.setFieldValue(
      'weekly',
      z
        .stringbool()
        .catch(false)
        .parse(myWeeklyEmailNotificationPreference.data?.value),
    );
  }, [myWeeklyEmailNotificationPreference.data?.value]);

  /* Render */
  return (
    <form
      className="md:col-span-2"
      onSubmit={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="grid w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <form.Field name="monthly">
          {(field) => (
            <div className="col-span-full">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Monthly times statistics report (First day of the month at
                  9am)
                </legend>

                <input
                  type="checkbox"
                  name={field.name}
                  id={field.name}
                  className="toggle"
                  checked={field.state.value}
                  onChange={(ev) => {
                    field.handleChange(ev.target.checked);
                  }}
                />
              </fieldset>

              {!field.state.meta.isValid &&
                field.state.meta.errors.map((err) => (
                  <div
                    className="text-error mt-1 flex items-start"
                    key={`err-${field.name}-${err}`}
                  >
                    <FontAwesomeIcon
                      icon={faCircleExclamation}
                      className="fa-lg fa-fw mr-1.5 pt-1"
                    />
                    <p className="text-base/6 font-semibold whitespace-break-spaces">
                      {err}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </form.Field>
        <form.Field name="weekly">
          {(field) => (
            <div className="col-span-full">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">
                  Weekly times statistics report (First day of the week at 9am)
                </legend>

                <input
                  type="checkbox"
                  name={field.name}
                  id={field.name}
                  className="toggle"
                  checked={field.state.value}
                  onChange={(ev) => {
                    field.handleChange(ev.target.checked);
                  }}
                />
              </fieldset>

              {!field.state.meta.isValid &&
                field.state.meta.errors.map((err) => (
                  <div
                    className="text-error mt-1 flex items-start"
                    key={`err-${field.name}-${err}`}
                  >
                    <FontAwesomeIcon
                      icon={faCircleExclamation}
                      className="fa-lg fa-fw mr-1.5 pt-1"
                    />
                    <p className="text-base/6 font-semibold whitespace-break-spaces">
                      {err}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </form.Field>

        <div className="col-span-full flex items-center justify-end gap-2 sm:gap-4">
          <button
            type="submit"
            disabled={updateMySettingMutation.isPending}
            className="btn btn-primary"
          >
            <FontAwesomeIcon icon={faFloppyDisk} className="fa-fw fa-md" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </form>
  );
}

export default EmailNotificationsForm as React.FC<EmailNotificationsFormProps>;
