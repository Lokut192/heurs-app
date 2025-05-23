'use client';

import {
  faArrowRotateLeft,
  faCalendar,
  faFloppyDisk,
  faSpinnerThird,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm, useStore } from '@tanstack/react-form';
import type { AxiosError } from 'axios';
import _ from 'lodash';
import { DateTime, Duration } from 'luxon';
import { useEffect, useState } from 'react';

import { Dialog, DialogTitle } from '@/_shared/components/ui/dialog/dialog';
import { ApiTimeType } from '@/modules/times/enums/time-type.enum';
import { useCreateTime } from '@/modules/times/hooks/mutations/use-create-time';
import { useUpdateTime } from '@/modules/times/hooks/mutations/use-update-time';
import { useTime } from '@/modules/times/hooks/queries/use-time';
import { useTimesTypes } from '@/modules/times/hooks/queries/use-times-types';
import type { ApiGetTime } from '@/modules/times/types/time';

export const SaveTimeDialog: React.FC<{
  timeId?: number | undefined;
  duration?: number | undefined;
  timeType?: string | undefined;
  notes?: string | null | undefined;
  open?: boolean | undefined;
  onClose?: (value: boolean) => void | undefined;
  onSave?: () => void | undefined;
  onSaved?: (time: ApiGetTime) => void | undefined;
  onError?: (error: AxiosError) => void | undefined;
  onSettled?: () => void | undefined;
}> = ({
  onClose,
  open,
  timeId,
  onError,
  onSave,
  onSaved,
  onSettled,
  duration = 60,
  timeType = ApiTimeType.Overtime,
  notes = null,
}) => {
  /* States */
  const [durationStrValue, setDurationStrValue] = useState<string>('');

  /* Queries */
  // Get time
  const { data: time, ...timeQuery } = useTime({
    timeId: timeId ?? null,
  });
  // Get times types
  const { data: timesTypes, ...timesTypesQuery } = useTimesTypes({
    queryOptions: {
      staleTime: 60 * 1000 * 5, // 5 minutes
      gcTime: 60 * 1000 * 5, // 5 minutes
    },
  });

  /* Mutations */
  // Create
  const createTimeMutation = useCreateTime({
    mutationOptions: {
      onSuccess(data) {
        onSaved?.(data);
        onClose?.(false);

        // Reset form after modal transition delay
        setTimeout(() => {
          form.reset();
        }, 300);
      },
      onSettled() {
        onSettled?.();
      },
      onError(error) {
        onError?.(error);
      },
      onMutate() {
        onSave?.();
      },
    },
  });
  // Update
  const updateTimeMutation = useUpdateTime({
    mutationOptions: {
      onSuccess(data) {
        onSaved?.(data);
        onClose?.(false);

        // Reset form after modal transition delay
        setTimeout(() => {
          form.reset();
        }, 300);
      },
      onSettled() {
        onSettled?.();
      },
      onError(error) {
        onError?.(error);
      },
      onMutate() {
        onSave?.();
      },
    },
  });

  /* Form */
  const form = useForm({
    defaultValues: {
      duration: duration,
      type: timeType,
      date: DateTime.now().toISODate()!,
      notes: notes ?? '',
    },
    onSubmit(props) {
      if (!!timeId) {
        updateTimeMutation.mutate({
          id: timeId,
          duration: props.value.duration,
          type: props.value.type,
          date: props.value.date,
          notes: props.value.notes,
        });
      } else {
        createTimeMutation.mutate({
          duration: props.value.duration,
          type: props.value.type,
          date: props.value.date,
          notes: props.value.notes,
        });
      }
    },
  });
  const formDuration = useStore(form.store, (state) => state.values.duration);

  /* Effects */
  // Reset form on closing modal
  useEffect(() => {
    if (open === false) {
      setTimeout(() => {
        form.reset();
      }, 300);
    }

    if (open === true && timeId && timeQuery.isSuccess && !!time) {
      form.setFieldValue('duration', time.duration);
      form.setFieldValue('type', time.type);
      form.setFieldValue('date', time.date);
      form.setFieldValue('notes', time.notes ?? '');
    }

    if (!timeId && duration) {
      form.setFieldValue('duration', duration);
    }

    if (!timeId && timeType) {
      form.setFieldValue('type', timeType);
    }

    if (!timeId && notes) {
      form.setFieldValue('notes', notes ?? '');
    }
  }, [open]);
  // Define values from given time
  useEffect(() => {
    if (timeId && timeQuery.isSuccess && !!time) {
      form.setFieldValue('duration', time.duration);
      form.setFieldValue('type', time.type);
      form.setFieldValue('date', time.date);
      form.setFieldValue('notes', time.notes ?? '');
    }
  }, [timeQuery.fetchStatus, timeId]);
  // Define dynamic values
  useEffect(() => {
    if (!timeId && duration) {
      form.setFieldValue('duration', duration);
    }
    if (!timeId && timeType) {
      form.setFieldValue('type', timeType);
    }
    if (!timeId && notes) {
      form.setFieldValue('notes', notes ?? '');
    }
  }, [duration, timeType, notes]);
  useEffect(() => {
    setDurationStrValue(
      Duration.fromObject({ minutes: formDuration })
        .shiftTo('hours', 'minutes')
        .toFormat('hh:mm'),
    );
  }, [formDuration]);

  /* Render */
  return (
    <Dialog
      open={open ?? true}
      onClose={(value) => {
        if (createTimeMutation.isPending) {
          return;
        }
        onClose?.(value);
      }}
      className="sm:max-w-3xl"
    >
      <DialogTitle>{timeId ? 'Edit' : 'Create'} time</DialogTitle>

      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          form.handleSubmit();
        }}
        className="grid grid-cols-1 gap-2 sm:grid-cols-6"
      >
        {/* String duration (hh:mm) */}
        <fieldset className="fieldset col-span-full">
          <legend className="fieldset-legend">Duration (hh:mm)</legend>

          <input
            type="text"
            id="str-duration"
            className="input w-full"
            pattern="^([01]?[0-9]|2[0-3]):([0-5][0-9])$"
            onBlur={(ev) => {
              if (/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(ev.target.value)) {
                form.setFieldValue(
                  'duration',
                  Duration.fromObject({
                    hours: +ev.target.value.split(':')[0],
                    minutes: +ev.target.value.split(':')[1],
                  }).as('minutes'),
                );
              }
            }}
            value={durationStrValue}
            onChange={(ev) => setDurationStrValue(ev.target.value)}
            required
          />
        </fieldset>

        {/* Buttons do add time */}
        <div className="col-span-full flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn btn-soft btn-accent"
            onClick={() => {
              const newDuration = form.getFieldValue('duration') + 60;
              form.setFieldValue('duration', newDuration);
            }}
          >
            +01:--
          </button>
          <button
            type="button"
            className="btn btn-soft btn-accent"
            onClick={() => {
              const newDuration = Math.max(
                0,
                form.getFieldValue('duration') - 60,
              );
              form.setFieldValue('duration', newDuration);
            }}
          >
            -01:--
          </button>
        </div>

        <div className="col-span-full flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="btn btn-soft btn-secondary"
            onClick={() => {
              const prevDuration = form.getFieldValue('duration');
              const nextDuration = Math.floor(prevDuration / 60) * 60;
              form.setFieldValue('duration', nextDuration);
            }}
          >
            --:00
          </button>
          <button
            type="button"
            className="btn btn-soft btn-secondary"
            onClick={() => {
              const prevDuration = form.getFieldValue('duration');
              const nextDuration = Math.floor(prevDuration / 60) * 60 + 15;
              form.setFieldValue('duration', nextDuration);
            }}
          >
            --:15
          </button>
          <button
            type="button"
            className="btn btn-soft btn-secondary"
            onClick={() => {
              const prevDuration = form.getFieldValue('duration');
              const nextDuration = Math.floor(prevDuration / 60) * 60 + 30;
              form.setFieldValue('duration', nextDuration);
            }}
          >
            --:30
          </button>
          <button
            type="button"
            className="btn btn-soft btn-secondary"
            onClick={() => {
              const prevDuration = form.getFieldValue('duration');
              const nextDuration = Math.floor(prevDuration / 60) * 60 + 45;
              form.setFieldValue('duration', nextDuration);
            }}
          >
            --:45
          </button>
        </div>

        <form.Field name="duration">
          {(field) => (
            <fieldset
              className="fieldset col-span-full"
              style={{
                // display:
                //   process.env.NODE_ENV === 'development' ? 'block' : 'none',
                display: 'none',
              }}
            >
              <legend className="fieldset-legend">Duration (in minutes)</legend>

              <input
                type="number"
                id="duration"
                name="duration"
                className="input w-full"
                step={1}
                min={0}
                required
                value={field.state.value}
                onChange={(ev) => field.handleChange(+ev.target.value)}
              />
            </fieldset>
          )}
        </form.Field>
        <form.Field name="date">
          {(field) => (
            <fieldset className="fieldset sm:col-span-3">
              <legend className="fieldset-legend relative w-full">
                <span>Date</span>

                <button
                  type="button"
                  className="text-accent absolute right-0 flex cursor-pointer items-center gap-x-1 px-2 py-1.5 text-xs/5 font-medium"
                  onClick={() => field.handleChange(DateTime.now().toISODate())}
                >
                  <FontAwesomeIcon icon={faCalendar} className="fa-fw fa-sm" />
                  <span>Today</span>
                </button>
              </legend>

              <input
                type="date"
                name="date"
                id="date"
                className="input w-full"
                required
                value={field.state.value}
                onChange={(ev) => field.handleChange(ev.target.value)}
              />
            </fieldset>
          )}
        </form.Field>
        <form.Field name="type">
          {(field) => (
            <fieldset className="fieldset sm:col-span-3">
              <legend className="fieldset-legend">
                Type{' '}
                {timesTypesQuery.isPending && (
                  <FontAwesomeIcon
                    icon={faSpinnerThird}
                    className="fa-fw fa-xs text-accent animate-spin"
                  />
                )}
              </legend>

              <select
                name="type"
                id="type"
                value={field.state.value}
                required
                onChange={(ev) => field.handleChange(ev.target.value)}
                className="select w-full"
                disabled={timesTypesQuery.isPending}
              >
                {timesTypes.map((type) => (
                  <option key={`time-type-${type}`} value={type}>
                    {_.startCase(type)}
                  </option>
                ))}
              </select>
            </fieldset>
          )}
        </form.Field>

        <form.Field name="notes">
          {(field) => (
            <fieldset className="fieldset col-span-full">
              <legend className="fieldset-legend relative w-full">
                <span>Notes</span>

                <button
                  type="button"
                  className="text-accent absolute right-0 flex cursor-pointer items-center gap-x-1 px-2 py-1.5 text-xs/5 font-medium"
                  onClick={() => field.handleChange('')}
                >
                  <FontAwesomeIcon
                    icon={faArrowRotateLeft}
                    className="fa-fw fa-sm"
                  />
                  <span>Reset</span>
                </button>
              </legend>

              <textarea
                name={field.name}
                id={field.name}
                value={field.state.value}
                onChange={(ev) => field.handleChange(ev.target.value)}
                className="textarea w-full"
                rows={5}
              />
            </fieldset>
          )}
        </form.Field>

        <div className="col-span-full mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            className="btn w-full sm:w-fit"
            onClick={() => onClose?.(false)}
            disabled={createTimeMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary w-full sm:w-fit"
            disabled={createTimeMutation.isPending || timesTypesQuery.isPending}
          >
            {createTimeMutation.isPending ? (
              <FontAwesomeIcon
                icon={faSpinnerThird}
                className="fa-fw animate-spin"
              />
            ) : (
              <FontAwesomeIcon icon={faFloppyDisk} className="fa-fw" />
            )}
            Save
          </button>
        </div>
      </form>
    </Dialog>
  );
};
