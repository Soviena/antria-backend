-- AlterTable
ALTER TABLE `Antrian` ADD COLUMN `orderstatus` ENUM('ALLDONE', 'CONFIRM', 'PROCESS', 'WAITING') NOT NULL DEFAULT 'WAITING';