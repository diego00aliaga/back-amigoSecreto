import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class RefreshAuthDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/, {
    message: 'Invalid refresh token format',
  })
  refreshToken: string;
}
