-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "login_attempts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "menu_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "menu_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER,
    "priceUnit" TEXT,
    "minOrder" TEXT,
    "packageItems" TEXT NOT NULL DEFAULT '[]',
    "imageUrl" TEXT,
    "galleryImages" TEXT NOT NULL DEFAULT '[]',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "suitableFor" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "menu_item_categories" (
    "menuItemId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    PRIMARY KEY ("menuItemId", "categoryId"),
    CONSTRAINT "menu_item_categories_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "menu_item_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "menu_categories" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gallery_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT,
    "caption" TEXT,
    "imageUrl" TEXT,
    "category" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customerName" TEXT NOT NULL,
    "customerType" TEXT,
    "message" TEXT NOT NULL,
    "rating" INTEGER,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "logoUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "brandName" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "whatsappNumber" TEXT NOT NULL,
    "whatsappTemplate" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "serviceArea" TEXT NOT NULL,
    "businessHours" TEXT,
    "instagramUrl" TEXT,
    "tiktokUrl" TEXT,
    "facebookUrl" TEXT,
    "email" TEXT,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "seoTitle" TEXT NOT NULL,
    "seoDescription" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "login_attempts_email_createdAt_idx" ON "login_attempts"("email", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "menu_categories_slug_key" ON "menu_categories"("slug");

-- CreateIndex
CREATE INDEX "menu_categories_isPublished_sortOrder_idx" ON "menu_categories"("isPublished", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "menu_items_slug_key" ON "menu_items"("slug");

-- CreateIndex
CREATE INDEX "menu_items_isPublished_sortOrder_idx" ON "menu_items"("isPublished", "sortOrder");

-- CreateIndex
CREATE INDEX "menu_items_isFeatured_isPublished_idx" ON "menu_items"("isFeatured", "isPublished");

-- CreateIndex
CREATE INDEX "menu_item_categories_categoryId_idx" ON "menu_item_categories"("categoryId");

-- CreateIndex
CREATE INDEX "gallery_items_isPublished_sortOrder_idx" ON "gallery_items"("isPublished", "sortOrder");

-- CreateIndex
CREATE INDEX "testimonials_isPublished_sortOrder_idx" ON "testimonials"("isPublished", "sortOrder");

-- CreateIndex
CREATE INDEX "clients_isPublished_sortOrder_idx" ON "clients"("isPublished", "sortOrder");

-- CreateIndex
CREATE INDEX "faqs_isPublished_sortOrder_idx" ON "faqs"("isPublished", "sortOrder");
