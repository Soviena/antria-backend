
import { ApiProperty } from '@nestjs/swagger';

export class LoginPelangganDto {
  @ApiProperty({
    description: 'Username of the user',
    example: 'jhon',
    required: true
  })
  username: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'jhondoe1234',
    required: true
  })
  password: string;
}