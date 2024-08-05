-- DropForeignKey
ALTER TABLE `Antrian` DROP FOREIGN KEY `Antrian_pesananId_fkey`;

-- DropForeignKey
ALTER TABLE `Chat` DROP FOREIGN KEY `Chat_pelangganId_fkey`;

-- AlterTable
ALTER TABLE `Antrian` MODIFY `pesananId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Chat` MODIFY `pelangganId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Karyawan` ADD COLUMN `otp` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `Pelanggan` ADD COLUMN `otp` VARCHAR(191) NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE `Antrian` ADD CONSTRAINT `Antrian_pesananId_fkey` FOREIGN KEY (`pesananId`) REFERENCES `Pesanan`(`invoice`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_pelangganId_fkey` FOREIGN KEY (`pelangganId`) REFERENCES `Pelanggan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
