import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { Observable, from, map, mapTo, switchMap } from 'rxjs';
import { UserEntity } from 'src/user/model/user.entity';
import { IUser } from 'src/user/model/user.interface';
import { Repository } from 'typeorm';

const bcrypt = require('bcrypt');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  create(newUser: IUser): Observable<IUser> {
    return this.mailExists(newUser.email).pipe(
      switchMap((exists: boolean) => {
        if (!exists) {
          return this.hashPassword(newUser.password).pipe(
            switchMap((passwordHash: string) => {
              // Overwrite the password to store in databse
              newUser.password = passwordHash;
              return from(this.userRepository.save(newUser)).pipe(
                switchMap((user: IUser) => this.findOne(user.id)),
              );
            }),
          );
        } else {
          throw new HttpException(
            'Email is already in use',
            HttpStatus.CONFLICT,
          );
        }
      }),
    );
  }

  findAll(options: IPaginationOptions): Observable<Pagination<IUser>> {
    return from(paginate<UserEntity>(this.userRepository, options));
  }

  login(user: IUser): Observable<boolean> {
    return this.findByEmail(user.email).pipe(
      switchMap((foundUser: IUser) => {
        if (foundUser) {
          return this.validatePassword(user.password, foundUser.password).pipe(
            switchMap((matches: boolean) => {
              if (matches) {
                return this.findOne(foundUser.id).pipe(map(user => !!user))
              } else {
                throw new HttpException('Login was not successfully, wrong credentials', HttpStatus.UNAUTHORIZED)
              }
            })
          )
        } else {
          throw new HttpException('user not found', HttpStatus.NOT_FOUND)
        }
      })
    );
  }

  private validatePassword(password: string, storedPasswordHash: string) {
    return from(bcrypt.compare(password, storedPasswordHash))
  }

  private findByEmail(email: string): Observable<IUser> {
    return from(
      this.userRepository.findOne({
        where: { email },
        select: ['id', 'email', 'username', 'password'],
      }),
    );
  }

  private findOne(id: number): Observable<IUser> {
    return from(
      this.userRepository.findOne({
        where: { id },
      }),
    );
  }

  private hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }

  private mailExists(email: string): Observable<boolean> {
    return from(this.userRepository.findOne({ where: { email } })).pipe(
      map((user: IUser) => {
        console.log('user', user);
        return user ? true : false;
      }),
    );
  }
}
