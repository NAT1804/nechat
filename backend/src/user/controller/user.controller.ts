import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from '../service/user/user.service';
import { IUser } from '../model/user.interface';
import { Observable, of, switchMap } from 'rxjs';
import { CreateUserDto } from '../model/dto/create-user.dto';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LoginUserDto } from '../model/dto/login-user.dto';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<IUser> {
    return this.userHelperService
      .createUserDtoToEntity(createUserDto)
      .pipe(switchMap((user: IUser) => this.userService.create(user)));
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Observable<Pagination<IUser>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.findAll({
      page,
      limit,
      route: 'http://localhost:3000/api/users',
    });
  }

  @Post('login')
  login(@Body() LoginUserDto: LoginUserDto): Observable<boolean> {
    return this.userHelperService.loginUserDtoToEnity(LoginUserDto).pipe(
      switchMap((user: IUser) => {
        return this.userService.login(user)
      })
    )
  }
}
