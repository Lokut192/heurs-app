/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';

import type {
  PageManifest,
  PageManifestEntry,
} from '../types/page-manifest.type';

let cachedManifest: (PageManifestEntry & { compiledRegex: RegExp })[] | null =
  null;
let lastModified: number | null = null;

export function getPageManifest(): (PageManifestEntry & {
  compiledRegex: RegExp;
})[] {
  const manifestPath = path.join(process.cwd(), 'data', 'routes.json');

  try {
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Manifest file not found at ${manifestPath}`);
    }

    const stats = fs.statSync(manifestPath);

    if (!cachedManifest || stats.mtime.getTime() !== lastModified) {
      const manifestData = fs.readFileSync(manifestPath, 'utf8');
      const manifest: PageManifest = JSON.parse(manifestData);

      cachedManifest = manifest.map(
        (page): PageManifestEntry & { compiledRegex: RegExp } => ({
          ...page,
          compiledRegex: new RegExp(page.regex.slice(1, -1)), // Retire les délimiteurs / /
        }),
      );

      lastModified = stats.mtime.getTime();

      if (process.env.NODE_ENV === 'development') {
        console.log(
          '📄 Page manifest cached with',
          cachedManifest.length,
          'entries',
        );
      }
    }

    return cachedManifest;
  } catch (error) {
    console.error('Error loading page manifest:', error);
    return [];
  }
}

export function findPageConfig(pathname: string): PageManifestEntry | null {
  const manifest = getPageManifest();
  return manifest.find((page) => page.compiledRegex.test(pathname)) || null;
}

export function debugRouteMatching(pathname: string): void {
  if (process.env.NODE_ENV !== 'development') return;

  const manifest = getPageManifest();
  console.log(`🔍 Testing route: ${pathname}`);

  manifest.forEach((page) => {
    const matches = page.compiledRegex.test(pathname);
    console.log(`  ${matches ? '✅' : '❌'} ${page.regex} -> ${page.pageDir}`);
  });
}
