-- AlterTable
ALTER TABLE `Produk` ADD COLUMN `show_produk` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `Analytic` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
