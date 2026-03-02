import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class StorageService implements OnModuleInit {
    private readonly logger = new Logger(StorageService.name);
    private client: Minio.Client;

    readonly PRIVATE_BUCKET = 'prosets-private';
    readonly PUBLIC_BUCKET = 'prosets-public';

    constructor(private config: ConfigService) {
        this.client = new Minio.Client({
            endPoint: this.config.get<string>('MINIO_ENDPOINT', 'minio'),
            port: this.config.get<number>('MINIO_PORT', 9000),
            useSSL: this.config.get<string>('MINIO_USE_SSL', 'false') === 'true',
            accessKey: this.config.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
            secretKey: this.config.get<string>('MINIO_SECRET_KEY', 'minioadmin'),
        });
    }

    async onModuleInit() {
        await this.ensureBucket(this.PRIVATE_BUCKET);
        await this.ensureBucket(this.PUBLIC_BUCKET);
        // Set public bucket to allow public read
        await this.setPublicReadPolicy(this.PUBLIC_BUCKET);
        this.logger.log('MinIO buckets initialized');
    }

    private async ensureBucket(bucket: string) {
        const exists = await this.client.bucketExists(bucket);
        if (!exists) {
            await this.client.makeBucket(bucket);
            this.logger.log(`Created bucket: ${bucket}`);
        }
    }

    private async setPublicReadPolicy(bucket: string) {
        const policy = {
            Version: '2012-10-17',
            Statement: [
                {
                    Effect: 'Allow',
                    Principal: { AWS: ['*'] },
                    Action: ['s3:GetObject'],
                    Resource: [`arn:aws:s3:::${bucket}/*`],
                },
            ],
        };
        await this.client.setBucketPolicy(bucket, JSON.stringify(policy));
    }

    /**
     * Upload a file buffer to a bucket
     */
    async uploadFile(bucket: string, key: string, buffer: Buffer, contentType?: string): Promise<string> {
        const metaData = contentType ? { 'Content-Type': contentType } : {};
        await this.client.putObject(bucket, key, buffer, buffer.length, metaData);
        return key;
    }

    /**
     * Generate a presigned URL for downloading (private bucket)
     * Default expiry: 5 minutes (300 seconds)
     */
    async getPresignedDownloadUrl(key: string, expirySeconds = 300): Promise<string> {
        return this.client.presignedGetObject(this.PRIVATE_BUCKET, key, expirySeconds);
    }

    /**
     * Generate a presigned URL for uploading (direct client upload)
     * Default expiry: 15 minutes
     */
    async getPresignedUploadUrl(bucket: string, key: string, expirySeconds = 900): Promise<string> {
        return this.client.presignedPutObject(bucket, key, expirySeconds);
    }

    /**
     * Get the public URL for a file in the public bucket
     */
    getPublicUrl(key: string): string {
        const endpoint = this.config.get<string>('MINIO_ENDPOINT', 'localhost');
        const port = this.config.get<number>('MINIO_PORT', 9000);
        return `http://${endpoint}:${port}/${this.PUBLIC_BUCKET}/${key}`;
    }

    /**
     * Delete a file
     */
    async deleteFile(bucket: string, key: string): Promise<void> {
        await this.client.removeObject(bucket, key);
    }
}
