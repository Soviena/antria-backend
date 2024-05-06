/*
  Warnings:

  - Added the required column `deskripsi_produk` to the `Produk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Mitra` ALTER COLUMN `deskripsi_toko` DROP DEFAULT;

-- AlterTable
ALTER TABLE `OrderList` ADD COLUMN `note` VARCHAR(191) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `Produk` ADD COLUMN `deskripsi_produk` VARCHAR(191) NOT NULL,
    MODIFY `gambar` VARCHAR(191) NOT NULL DEFAULT 'default.png';
