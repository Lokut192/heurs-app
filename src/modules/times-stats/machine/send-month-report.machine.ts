import { assign, createMachine } from 'xstate';

export const sendMonthReportMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5SzAOwgWgLYHtUBcALDAJzAAccT9sBDAY0IEtUwA6JiAGzAGIAVAEoBJAOKiAooIDaABgC6iUJVhN8TPEpAAPRAHY9ANjYAmWQGYAjCYCsAGhABPRGdls9NgL6eHKdNjwiUgoqGiwGZlY2WEIcAHcMcjASDUwUHnp8KgwIJlouHCheCQANYX45RSQQFTUNVC1dBEtzAE4AFjZLPVbDAA4PB2cEW0tTLx8QP0xcAmIySmo6RhZ2GPjE5NSMdLBM7Nz8wt4AYQB5ADkAMWFBAFkAfQAFKWEzgBFKrVr1TWqmgzGMxWWxDFw2Ma2by+NAzQLzEJLcIrKLTAJzYKLGhkACOAFc4PhimUKgpvjhVL8Gv9EFYbF1QU5EDZzMY+uYOZyuRzoVNYeiggtQstImt+bNBYjsWB8YTeABlCQXd4PQQSACKAFUJPLSVVlBS6n9QE06Qz7EyEOY9CZeWiJQisSLVtFYSwoALHcLcQTYET5ZqTicdfKvtUfvVGvojKYLNYLcN2pZjLJ2dzuXbxfDMcLkaLXeh3Z6c0sfXKpIIzjIyeHDVSowhAbGQQnaYZ6TY0+nOZn-A6S2EIi71gl7dmhaWZb6aLA8fR6HBYDk8gUiqVymGDZTIzTmm1Ot1egNWwgkymu93zL24RiJ4OUewwNo6qgito-bR8OxaAAzL8kAAKQ5V34EhaFQbc8HeMAuFoRwAEpeDHW8pWdKInxfKBNxqOsdxNRAWg6Loen6QZLT6MYJkmVAcAgOAtGQyUnTzVZyUg6l8IQDBDDBLjDGvYs7zQ9hOB4NijQ4nREFI9w40ZYY+nPS8uQE-shJY1FYgSJIUlonYYL2LISGXI4oHE+td0sWQrLYVlzBMCj5PBMYPFU8dUI0sU+3cp0yz9cy8Kk08TF4kxDDceM3JQ5ih1RN1X0E1C-PwALjSC9pWnpQx2j6dprRPa0TDYCYYW86Lc1itYtP0sqmO9KdCR2OcF1gJdgMKVLJKaVobTYCxWlkQwnNPZNiovbsorqpFKrYDD1FfTqG2TWw2GywbhtsVoum8bwgA */
    id: 'send-month-report-machine',

    context: {
      month: undefined as number | undefined,
      year: undefined as number | undefined,
    },

    initial: 'idle',

    states: {
      idle: {
        on: {
          TRIGGER: {
            target: 'show-period-selector-dialog',
          },
        },
      },

      'show-period-selector-dialog': {
        on: {
          EXIT: {
            target: 'exiting',
          },

          CONFIRM_PERIOD: [
            {
              guard: 'enteredValidMonthYearPair',
              actions: ['setContextMonthAndYearValues'],
              target: 'send-month-report-request',
            },
          ],
        },
      },

      'send-month-report-request': {
        on: {
          EXIT: {
            target: 'exiting',
          },

          SEND_REQUEST: {
            target: 'sending-month-report-request',
          },
        },
      },

      'sending-month-report-request': {
        on: {
          SUCCESS: {
            target: 'show-send-month-report-request-success-dialog',
          },

          ERROR: {
            target: 'show-period-selector-dialog',
          },
        },
      },

      'show-send-month-report-request-success-dialog': {
        on: {
          EXIT: {
            target: 'exiting',
          },
        },
      },

      exiting: {
        after: {
          dialogTransitionDelay: {
            actions: ['resetContextValues'],
            target: 'idle',
          },
        },
      },
    },
  },
  {
    delays: {
      dialogTransitionDelay: 200,
    },

    guards: {
      enteredValidMonthYearPair: ({ event }) => {
        if (typeof event.month === 'number' && typeof event.year === 'number') {
          if (
            event.month >= 1 &&
            event.month <= 12 &&
            event.year >= 2000 &&
            event.year <= 9999
          ) {
            return true;
          }
        }
        return false;
      },
    },

    actions: {
      resetContextValues: assign({
        month: undefined,
        year: undefined,
      }),

      setContextMonthAndYearValues: assign(({ event }) => {
        return {
          month: event.month,
          year: event.year,
        };
      }),
    },
  },
);
