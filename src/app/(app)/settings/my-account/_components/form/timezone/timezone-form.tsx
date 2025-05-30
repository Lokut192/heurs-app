'use client';

import {
  faCircleExclamation,
  faFloppyDisk,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from '@tanstack/react-form';
import { isAxiosError } from 'axios';
import { use, useEffect, useState } from 'react';
import { type Id, toast } from 'react-toastify';
import { ZodError } from 'zod/v4';

import { useUpdateMyTimezone } from '@/_shared/hooks/mutations/me/timezone/use-update-my-timezone';
import { useRevalidateTags } from '@/_shared/hooks/mutations/tags/use-revalidate-tags';
import { apiErrorSchema } from '@/_shared/schemas/api/api-error.schema';
import type { ApiGetUserSetting } from '@/_shared/schemas/api/setting/user/api-user-setting.schema';
import type { ApiGetTimezone } from '@/_shared/schemas/api/timezone/api-timezone.schema';

export type TimezoneFormProps = {
  fetchMyTimezone: Promise<
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
  fetchAllTimezone: Promise<
    | {
        status: number;
        statusText: string;
        headers: Record<string, string>;
        data: ApiGetTimezone[];
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

function TimezoneForm({
  fetchMyTimezone,
  fetchAllTimezone,
}: TimezoneFormProps): React.ReactNode {
  const myPersonalInformationsResponse = use(fetchMyTimezone);
  const allTimezonesResponse = use(fetchAllTimezone);

  /* States */
  const [toastId, setToastId] = useState<Id | null>(null);

  /* Form */
  const form = useForm({
    defaultValues: {
      timezoneName: myPersonalInformationsResponse?.data?.value ?? '',
    },

    onSubmit({ value }) {
      updateMyTimezoneMutation.mutate({ value: value.timezoneName });
    },
  });

  /* Mutations */
  const revalidateTagsMutation = useRevalidateTags();
  const updateMyTimezoneMutation = useUpdateMyTimezone({
    mutationOptions: {
      onMutate(_variables) {
        setToastId(toast.loading('Saving timezone...'));
      },

      onSuccess(data, _variables, _context) {
        revalidateTagsMutation.mutate(['my-timezone']);

        form.update({
          defaultValues: {
            timezoneName: data.value,
          },
        });

        form.setFieldValue('timezoneName', data.value);

        if (toastId) {
          toast.update(toastId, {
            render: 'Timezone saved',
            type: 'success',
            isLoading: false,
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
          });
        }
      },

      onError(error, _variables, _context) {
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
        } else if (error instanceof ZodError) {
          for (const issue of error.issues) {
            for (const path of issue.path) {
              form.fieldInfo[path as 'timezoneName']?.instance?.setErrorMap({
                onChange: [issue.message],
              });
            }
          }
        }
      },

      onSettled(_data, _error, _variables, _context) {
        setToastId(null);
      },
    },
  });

  /* Effects */
  // Update form with fresh data
  useEffect(() => {
    form.setFieldValue(
      'timezoneName',
      myPersonalInformationsResponse.data?.value ?? '',
    );
  }, [myPersonalInformationsResponse.data?.value]);

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
        <form.Field name="timezoneName">
          {(field) => (
            <div className="sm:col-span-2">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Timezone</legend>

                <label htmlFor={field.name} className="select w-full">
                  <select
                    name={field.name}
                    id={field.name}
                    value={field.state.value}
                    onChange={(ev) => field.handleChange(ev.target.value)}
                    className="w-full"
                    required
                  >
                    {(allTimezonesResponse.data ?? []).map((tz) => (
                      <option key={`timezone-${tz.name}`} value={tz.name}>
                        {tz.name} [ {tz.offset < 0 ? '-' : '+'}{' '}
                        {Math.abs(tz.offset) / 60} UTC ]
                      </option>
                    ))}
                  </select>
                </label>
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
            disabled={updateMyTimezoneMutation.isPending}
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

export default TimezoneForm as React.FC<TimezoneFormProps>;
