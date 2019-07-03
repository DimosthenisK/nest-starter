import { Module } from '@nestjs/common';
import { StatusMonitorModule } from 'nest-status-monitor';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            useFactory: (config: ConfigService) => ({
                type: 'mysql',
                host: config.get('DOCKERIZED') ? 'ms_db' : 'localhost',
                port: config.get('DOCKERIZED') ? 3306 : 33061,
                username: config.get('DB_USERNAME'),
                password: config.get('DB_PASSWORD'),
                database: config.get('DB_DATABASE'),
                entities: [__dirname + '/**/*.dbentity{.ts,.js}'],
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        StatusMonitorModule.setUp({
            pageTitle: 'Nest Starter Project',
            port: 3000,
            path: '/status',
            ignoreStartsWith: '/health/alive',
            spans: [
                {
                    interval: 1, // Every second
                    retention: 60, // Keep 60 datapoints in memory
                },
                {
                    interval: 5, // Every 5 seconds
                    retention: 60,
                },
                {
                    interval: 15, // Every 15 seconds
                    retention: 60,
                },
            ],
            chartVisibility: {
                cpu: true,
                mem: true,
                load: true,
                responseTime: true,
                rps: true,
                statusCodes: true,
            },
            healthChecks: [],
        }),
    ],
})
export class AppModule {}
