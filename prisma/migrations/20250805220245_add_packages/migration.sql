/*
  Warnings:

  - You are about to drop the column `allowedDay` on the `VisitSetting` table. All the data in the column will be lost.
  - Added the required column `allowedWeekday` to the `VisitSetting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `VisitSetting` DROP COLUMN `allowedDay`,
    ADD COLUMN `allowedWeekday` INTEGER NOT NULL;
