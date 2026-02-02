import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

/**
 * DTO for updating an existing review.
 * Users can only update ratings and comment, not bookingId.
 */
export class UpdateReviewDto extends PartialType(CreateReviewDto) {
    // Override: bookingId cannot be changed
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    declare comment?: string;
}
