-- AlterTable
ALTER TABLE `Visit` ADD COLUMN `tujuanId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Tujuan` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_tujuanId_fkey` FOREIGN KEY (`tujuanId`) REFERENCES `Tujuan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
