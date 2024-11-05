import Logger from '@/utils/logger.util';
import { EventEmitter } from 'events';

export interface UserBucketMod {
    logs: Logger;
    user: UserBucketMethods;
}

export interface UserBucketMethods {
    list(user: string): void;
    fetch(user: string): void;
}

export interface File {
    Key: string;
    LastModified: Date;
    ETag: string;
    Size: number;
}

export interface BucketData {
    Contents: File[]
}

export interface FileObj {
    success: boolean;
    message?: string;
    results?: any;
    data?: File[]
}

export interface BucketResponseObj {
    success: boolean
    message?: string
    percentage?: number
    data?: any
}