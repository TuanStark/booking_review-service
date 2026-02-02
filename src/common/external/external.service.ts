import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../messaging/redis/redis.service';
import { REDIS_KEY } from '../constants/redis-key.constant';

@Injectable()
export class ExternalService {
  private readonly logger = new Logger(ExternalService.name);
  private readonly userServiceUrl: string;
  private readonly roomServiceUrl: string;
  private readonly bookingServiceUrl: string;
  private readonly cacheTTL = 3600; // 1 hour

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.userServiceUrl =
      this.configService.get<string>('USER_SERVICE_URL') ||
      'http://localhost:3003';
    this.roomServiceUrl =
      this.configService.get<string>('ROOM_SERVICE_URL') ||
      'http://localhost:3003';
    this.bookingServiceUrl =
      this.configService.get<string>('BOOKING_SERVICE_URL') ||
      'http://localhost:3005';
  }

  /**
   * Get user by ID with caching and timeout handling
   */
  async getUser(id: number | string) {
    const userId = String(id);
    const cacheKey = REDIS_KEY.USER(Number(userId)); // Keep number for consistency with existing keys if needed, or switch to string

    // Check cache
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Fetch from service
    const data = await this.fetchWithTimeout(
      `${this.userServiceUrl}/users/${userId}`,
    );

    if (data) {
      await this.redisService.set(cacheKey, data, this.cacheTTL);
    }

    return data;
  }

  /**
   * Get room by ID (no caching here as room details might change, or short TTL implemented in service layer)
   * But for reviews, we might want to cache basic info.
   */
  async getRoom(id: number | string) {
    // We can verify room existence
    return this.fetchWithTimeout(`${this.roomServiceUrl}/rooms/${id}`);
  }

  /**
   * Get booking by ID
   */
  async getBooking(id: number | string) {
    return this.fetchWithTimeout(`${this.bookingServiceUrl}/bookings/${id}`);
  }

  /**
   * Generic fetch wrapper with timeout and error handling
   */
  private async fetchWithTimeout(url: string, timeoutMs = 5000): Promise<any> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          this.logger.warn(`Resource not found: ${url}`);
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      return json.data ?? json; // Handle wrapped response { data: ... } or direct response
    } catch (error: any) {
      if (error.name === 'AbortError') {
        this.logger.error(`Request timeout for ${url}`);
        return null;
      }
      this.logger.error(`Fetch error for ${url}: ${error.message}`);
      return null;
    }
  }
}
