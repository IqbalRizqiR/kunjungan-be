/*
  Warnings:

  - Added the required column `visitors` to the `Visit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Visit` ADD COLUMN `visitors` VARCHAR(191) NOT NULL;
