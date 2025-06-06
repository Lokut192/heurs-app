'use client';

import { faCheck } from '@fortawesome/pro-light-svg-icons';
import { faEnvelope } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMachine } from '@xstate/react';
import { DateTime } from 'luxon';
import { useContext, useEffect, useMemo } from 'react';

import { Dialog, DialogTitle } from '@/_shared/components/ui/dialog/dialog';
import { TimesTableContext } from '@/modules/times/contexts/times-table.ctx';

import MonthPeriodSelectorDialog from '../components/dialog/selector/month-period-selector-dialog';
import { useRequestMonthTimesStatsReport } from '../hooks/mutations/useRequestMonthTimesStatsReport';
import { sendMonthReportMachine } from '../machine/send-month-report.machine';

function SendMonthReportBtnProvider() {
  /* Context */
  const { from } = useContext(TimesTableContext);

  /* Machine */
  const [machineState, machineSend] = useMachine(sendMonthReportMachine);

  /* Mutations */
  // Send email request
  const requestEmail = useRequestMonthTimesStatsReport({
    mutationOptions: {
      onMutate() {
        machineSend({ type: 'SEND_REQUEST' });
      },
      onSuccess() {
        machineSend({ type: 'SUCCESS' });
      },
      onError() {
        machineSend({ type: 'ERROR' });
      },
    },
  });

  /* Memoized values */
  // Calculate if the month period selector dialog should be open
  const monthSelectorDialogOpen = useMemo(() => {
    return new Set([
      'show-period-selector-dialog',
      'send-month-report-request',
      'sending-month-report-request',
    ]).has(machineState.value as string);
  }, [machineState.value]);

  useEffect(() => {
    switch (machineState.value) {
      case 'send-month-report-request':
        if (machineState.context.month && machineState.context.year) {
          requestEmail.mutate({
            month: machineState.context.month,
            year: machineState.context.year,
          });
        }
        break;
      case 'show-send-month-report-request-success-dialog':
        // eslint-disable-next-line no-case-declarations
        const successDialogTimeout = setTimeout(() => {
          machineSend({ type: 'EXIT' });
        }, 2000);

        return () => {
          clearTimeout(successDialogTimeout);
        };
      default:
        break;
    }

    return () => {};
  }, [machineState.value]);

  /* Render */
  return (
    <>
      {/* Month period selector */}
      <MonthPeriodSelectorDialog
        month={DateTime.fromISO(from).month}
        year={DateTime.fromISO(from).year}
        open={monthSelectorDialogOpen}
        onClose={(_value) => {
          machineSend({ type: 'EXIT' });
        }}
        loading={machineState.value === 'sending-month-report-request'}
        onSubmit={({ month, year }) => {
          machineSend({ type: 'CONFIRM_PERIOD', month, year });
        }}
      />

      {/* Success dialog */}
      <Dialog
        open={
          machineState.value === 'show-send-month-report-request-success-dialog'
        }
        onClose={() => {}}
        className="max-w-xs sm:max-w-xs"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-16 items-center justify-center rounded-full bg-green-100 shadow-md">
            <FontAwesomeIcon
              icon={faCheck}
              className="fa-fw fa-2x text-green-500"
            />
          </div>
          <DialogTitle>Report sent</DialogTitle>
        </div>

        <p className="m-auto mt-2 w-full max-w-xs text-center text-sm/5 font-medium text-gray-600">
          You will receive an email with the report in a few minutes.
        </p>
      </Dialog>

      {/* Trigger button */}
      <button
        type="button"
        className="btn btn-primary flex items-center justify-center"
        onClick={() => {
          machineSend({ type: 'TRIGGER' });
        }}
        disabled={
          machineState.value !== 'idle' && machineState.value !== 'exiting'
        }
      >
        <FontAwesomeIcon icon={faEnvelope} className="fa-fw fa-md" />
        <span>Receive month report</span>
      </button>
    </>
  );
}

export default SendMonthReportBtnProvider as React.FC;
