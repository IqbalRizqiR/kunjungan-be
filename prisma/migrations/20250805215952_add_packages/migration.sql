/*
  Warnings:

  - You are about to drop the column `allowedWeekday` on the `VisitSetting` table. All the data in the column will be lost.
  - Added the required column `allowedDay` to the `VisitSetting` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `VisitSetting` DROP COLUMN `allowedWeekday`,
    ADD COLUMN `allowedDay` VARCHAR(191) NOT NULL;
