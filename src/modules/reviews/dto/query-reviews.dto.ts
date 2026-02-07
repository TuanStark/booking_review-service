import { IsOptional, IsEnum } from 'class-validator';
import { FindAllDto } from 'src/common/global/find-all.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ReviewStatus } from './enum';

export class QueryReviewDto extends PartialType(FindAllDto) {
  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;
}
