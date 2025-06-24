import type { AxiosResponse } from 'axios';
import { z } from 'zod/v4';

import type { ApiMetadata } from '@/_shared/types/api/metadata';

const schema = z.looseObject({
  total: z.coerce.number().catch(0),
  page: z.coerce.number().catch(1),
  'page-size': z.coerce.number().catch(0),
  'page-count': z.coerce.number().catch(0),
});

export default function extractApiResponseMetadata(
  response: AxiosResponse<any, any>,
): ApiMetadata {
  if (response.status >= 200 && response.status < 300) {
    const metadataHeaders = schema.safeParse(response.headers);

    if (!!metadataHeaders.error) {
      return {
        page: 1,
        pageCount: 0,
        pageSize: 0,
        total: 0,
      };
    }

    return {
      page: metadataHeaders.data.page,
      pageCount: metadataHeaders.data['page-count'],
      pageSize: metadataHeaders.data['page-size'],
      total: metadataHeaders.data.total,
    };
  }

  return {
    page: 1,
    pageCount: 0,
    pageSize: 0,
    total: 0,
  };
}
