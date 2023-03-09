import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ORMConfig } from './ormconfig';
import { UserModule } from './user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(ORMConfig), UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
