import { Equals, IsIn, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class HeadersLoginDto {
  @IsString()
  @IsNotEmpty()
  @Equals('amigo-secreto-api', {
    message: 'El issuer (iss) debe ser amigo-secreto-api',
  })
  iss: string;

  @IsString()
  @IsNotEmpty()
  @Equals('amigo-secreto-web', {
    message: 'El subject (sub) debe ser amigo-secreto-web',
  })
  sub: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(
    [
      'sign-in',
      'sign-up',
      'forgot-password',
      'reset-password',
      'refresh-token',
      'new-password',
      'invite-participant', // Agregué este por si invitas gente al evento
    ],
    {
      message:
        'El audience (aud) no es válido para este flujo de autenticación',
    },
  )
  aud: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID('4', {
    message: 'El código de sesión debe ser un UUID v4 válido',
  })
  codigosesion: string;
}