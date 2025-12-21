import { IsInt, IsOptional, IsString, Min, Max, IsArray } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  bookingId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  ratingOverall: number;

  @IsOptional() @IsInt() @Min(1) @Max(5)
  ratingClean?: number;

  @IsOptional() @IsString()
  comment?: string;

  @IsOptional() @IsArray()
  images?: string[];
}
