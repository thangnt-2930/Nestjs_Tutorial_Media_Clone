import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validate(value: unknown, args: ValidationArguments): Promise<boolean> {
    const property = args.constraints[0] as keyof User;
    if (value == null || value === '') return true;

    const userWithValue = await this.userRepository.findOne({
      where: { [property]: value },
    });

    return !userWithValue;
  }
}
