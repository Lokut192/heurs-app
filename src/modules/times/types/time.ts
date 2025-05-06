import type { ApiTimeType } from '../enums/time-type.enum';

export type ApiGetTime = {
  id: number;
  duration: number;
  type: ApiTimeType;
  /**
   * Format ISO
   */
  date: string;
  /**
   * Format ISO
   */
  createdAt: string;
};
