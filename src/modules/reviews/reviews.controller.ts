import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PaginationDto } from './dto/pagination.dto';

// Assuming we have an AuthGuard, or using a custom decorator/interceptor for auth
// For now, using standard request object to get user info

@Controller('reviews')
export class ReviewController {
  constructor(private readonly service: ReviewService) { }

  @Post()
  create(@Req() req: any, @Body() dto: CreateReviewDto) {
    // Assuming req.user is populated by AuthGuard/Middleware
    // If not, we might need to handle it. 
    // Based on previous code: req.user.id
    const userId = req.user?.id || req.headers['x-user-id'];
    // Fallback for dev/testing if auth middleware not fully integrated in this service yet
    return this.service.createReview(String(userId), dto);
  }

  @Get('room/:roomId')
  getByRoom(
    @Param('roomId') roomId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.service.getByRoom(roomId, pagination);
  }

  @Get('user/:userId')
  getByUser(
    @Param('userId') userId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.service.getByUser(userId, pagination);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    const userId = req.user?.id || req.headers['x-user-id'];
    return this.service.updateReview(id, String(userId), dto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    const userId = req.user?.id || req.headers['x-user-id'];
    return this.service.deleteReview(id, String(userId));
  }
}
