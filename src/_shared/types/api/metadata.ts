import type { metadataHeaders } from '@/_shared/constants/api/metadata-headers';

export type ApiMetadata = {
  [key in keyof typeof metadataHeaders]: number;
};
