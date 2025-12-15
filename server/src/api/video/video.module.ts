import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { MulterModule } from '@nestjs/platform-express';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { VideoProcessor } from './video.processor';
import { Video } from 'src/core';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs-extra';
import { ConfigModule, ConfigService } from '@nestjs/config';

const REDIS_ENABLED = process.env.REDIS_ENABLED !== 'false';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    ...(REDIS_ENABLED
      ? [
          BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              connection: {
                host: configService.get('REDIS_HOST', 'localhost'),
                port: configService.get('REDIS_PORT', 6379),
                password: configService.get('REDIS_PASSWORD'),
                retryStrategy: (times: number) => {
                  if (times > 3) {
                    console.warn('⚠️  Redis connection failed, video processing disabled');
                    return null;
                  }
                  return Math.min(times * 200, 2000);
                },
                maxRetriesPerRequest: null,
                enableReadyCheck: false,
                lazyConnect: true,
              },
            }),
            inject: [ConfigService],
          }),
          BullModule.registerQueue({
            name: 'video-transcode',
            defaultJobOptions: {
              attempts: 3,
              backoff: { type: 'exponential', delay: 3000 },
              removeOnComplete: true,
            },
          }),
        ]
      : []),

    // Fayl yuklash joyi
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          const path = './uploads/raw';
          fs.ensureDirSync(path); // Papka bo'lmasa ochadi
          cb(null, path);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4();
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  ],
  controllers: [VideoController],
  providers: [VideoService, VideoProcessor],
})
export class VideoModule {}
