import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from '../../auth/auth/guards/jwt.guard';
import { Permission } from 'src/auth/auth/decorators/permission.decorator';
import { PermissionGuard } from 'src/auth/auth/guards/permission.guard';
import { UserDomain } from '../domain/user.domain';
import { UserService } from '../services/user.service';
import { PartialUser } from '../domain/partial-user.domain';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Permission('admin')
  @UseGuards(JwtGuard, PermissionGuard)
  @Post('create')
  async create(@Res() res, @Body() userDomain: UserDomain) {
    try {
      const user = await this.userService.create(userDomain);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.CREATED,
        message: 'User successfully created',
        data: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          permission: user.permission,
        },
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll(@Res() res, @Req() req) {
    try {
      const users = await this.userService.findAll(req);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Users successfully retrieved',
        data: users,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @UsePipes(new ValidationPipe())
  @Permission('admin')
  @UseGuards(JwtGuard, PermissionGuard)
  @Get('search/:searchString')
  async findByNameOrEmail(
    @Res() res,
    @Param('searchString') searchString: string,
  ) {
    try {
      const users = await this.userService.findByNameOrEmail(searchString);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Users successfully retrieved',
        data: users,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtGuard)
  @Post('search/email')
  async findByEmail(@Res() res, @Body('email') email: string) {
    try {
      const user = await this.userService.findByEmail(email);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User successfully retrieved',
        data: user,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtGuard)
  @Get(':id')
  async findById(@Res() res, @Param('id') id: number, @Req() req) {
    try {
      const user = await this.userService.findById(id, req);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User successfully retrieved',
        data: user,
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtGuard)
  @Put('update/:id')
  async update(
    @Res() res,
    @Param('id') id: number,
    @Body() user: PartialUser,
    @Req() req,
  ) {
    try {
      await this.userService.update(id, user, req);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User successfully updated',
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }

  @UsePipes(new ValidationPipe())
  @Permission('admin')
  @UseGuards(JwtGuard, PermissionGuard)
  @Delete('remove/:id')
  async remove(@Res() res, @Param('id') id: number, @Req() req) {
    try {
      await this.userService.remove(id, req);
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User successfully deleted',
      });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: error.message });
    }
  }
}
