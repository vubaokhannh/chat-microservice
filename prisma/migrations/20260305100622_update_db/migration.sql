/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `MessageRead` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `RefreshToken` table. All the data in the column will be lost.
  - Added the required column `tokenHash` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateEnum
CREATE TYPE "FriendRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED');

-- DropIndex
DROP INDEX "RefreshToken_token_key";

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "avatar" TEXT;

-- AlterTable
ALTER TABLE "ConversationMember" ADD COLUMN     "leftAt" TIMESTAMP(3),
ADD COLUMN     "role" "MemberRole" NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "deviceName" TEXT;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "MessageRead" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "token",
ADD COLUMN     "deviceId" TEXT,
ADD COLUMN     "tokenHash" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "FriendRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBlock" (
    "id" TEXT NOT NULL,
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBlock_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FriendRequest_receiverId_idx" ON "FriendRequest"("receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_senderId_receiverId_key" ON "FriendRequest"("senderId", "receiverId");

-- CreateIndex
CREATE INDEX "Friendship_user1Id_idx" ON "Friendship"("user1Id");

-- CreateIndex
CREATE INDEX "Friendship_user2Id_idx" ON "Friendship"("user2Id");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_user1Id_user2Id_key" ON "Friendship"("user1Id", "user2Id");

-- CreateIndex
CREATE UNIQUE INDEX "UserBlock_blockerId_blockedId_key" ON "UserBlock"("blockerId", "blockedId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlock" ADD CONSTRAINT "UserBlock_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlock" ADD CONSTRAINT "UserBlock_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
