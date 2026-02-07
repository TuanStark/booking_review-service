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
  HttpException,
  BadRequestException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { ReviewService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PaginationDto } from './dto/pagination.dto';
import { QueryReviewDto } from './dto/query-reviews.dto';
import { ResponseData } from 'src/common/global/globalClass';
import { HttpMessage } from 'src/common/global/globalEnum';

@Controller('reviews')
export class ReviewController {
  private readonly logger = new Logger(ReviewController.name);
  constructor(private readonly service: ReviewService) { }

  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: Request,
  ) {
    try {
      console.log(createReviewDto);
      const userId = req.headers['x-user-id'] as string;
      console.log(userId);

      if (!userId || userId === 'undefined') {
        throw new Error('User ID is required');
      }
      const review = await this.service.createReview(
        userId,
        createReviewDto,
      );
      return new ResponseData(
        review,
        HttpStatus.ACCEPTED,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData(
        null,
        HttpStatus.NOT_FOUND,
        HttpMessage.NOT_FOUND,
      );
    }
  }

  @Get('room/:roomId')
  getByRoom(
    @Param('roomId') roomId: string,
    @Query() pagination: PaginationDto,
  ) {
    try {
      return new ResponseData(
        this.service.getByRoom(roomId, pagination),
        HttpStatus.OK,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData(
        null,
        HttpStatus.NOT_FOUND,
        HttpMessage.NOT_FOUND,
      );
    }
  }

  @Get('user/:userId')
  getByUser(
    @Param('userId') userId: string,
    @Query() pagination: PaginationDto,
  ) {
    try {
      return new ResponseData(
        this.service.getByUser(userId, pagination),
        HttpStatus.OK,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData(
        null,
        HttpStatus.NOT_FOUND,
        HttpMessage.NOT_FOUND,
      );
    }
  }

  @Get()
  findAll(@Query() query: QueryReviewDto) {
    try {
      return new ResponseData(
        this.service.findAll(query),
        HttpStatus.OK,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData(
        null,
        HttpStatus.NOT_FOUND,
        HttpMessage.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateReviewDto,
  ) {
    const userId = req.headers['x-user-id'] as string;
    try {
      return new ResponseData(
        this.service.updateReview(id, userId, dto),
        HttpStatus.OK,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData(
        null,
        HttpStatus.NOT_FOUND,
        HttpMessage.NOT_FOUND,
      );
    }
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    const userId = req.headers['x-user-id'] as string;
    try {
      return new ResponseData(
        this.service.deleteReview(id, userId),
        HttpStatus.OK,
        HttpMessage.SUCCESS,
      );
    } catch (error) {
      return new ResponseData(
        null,
        HttpStatus.NOT_FOUND,
        HttpMessage.NOT_FOUND,
      );
    }
  }
}
