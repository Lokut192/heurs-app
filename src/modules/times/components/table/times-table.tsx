'use client';

import { faCircleXmark } from '@fortawesome/pro-light-svg-icons';
import {
  faCopy,
  faPenToSquare,
  faSpinnerThird,
  faTrashCan,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime, Duration } from 'luxon';
import { useCallback, useContext, useEffect, useState } from 'react';

import { SortTableButton } from '@/_shared/components/button/table/sort-table-btn';

import { TimesTableContext } from '../../contexts/times-table.ctx';
import type { ApiTimeType } from '../../enums/time-type.enum';
import { TimeTypeBadge } from '../badge/time-type-badge';
import { DeleteTimeDialog } from '../dialog/time/delete-time-dialog';
import { SaveTimeDialog } from '../dialog/time/save-time-dialog';

const debugEnabled = process.env.NODE_ENV === 'development' && false;

export const TimesTable: React.FC<object> = () => {
  /* States */
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [timeToEditId, setTimeToEditId] = useState<number | null>(null);
  const [timeToDeleteId, setTimeToDeleteId] = useState<number | null>(null);
  const [duplicateValue, setDuplicateValues] = useState<null | {
    duration: number;
    type: ApiTimeType;
  }>(null);
  const [openDuplicateModal, setOpenDuplicateModal] = useState<boolean>(false);

  /* Context */
  const { times, timesQuery, order, setOrder, orderby, setOrderby } =
    useContext(TimesTableContext);

  /* Callbacks */
  // Handle click on table body
  const handleClickOnTableBody: React.MouseEventHandler<HTMLTableSectionElement> =
    useCallback(
      (ev) => {
        const target = ev.target as HTMLElement;
        const button = target.closest(
          'button[data-action]',
        ) as HTMLButtonElement | null;
        if (!button) return;

        const action = button.dataset.action;
        const strTimeId = button.dataset.timeId;
        if (!action || !strTimeId || !/^\d+$/.test(strTimeId)) return;

        const timeId = Number(strTimeId);
        const time = times.find((t) => t.id === timeId);

        if (!time) return;

        switch (action) {
          case 'edit':
            setTimeToEditId(time.id);
            setOpenEditModal(true);
            break;
          case 'delete':
            setTimeToDeleteId(time.id);
            setOpenDeleteModal(true);
            break;
          case 'duplicate':
            setDuplicateValues({
              duration: time.duration,
              type: time.type,
            });
            setOpenDuplicateModal(true);
            break;
          default:
            break;
        }
      },
      [timesQuery.dataUpdatedAt],
    );

  /* Effects */
  // Reset time id
  useEffect(() => {
    if (openEditModal === false) {
      setTimeout(() => {
        setTimeToEditId(null);
      }, 300);
    }
  }, [openEditModal]);
  // Close modal if time is null
  useEffect(() => {
    if (timeToEditId === null) {
      setOpenEditModal(false);
    }
  }, [timeToEditId]);
  // Reset time id
  useEffect(() => {
    if (openDeleteModal === false) {
      setTimeout(() => {
        setTimeToEditId(null);
      }, 300);
    }
  }, [openDeleteModal]);
  // Close modal if time is null
  useEffect(() => {
    if (timeToDeleteId === null) {
      setOpenDeleteModal(false);
    }
  }, [timeToDeleteId]);
  useEffect(() => {
    if (openDuplicateModal === false) {
      setTimeout(() => {
        setDuplicateValues(null);
      }, 300);
    }
  }, [openDuplicateModal]);

  /* Render */
  return (
    <>
      {/* Edit time modal */}
      <SaveTimeDialog
        timeId={timeToEditId ?? undefined}
        open={openEditModal}
        onClose={setOpenEditModal}
      />
      {/* Duplicate time modal */}
      <SaveTimeDialog
        timeId={undefined}
        duration={duplicateValue?.duration}
        timeType={duplicateValue?.type}
        open={openDuplicateModal}
        onClose={setOpenDuplicateModal}
      />
      {/* Delete time modal */}
      <DeleteTimeDialog
        timeId={timeToDeleteId ?? null}
        open={openDeleteModal}
        onClose={setOpenDeleteModal}
      />

      {/* Alert feedback on error */}
      {timesQuery.isError && (
        <div role="alert" className="alert alert-error">
          <FontAwesomeIcon icon={faCircleXmark} className="fa-fw fa-lg" />
          {timesQuery.error.message}
        </div>
      )}

      {/* Table */}
      {(timesQuery.isSuccess || timesQuery.isPending) && (
        <div className="overflow-x-auto">
          <table className="table-zebra table">
            <thead>
              <tr>
                {debugEnabled && <th className="text-left">Id</th>}
                <th className="text-left">
                  Duration{' '}
                  <SortTableButton
                    propName="duration"
                    order={order}
                    orderby={orderby as 'asc' | 'desc'}
                    onChangeOrder={({ order, orderby }) => {
                      setOrder(order);
                      setOrderby(orderby);
                    }}
                  />
                </th>
                <th className="text-left">
                  Date{' '}
                  <SortTableButton
                    propName="date"
                    order={order}
                    orderby={orderby as 'asc' | 'desc'}
                    onChangeOrder={({ order, orderby }) => {
                      setOrder(order);
                      setOrderby(orderby);
                    }}
                  />
                </th>
                <th className="text-center">Type</th>
                {/* Actions */}
                {/* <th className="text-center">Actions</th> */}
                <th className="text-center" />
              </tr>
            </thead>

            <tbody onClick={handleClickOnTableBody}>
              {timesQuery.isPending && (
                <tr>
                  <td colSpan={debugEnabled ? 5 : 4}>
                    <div className="text-accent flex items-center justify-center gap-2 p-2">
                      <FontAwesomeIcon
                        icon={faSpinnerThird}
                        className="fa-fw fa-lg animate-spin"
                      />

                      <span className="text-lg/7 font-semibold italic">
                        Loading times...
                      </span>
                    </div>
                  </td>
                </tr>
              )}
              {timesQuery.isSuccess &&
                times.map((time) => (
                  <tr key={`time-${time.id}`}>
                    {debugEnabled && <td className="text-left">{time.id}</td>}
                    <td className="text-left">
                      {Duration.fromObject({ minutes: time.duration })
                        .shiftTo('hours', 'minutes')
                        .toFormat("h'h' mm'm'")}
                    </td>
                    <td className="text-left">
                      <time dateTime={time.date}>
                        {DateTime.fromISO(time.date).toLocaleString()}
                      </time>
                    </td>
                    <td className="text-center">
                      <TimeTypeBadge timeType={time.type} />
                    </td>

                    <td className="text-end">
                      <div className="flex items-center justify-end gap-2">
                        <div className="tooltip" data-tip="Duplicate">
                          <button
                            type="button"
                            className="btn btn-soft btn-secondary"
                            data-action="duplicate"
                            data-time-id={time.id.toString()}
                          >
                            <FontAwesomeIcon
                              className="fa-fw fa-md"
                              icon={faCopy}
                            />
                          </button>
                        </div>
                        <div className="tooltip" data-tip="Edit">
                          <button
                            type="button"
                            data-action="edit"
                            data-time-id={time.id.toString()}
                            className="btn btn-soft btn-accent"
                          >
                            <FontAwesomeIcon
                              className="fa-fw fa-md"
                              icon={faPenToSquare}
                            />
                          </button>
                        </div>
                        <div className="tooltip" data-tip="Delete">
                          <button
                            type="button"
                            className="btn btn-soft btn-error"
                            data-action="delete"
                            data-time-id={time.id.toString()}
                          >
                            <FontAwesomeIcon
                              className="fa-fw fa-md"
                              icon={faTrashCan}
                            />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};
