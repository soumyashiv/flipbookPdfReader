-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReadingProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bookId" TEXT NOT NULL,
    "currentPage" INTEGER NOT NULL DEFAULT 1,
    "timeSpentSeconds" INTEGER NOT NULL DEFAULT 0,
    "lastOpenedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ReadingProgress_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ReadingProgress" ("bookId", "currentPage", "id", "updatedAt") SELECT "bookId", "currentPage", "id", "updatedAt" FROM "ReadingProgress";
DROP TABLE "ReadingProgress";
ALTER TABLE "new_ReadingProgress" RENAME TO "ReadingProgress";
CREATE UNIQUE INDEX "ReadingProgress_bookId_key" ON "ReadingProgress"("bookId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
