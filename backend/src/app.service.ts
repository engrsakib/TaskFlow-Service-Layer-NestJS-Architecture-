import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Task Management Project API is running! and Developed by Md. Nazmus Sakib(engrsakib) 📘 Swagger Docs: http://localhost:4000/api/docs';
  }
}
