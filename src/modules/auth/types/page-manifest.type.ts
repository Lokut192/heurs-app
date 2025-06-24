import type { PageAccessConfig } from './page-access-config.type';

export type PageManifestEntry = {
  regex: string;
  pageDir: string;
  pageAccess?: PageAccessConfig;
};

export type PageManifest = PageManifestEntry[];
