import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import path from 'node:path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Resolve DATABASE_URL to a format that @libsql/client accepts.
 *
 * @libsql/client requires either:
 *   - An absolute file URL:  file:///D:/path/to/db
 *   - A Turso cloud URL:     libsql://...  or  https://...
 *
 * It does NOT support relative file paths (file:prisma/dev.db).
 * Next.js sets process.cwd() to the project root, so we can use it
 * to resolve relative paths to absolute ones.
 */
function resolveDbUrl(): string {
  const raw = process.env.DATABASE_URL ?? 'file:prisma/dev.db';

  // Already an absolute file URL or a remote URL — use as-is
  if (
    raw.startsWith('file:///') ||
    raw.startsWith('libsql://') ||
    raw.startsWith('https://') ||
    raw.startsWith('http://')
  ) {
    return raw;
  }

  // Relative file path: file:./something  or  file:something
  if (raw.startsWith('file:')) {
    const relativePart = raw.slice('file:'.length);
    // Resolve against CWD (Next.js sets this to project root)
    const absolutePath = path.resolve(/* turbopackIgnore: true */ process.cwd(), relativePart);
    // Normalise Windows backslashes and format as file:/// URL
    const normalised = absolutePath.replace(/\\/g, '/');
    return `file:///${normalised.replace(/^\//, '')}`;
  }

  // Fallback: return raw and let the client fail with a clear message
  return raw;
}

function createDb(): PrismaClient {
  const url = resolveDbUrl();
  // PrismaLibSql takes a Config object with the url and creates the client internally
  const adapter = new PrismaLibSql({ url });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const db = globalForPrisma.prisma ?? createDb();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
