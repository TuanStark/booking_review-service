-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('VISIBLE', 'HIDDEN', 'DELETED');

-- CreateTable
CREATE TABLE "room_reviews" (
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

    CONSTRAINT "room_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_review_images" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_review_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_review_replies" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "reply" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_review_replies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_rating_stats" (
    "roomId" TEXT NOT NULL,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "avgRating" DECIMAL(3,2) NOT NULL,
    "avgClean" DECIMAL(3,2),
    "avgLocation" DECIMAL(3,2),
    "avgPrice" DECIMAL(3,2),
    "avgService" DECIMAL(3,2),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "room_rating_stats_pkey" PRIMARY KEY ("roomId")
);

-- CreateIndex
CREATE UNIQUE INDEX "room_reviews_bookingId_key" ON "room_reviews"("bookingId");

-- CreateIndex
CREATE INDEX "room_reviews_roomId_idx" ON "room_reviews"("roomId");

-- CreateIndex
CREATE INDEX "room_reviews_userId_idx" ON "room_reviews"("userId");

-- CreateIndex
CREATE INDEX "room_reviews_status_idx" ON "room_reviews"("status");

-- CreateIndex
CREATE INDEX "room_review_images_reviewId_idx" ON "room_review_images"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "room_review_replies_reviewId_key" ON "room_review_replies"("reviewId");

-- AddForeignKey
ALTER TABLE "room_review_images" ADD CONSTRAINT "room_review_images_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "room_reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_review_replies" ADD CONSTRAINT "room_review_replies_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "room_reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
