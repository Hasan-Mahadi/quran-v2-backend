/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fs from "fs/promises";
import type { Stats } from "fs";

import path from 'path';
import { LoggerUtil } from './logger.util';
import { BusinessError } from './error.util';
import { ERROR_CODES } from '@/constants/api.constants';

export class FileSystemUtil {
  private static instance: FileSystemUtil;
  private jsonCache: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): FileSystemUtil {
    if (!this.instance) {
      this.instance = new FileSystemUtil();
    }
    return this.instance;
  }

  async loadJSON<T>(filePath: string, useCache: boolean = true): Promise<T> {
    const cacheKey = filePath;

    if (useCache && this.jsonCache.has(cacheKey)) {
      LoggerUtil.debug(`Cache hit for ${filePath}`);
      return this.jsonCache.get(cacheKey) as T;
    }

    try {
      const absolutePath = path.resolve(process.cwd(), filePath);
      const fileContent = await fs.readFile(absolutePath, 'utf-8');
      const data = JSON.parse(fileContent) as T;

      if (useCache) {
        this.jsonCache.set(cacheKey, data);
      }

      return data;
    } catch (error) {
      LoggerUtil.error(`Failed to load JSON from ${filePath}`, error as Error);
      throw new BusinessError(
        ERROR_CODES.FILE_SYSTEM_ERROR,
        `Failed to load data from ${filePath}`,
        { originalError: (error as Error).message }
      );
    }
  }

  async loadBinary(filePath: string): Promise<Buffer> {
    try {
      const absolutePath = path.resolve(process.cwd(), filePath);
      return await fs.readFile(absolutePath);
    } catch (error) {
      LoggerUtil.error(`Failed to load binary from ${filePath}`, error as Error);
      throw new BusinessError(
        ERROR_CODES.FILE_SYSTEM_ERROR,
        `Failed to load file from ${filePath}`,
        { originalError: (error as Error).message }
      );
    }
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      const absolutePath = path.resolve(process.cwd(), filePath);
      await fs.access(absolutePath);
      return true;
    } catch {
      return false;
    }
  }

  async getDirectoryContents(dirPath: string): Promise<string[]> {
    try {
      const absolutePath = path.resolve(process.cwd(), dirPath);
      const files = await fs.readdir(absolutePath);
      return files;
    } catch (error) {
      LoggerUtil.error(`Failed to read directory ${dirPath}`, error as Error);
      return [];
    }
  }

  
  async getFileStats(filePath: string): Promise<Stats | null> {
    try {
      const absolutePath = path.resolve(process.cwd(), filePath);
      return await fs.stat(absolutePath);
    } catch {
      return null;
    }
  }

  clearCache(): void {
    this.jsonCache.clear();
    LoggerUtil.info('File system JSON cache cleared');
  }
}