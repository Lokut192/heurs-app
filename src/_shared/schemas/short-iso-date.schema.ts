import { DateTime } from 'luxon';
import { z } from 'zod/v4';

export const shortIsoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (value) => {
      return DateTime.fromISO(value).isValid;
    },
    { error: 'Invalid date' },
  );
