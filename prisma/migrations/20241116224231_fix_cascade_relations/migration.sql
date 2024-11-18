-- DropForeignKey
ALTER TABLE `Dues` DROP FOREIGN KEY `Dues_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Dues` DROP FOREIGN KEY `Dues_memberId_fkey`;

-- DropForeignKey
ALTER TABLE `Dues` DROP FOREIGN KEY `Dues_monthId_fkey`;

-- AddForeignKey
ALTER TABLE `Dues` ADD CONSTRAINT `Dues_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dues` ADD CONSTRAINT `Dues_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Dues` ADD CONSTRAINT `Dues_monthId_fkey` FOREIGN KEY (`monthId`) REFERENCES `Month`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
