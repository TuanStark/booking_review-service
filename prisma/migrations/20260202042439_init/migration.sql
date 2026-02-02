/*
  Warnings:

  - You are about to drop the `room_rating_stats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room_review_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room_review_replies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room_reviews` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."room_review_images" DROP CONSTRAINT "room_review_images_reviewId_fkey";

-- DropForeignKey
ALTER TABLE "public"."room_review_replies" DROP CONSTRAINT "room_review_replies_reviewId_fkey";

-- DropTable
DROP TABLE "public"."room_rating_stats";

-- DropTable
DROP TABLE "public"."room_review_images";

-- DropTable
DROP TABLE "public"."room_review_replies";

-- DropTable
DROP TABLE "public"."room_reviews";

-- CreateTable
CREATE TABLE "RoomReview" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "ratingOverall" INTEGER NOT NULL,
    "ratingClean" INTEGER,
    "ratingLocation" INTEGER,
    "ratingPrice" INTEGER,
    "ratingService" INTEGER,
    "comment" TEXT,
    "status" "ReviewStatus" NOT NULL DEFAULT 'VISIBLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomRatingStat" (
    "roomId" TEXT NOT NULL,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "avgRating" DECIMAL(3,2) NOT NULL,
    "avgClean" DECIMAL(65,30),
    "avgLocation" DECIMAL(65,30),
    "avgPrice" DECIMAL(65,30),
    "avgService" DECIMAL(65,30),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomRatingStat_pkey" PRIMARY KEY ("roomId")
);

-- CreateIndex
CREATE UNIQUE INDEX "RoomReview_bookingId_key" ON "RoomReview"("bookingId");

-- CreateIndex
CREATE INDEX "RoomReview_roomId_idx" ON "RoomReview"("roomId");

-- CreateIndex
CREATE INDEX "RoomReview_userId_idx" ON "RoomReview"("userId");

-- CreateIndex
CREATE INDEX "RoomReview_status_idx" ON "RoomReview"("status");
