/*
  Warnings:

  - You are about to drop the column `capacity` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sessionId,visitDate]` on the table `Visit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `visitDate` to the `Visit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Session` DROP COLUMN `capacity`,
    DROP COLUMN `date`;

-- AlterTable
ALTER TABLE `Visit` ADD COLUMN `visitDate` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Visit_sessionId_visitDate_key` ON `Visit`(`sessionId`, `visitDate`);
