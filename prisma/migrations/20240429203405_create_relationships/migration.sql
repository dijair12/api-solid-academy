/*
  Warnings:

  - Added the required column `gym_id` to the `checkin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `checkin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "checkin" ADD COLUMN     "gym_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkin" ADD CONSTRAINT "checkin_gym_id_fkey" FOREIGN KEY ("gym_id") REFERENCES "gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
