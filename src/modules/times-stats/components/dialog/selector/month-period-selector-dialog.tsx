'use client';

import { faEnvelope, faSpinnerThird } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from '@tanstack/react-form';
import { DateTime } from 'luxon';
import React, { useEffect, useMemo } from 'react';
import { z } from 'zod/v4';

import { Dialog, DialogTitle } from '@/_shared/components/ui/dialog/dialog';
import { useLoggedUser } from '@/modules/auth/hooks/use-logged-user';

export type MonthPeriodSelectorDialogProps = {
  /* Dialog props */
  className?: string;
  open?: boolean | undefined;
  onClose: (value: boolean) => void;

  /* Props */
  month: number;
  year: number;
  loading?: boolean | undefined;
  // onSubmit?: (request: { month: number; year: number; to: string }) => void;
  onSubmit?: (request: { month: number; year: number }) => void;
};

function MonthPeriodSelectorDialog({
  month,
  year,
  loading = false,
  onSubmit,
  ...dialogProps
}: MonthPeriodSelectorDialogProps) {
  /* Logged user */
  const { email: loggedUserEmail } = useLoggedUser();

  /* Memoized values */
  const allMonths = useMemo(() => {
    return Array(12)
      .fill(0)
      .map((_, index) => index + 1);
  }, []);

  /* Form */
  const form = useForm({
    defaultValues: {
      month,
      year: year.toString(),
      // to: loggedUserEmail ?? '',
    },
    onSubmit({ value }) {
      onSubmit?.({
        month: value.month,
        year: +value.year,
        // to: value.to,
      });
    },
  });

  /* Effects */
  // Update form values
  useEffect(() => {
    form.setFieldValue('month', month);
    form.setFieldValue('year', year.toString());
  }, [month, year]);
  // Reset form
  useEffect(() => {
    if (dialogProps.open) {
      return;
    }
    setTimeout(() => {
      form.reset();
    }, 200);
  }, [dialogProps.open]);

  /* Render */
  return (
    <Dialog {...dialogProps}>
      <DialogTitle>Select month to get report for</DialogTitle>

      <p className="text-sm/5 font-medium text-gray-600">
        You will receive an email to your address (
        <span className="font-semibold">{loggedUserEmail}</span>) with the
        report of the selected month below.
        <br />
        The email can take a few minutes to arrive.
      </p>

      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-6">
          <form.Field name="month">
            {(field) => (
              <fieldset className="fieldset col-span-full">
                <legend className="fieldset-legend">Month</legend>

                <label htmlFor={field.name} className="select w-full">
                  <select
                    name={field.name}
                    id={field.name}
                    value={field.state.value.toString()}
                    onChange={(ev) => {
                      field.handleChange(+ev.target.value);
                    }}
                    required
                  >
                    {allMonths.map((m) => (
                      <option
                        key={`month-selector-month-${m}`}
                        value={m.toString()}
                      >
                        {DateTime.fromObject({ month: m, year })
                          .setLocale('en')
                          .toFormat('LLLL')}
                      </option>
                    ))}
                  </select>
                </label>
              </fieldset>
            )}
          </form.Field>
          <form.Field
            name="year"
            validators={{
              onSubmit: z.string().regex(/^\d{4}$/),
            }}
          >
            {(field) => (
              <fieldset className="fieldset col-span-full">
                <legend className="fieldset-legend">Year</legend>

                <label htmlFor={field.name} className="input w-full">
                  <input
                    type="text"
                    name={field.name}
                    id={field.name}
                    value={field.state.value}
                    onChange={(ev) => {
                      field.handleChange(ev.target.value);
                    }}
                    pattern="[0-9]{4}"
                    minLength={4}
                    maxLength={4}
                    required
                  />
                </label>
              </fieldset>
            )}
          </form.Field>
          {/* <form.Field
            name="to"
            validators={{
              onSubmit: z.email(),
            }}
          >
            {(field) => (
              <fieldset className="fieldset col-span-full">
                <legend className="fieldset-legend">To</legend>

                <label htmlFor={field.name} className="input w-full">
                  <input
                    type="email"
                    name={field.name}
                    id={field.name}
                    value={field.state.value}
                    onChange={(ev) => {
                      field.handleChange(ev.target.value);
                    }}
                    required
                  />
                </label>
              </fieldset>
            )}
          </form.Field> */}

          <div className="col-span-full mt-5 w-full sm:flex sm:items-center sm:justify-end">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex w-full items-center justify-center sm:w-fit"
            >
              {loading ? (
                <FontAwesomeIcon
                  icon={faSpinnerThird}
                  className="fa-fw fa-md animate-spin"
                />
              ) : (
                <FontAwesomeIcon icon={faEnvelope} className="fa-fw fa-md" />
              )}
              <span>Receive</span>
            </button>
          </div>
        </div>
      </form>
    </Dialog>
  );
}

export default MonthPeriodSelectorDialog as React.FC<MonthPeriodSelectorDialogProps>;
