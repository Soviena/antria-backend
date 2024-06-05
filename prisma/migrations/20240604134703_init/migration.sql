/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_authorId_fkey`;

-- AlterTable
ALTER TABLE `Antrian` MODIFY `orderstatus` ENUM('ALLDONE', 'CONFIRM', 'PROCESS', 'WAITING', 'CANCELED') NOT NULL DEFAULT 'WAITING';

-- AlterTable
ALTER TABLE `Mitra` ADD COLUMN `linkGmaps` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `status_toko` ENUM('OPEN', 'CLOSE', 'FULL') NOT NULL DEFAULT 'OPEN',
    ADD COLUMN `subscription` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `Post`;

-- DropTable
DROP TABLE `User`;
