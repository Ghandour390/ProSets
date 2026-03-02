import { IsString, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAssetDto {
    @IsString()
    title!: string;

    @IsString()
    description!: string;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price!: number;

    @IsString()
    fileKey!: string;

    @IsString()
    previewUrl!: string;

    @IsUUID()
    categoryId!: string;
}

export class UpdateAssetDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number)
    price?: number;

    @IsOptional()
    @IsString()
    previewUrl?: string;

    @IsOptional()
    @IsUUID()
    categoryId?: string;
}

export class AssetQueryDto {
    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    minPrice?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    maxPrice?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    limit?: number = 12;
}
