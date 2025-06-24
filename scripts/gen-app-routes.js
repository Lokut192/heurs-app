#!/usr/bin/env node
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
const path = require('path');
const { pathToRegexp } = require('path-to-regexp');

class NextJSRouteExtractor {
  constructor(appDir = './src/app') {
    this.appDir = path.resolve(appDir);
    this.routes = [];
  }

  /**
   * Check if a directory path represents a route group (wrapped in parentheses)
   */
  isRouteGroup(dirName) {
    return dirName.startsWith('(') && dirName.endsWith(')');
  }

  /**
   * Check if a directory path represents a dynamic route
   */
  isDynamicRoute(dirName) {
    return dirName.startsWith('[') && dirName.endsWith(']');
  }

  /**
   * Check if a directory path represents a catch-all route
   */
  isCatchAllRoute(dirName) {
    return dirName.startsWith('[...') && dirName.endsWith(']');
  }

  /**
   * Check if a directory path represents an optional catch-all route
   */
  isOptionalCatchAllRoute(dirName) {
    return dirName.startsWith('[[...') && dirName.endsWith(']]');
  }

  /**
   * Extract pageAccess configuration from a TypeScript file
   */
  extractPageAccess(filePath) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // Look for pageAccess export using regex
      const pageAccessRegex =
        /export\s+const\s+pageAccess\s*:\s*PageAccessConfig\s*=\s*({[^}]*(?:{[^}]*}[^}]*)*})/s;
      const match = fileContent.match(pageAccessRegex);

      if (!match) {
        return null;
      }

      const configString = match[1];

      // Parse the configuration object manually
      // This is a simple parser for the specific format
      const grantsMatch = configString.match(/grants\s*:\s*\[(.*?)\]/s);
      const modeMatch = configString.match(/mode\s*:\s*['"`]([^'"`]*)['"`]/);

      if (!grantsMatch || !modeMatch) {
        console.warn(`Warning: Could not parse pageAccess in ${filePath}`);
        return null;
      }

      // Parse grants array
      const grantsString = grantsMatch[1];
      const grants = grantsString
        .split(',')
        .map((grant) => grant.trim().replace(/['"`]/g, ''))
        .filter((grant) => grant.length > 0);

      const mode = modeMatch[1];

      return {
        grants,
        mode,
      };
    } catch (error) {
      console.warn(`Warning: Error reading file ${filePath}:`, error.message);
      return null;
    }
  }

  /**
   * Convert filesystem path to Next.js route path
   */
  pathToRoute(filePath) {
    // Get relative path from app directory
    const relativePath = path.relative(this.appDir, path.dirname(filePath));

    if (relativePath === '') {
      return '/';
    }

    // Split path into segments
    const segments = relativePath
      .split(path.sep)
      .filter((segment) => segment !== '.');
    const routeSegments = [];

    for (const segment of segments) {
      // Skip route groups (they don't affect the URL)
      if (this.isRouteGroup(segment)) {
        continue;
      }

      // Handle dynamic routes
      if (this.isDynamicRoute(segment)) {
        if (this.isOptionalCatchAllRoute(segment)) {
          // [[...slug]] -> optional catch-all
          const param = segment.slice(3, -2);
          routeSegments.push(`*${param}?`); // Express-style optional catch-all
        } else if (this.isCatchAllRoute(segment)) {
          // [...slug] -> catch-all
          const param = segment.slice(4, -1);
          routeSegments.push(`*${param}`); // Express-style catch-all
        } else {
          // [slug] -> dynamic parameter
          const param = segment.slice(1, -1);
          routeSegments.push(`:${param}`); // Express-style parameter
        }
      } else {
        routeSegments.push(segment);
      }
    }

    return '/' + routeSegments.join('/');
  }

  /**
   * Convert Next.js route to path-to-regexp compatible pattern
   */
  routeToExpressPattern(route) {
    // Handle root route
    if (route === '/') {
      return '/';
    }

    // Convert Next.js patterns to Express patterns
    let pattern = route;

    // Handle optional catch-all routes [[...param]]
    pattern = pattern.replace(/\/\*([^?/]+)\?/g, '/*$1?');

    // Handle catch-all routes [...param]
    pattern = pattern.replace(/\/\*([^/]+)$/g, '/*$1');

    return pattern;
  }

  /**
   * Recursively scan directory for page.tsx files
   */
  scanDirectory(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          this.scanDirectory(fullPath);
        } else if (entry.isFile() && entry.name === 'page.tsx') {
          // Found a page.tsx file
          const route = this.pathToRoute(fullPath);
          const pageAccess = this.extractPageAccess(fullPath);

          this.routes.push({
            route: route,
            pageDir: fullPath,
            pageAccess: pageAccess,
          });
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error.message);
    }
  }

  /**
   * Extract all routes from the project and convert to regex
   */
  extractRoutes() {
    if (!fs.existsSync(this.appDir)) {
      throw new Error(`App directory not found: ${this.appDir}`);
    }

    console.log(`Scanning for routes in: ${this.appDir}`);
    this.routes = [];
    this.scanDirectory(this.appDir);

    // Sort routes alphabetically by route path
    this.routes.sort((a, b) => a.route.localeCompare(b.route));

    // Convert routes to regex patterns
    const regexRoutes = this.routes.map((routeInfo) => {
      try {
        const expressPattern = this.routeToExpressPattern(routeInfo.route);
        const regex = pathToRegexp(expressPattern);

        const result = {
          regex: regex.regexp,
          pageDir: routeInfo.pageDir,
        };

        // Add pageAccess if it exists
        if (routeInfo.pageAccess) {
          result.pageAccess = routeInfo.pageAccess;
        }

        return result;
      } catch (error) {
        console.warn(
          `Warning: Could not convert route "${routeInfo.route}" to regex:`,
          error.message,
        );
        // Fallback: create a simple regex for the route
        const escapedRoute = routeInfo.route.replace(
          /[.*+?^${}()|[\]\\]/g,
          '\\$&',
        );
        const result = {
          regex: new RegExp(`^${escapedRoute}$`).toString(),
          pageDir: routeInfo.pageDir,
        };

        // Add pageAccess if it exists
        if (routeInfo.pageAccess) {
          result.pageAccess = routeInfo.pageAccess;
        }

        return result;
      }
    });

    return regexRoutes;
  }

  /**
   * Generate routes.json file
   */
  generateRoutesJSON() {
    const regexRoutes = this.extractRoutes();

    // Write to routes.json
    const outputPath = path.resolve('./data/routes.json');
    fs.writeFileSync(outputPath, JSON.stringify(regexRoutes, null, 2));

    console.log(
      `\n✅ Found ${this.routes.length} route${this.routes.length !== 1 ? 's' : ''}`,
    );
    console.log(
      `📄 Generated routes.json with ${regexRoutes.length} regex pattern${regexRoutes.length !== 1 ? 's' : ''}`,
    );
    console.log(`📁 Output file: ${outputPath}`);

    // Print preview of generated patterns
    console.log('\n📋 Generated regex patterns:');
    regexRoutes.forEach((item) => {
      const routeInfo = this.routes.find((r) => r.pageDir === item.pageDir);
      console.log(`  ${routeInfo.route} -> ${item.regex}`);
      console.log(`    📁 ${item.pageDir}`);
      if (item.pageAccess) {
        console.log(
          `    🔐 Access: ${item.pageAccess.grants.join(', ')} (${item.pageAccess.mode})`,
        );
      } else {
        console.log(`    🔓 No access restrictions`);
      }
    });

    return regexRoutes;
  }
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const appDir = args[0] || './src/app';

  try {
    // Check if path-to-regexp is available
    try {
      require('path-to-regexp');
    } catch (_error) {
      console.error('❌ Error: path-to-regexp package not found.');
      console.error('Please install it by running:');
      console.error('  npm install path-to-regexp');
      console.error('  # or');
      console.error('  yarn add path-to-regexp');
      process.exit(1);
    }

    const extractor = new NextJSRouteExtractor(appDir);
    extractor.generateRoutesJSON();

    console.log('\n💡 Usage:');
    console.log(
      '  node extract-routes.js                    # Scan default ./src/app',
    );
    console.log(
      '  node extract-routes.js ./app              # Scan custom directory',
    );
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = NextJSRouteExtractor;
