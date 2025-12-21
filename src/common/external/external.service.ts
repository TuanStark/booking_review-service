import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { RedisService } from 'src/messaging/redis/redis.service';
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
    private readonly http: HttpService,
  ) {
    this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL') || 'http://localhost:3003';
    this.roomServiceUrl = this.configService.get<string>('ROOM_SERVICE_URL') || 'http://localhost:3003';
    this.bookingServiceUrl = this.configService.get<string>('BOOKING_SERVICE_URL') || 'http://localhost:3005';
  }

  async getUser(id: number) {
    const cached = await this.redisService.get(REDIS_KEY.USER(id));
    if (cached) {
      return cached;
    }
    const response = await firstValueFrom(
      this.http.get(`${this.userServiceUrl}/users/${id}`)
    );
    const data = response.data?.data ?? response.data;
    await this.redisService.set(REDIS_KEY.USER(id), data, this.cacheTTL);
    return data;
  }

  async getRoom(id: number) {
    const response = await firstValueFrom(
      this.http.get(`${this.roomServiceUrl}/rooms/${id}`)
    );
    return response.data?.data ?? response.data;
  }

  async getBooking(id: number) {
    const response = await firstValueFrom(
      this.http.get(`${this.bookingServiceUrl}/bookings/${id}`)
    );
    return response.data?.data ?? response.data;
  }
}
