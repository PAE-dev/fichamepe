import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class CreateServiceReviewBodyDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  body: string;
}
