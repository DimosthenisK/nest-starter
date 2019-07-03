import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConfigService {
    private readonly envConfig: { [key: string]: string };

    constructor() {
        this.envConfig = dotenv.parse(
            fs.readFileSync(process.cwd() + path.sep + '.env')
        );
    }

    get(key: string): string {
        if (process.env[key]) return process.env[key];
        return this.envConfig[key];
    }
}
