import {
    Controller, Get, Post, Put, Delete, Body, Param, Query,
    UseGuards, Request, Patch,
} from '@nestjs/common';
import { AssetService } from './asset.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateAssetDto, UpdateAssetDto, AssetQueryDto } from './dto/asset.dto';

@Controller('assets')
export class AssetController {
    constructor(private service: AssetService) { }

    /**
     * Public: Browse catalogue with filters and pagination
     */
    @Get()
    async catalogue(@Query() query: AssetQueryDto) {
        return this.service.getCatalogue(query);
    }

    /**
     * Public: Get a single asset
     */
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.service.getAssetById(id);
    }

    /**
     * Seller: Get presigned upload URLs
     */
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('SELLER' as any, 'ADMIN' as any)
    @Post('upload-url')
    async getUploadUrl(@Request() req: any) {
        return this.service.getUploadUrls(req.user.dbId);
    }

    /**
     * Seller: Get my assets
     */
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('SELLER' as any, 'ADMIN' as any)
    @Get('seller/my-assets')
    async getMyAssets(@Request() req: any) {
        return this.service.getSellerAssets(req.user.dbId);
    }

    /**
     * Seller: Create a new asset
     */
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('SELLER' as any, 'ADMIN' as any)
    @Post()
    async create(@Request() req: any, @Body() dto: CreateAssetDto) {
        return this.service.createAsset(req.user.dbId, dto);
    }

    /**
     * Seller: Update own asset
     */
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('SELLER' as any, 'ADMIN' as any)
    @Put(':id')
    async update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateAssetDto) {
        return this.service.updateAsset(id, req.user.dbId, dto);
    }

    /**
     * Seller: Delete own asset
     */
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('SELLER' as any, 'ADMIN' as any)
    @Delete(':id')
    async delete(@Request() req: any, @Param('id') id: string) {
        return this.service.deleteAsset(id, req.user.dbId);
    }

    /**
     * Admin: Moderate asset (change status)
     */
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN' as any)
    @Patch(':id/moderate')
    async moderate(@Param('id') id: string, @Body('status') status: any) {
        return this.service.moderateAsset(id, status);
    }

    /**
     * Admin: List all assets (all statuses)
     */
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN' as any)
    @Get('admin/all')
    async adminList(@Query() query: AssetQueryDto) {
        return this.service.getAllAssetsAdmin(query);
    }
}
