import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

/**
 * DTO for creating a new room review.
 * All rating fields are 1-5 scale.
 */
export class CreateReviewDto {
  @IsString()
  bookingId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  ratingOverall: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  ratingClean?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  ratingLocation?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  ratingPrice?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  ratingService?: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  comment?: string;
}
