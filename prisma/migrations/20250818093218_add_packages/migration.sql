-- AddForeignKey
ALTER TABLE `Visit` ADD CONSTRAINT `Visit_packageOption_fkey` FOREIGN KEY (`packageOption`) REFERENCES `Package`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
