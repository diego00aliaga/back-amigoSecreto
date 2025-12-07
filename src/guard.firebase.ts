import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import firebase from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token = this.extractToken(request);

    if (!token) {
      request.user = null; // Si no hay token, no se adjunta el usuario

      const response = {
        code: 401,
        message: 'Unauthorized',
        businessMessage: 'Token no proporcionado',
        businessCode: 'TOKEN_NOT_PROVIDED',
        payload: {
          error: 'Token no proporcionado',
        },
      };
      throw new UnauthorizedException(response);
    }

    try {
      const decodedToken = await firebase.auth().verifyIdToken(token);

      request.user = decodedToken; // Adjunta el usuario a la request
      return true;
    } catch (error) {
      console.error('Error al verificar el token de Firebase:', error);
      request.user = null; // Si hay un error, no se adjunta el usuario

      const response = {
        code: 401,
        message: 'Unauthorized',
        businessMessage: 'Token inválido o expirado',
        businessCode: 'INVALID_OR_EXPIRED_TOKEN',
        payload: {
          error: 'Token inválido o expirado',
        },
      };
      throw new UnauthorizedException(response);
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.replace('Bearer ', '');
  }
}
