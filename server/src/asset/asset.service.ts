import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { AssetRepository } from './asset.repository';
import { AssetStatus } from '@prisma/client';
import { StorageService } from '../storage/storage.service';
import { CreateAssetDto, UpdateAssetDto, AssetQueryDto } from './dto/asset.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AssetService {
    constructor(
        private repository: AssetRepository,
        private storageService: StorageService,
    ) { }

    /**
     * Get paginated, filtered list of active assets (public catalogue)
     */
    async getCatalogue(query: AssetQueryDto) {
        return this.repository.findAllFiltered({
            status: AssetStatus.ACTIVE,
            categorySlug: query.category,
            search: query.search,
            minPrice: query.minPrice,
            maxPrice: query.maxPrice,
            page: query.page ?? 1,
            limit: query.limit ?? 12,
        });
    }

    /**
     * Get a single asset by ID
     */
    async getAssetById(id: string) {
        const asset = await this.repository.findById(id);
        if (!asset) throw new NotFoundException('Asset not found');
        return asset;
    }

    /**
     * Get seller's own assets
     */
    async getSellerAssets(sellerId: string) {
        return this.repository.findBySellerId(sellerId);
    }

    /**
     * Create a new asset (seller)
     */
    async createAsset(sellerId: string, dto: CreateAssetDto) {
        return this.repository.create({
            ...dto,
            sellerId,
        });
    }

    /**
     * Update an asset (seller — own assets only)
     */
    async updateAsset(id: string, sellerId: string, dto: UpdateAssetDto) {
        const asset = await this.repository.findById(id);
        if (!asset) throw new NotFoundException('Asset not found');
        if (asset.seller.id !== sellerId) throw new ForbiddenException('Not your asset');
        return this.repository.update(id, dto);
    }

    /**
     * Delete an asset (seller — own assets only)
     */
    async deleteAsset(id: string, sellerId: string) {
        const asset = await this.repository.findById(id);
        if (!asset) throw new NotFoundException('Asset not found');
        if (asset.seller.id !== sellerId) throw new ForbiddenException('Not your asset');

        // Clean up files from storage
        try {
            await this.storageService.deleteFile(this.storageService.PRIVATE_BUCKET, asset.fileKey);
        } catch { }

        return this.repository.delete(id);
    }

    /**
     * Moderate an asset (admin)
     */
    async moderateAsset(id: string, status: AssetStatus) {
        const asset = await this.repository.findById(id);
        if (!asset) throw new NotFoundException('Asset not found');
        return this.repository.update(id, { status });
    }

    /**
     * Get all assets (admin — includes all statuses)
     */
    async getAllAssetsAdmin(query: AssetQueryDto) {
        return this.repository.findAllFiltered({
            categorySlug: query.category,
            search: query.search,
            minPrice: query.minPrice,
            maxPrice: query.maxPrice,
            page: query.page ?? 1,
            limit: query.limit ?? 12,
        });
    }

    /**
     * Generate presigned upload URLs for file + preview
     */
    async getUploadUrls(sellerId: string) {
        const fileKey = `assets/${sellerId}/${uuidv4()}`;
        const previewKey = `previews/${sellerId}/${uuidv4()}`;

        const [fileUploadUrl, previewUploadUrl] = await Promise.all([
            this.storageService.getPresignedUploadUrl(this.storageService.PRIVATE_BUCKET, fileKey),
            this.storageService.getPresignedUploadUrl(this.storageService.PUBLIC_BUCKET, previewKey),
        ]);

        return {
            fileUploadUrl,
            fileKey,
            previewUploadUrl,
            previewKey,
            previewPublicUrl: this.storageService.getPublicUrl(previewKey),
        };
    }
}
