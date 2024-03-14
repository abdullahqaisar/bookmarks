import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  signup() {
    return 'SIgnup';
  }

  signin() {
    return 'Signed IN';
  }
}
