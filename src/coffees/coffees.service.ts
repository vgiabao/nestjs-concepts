import { Inject, Injectable } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { LazyModuleLoader } from '@nestjs/core';

export const COFFEES_DATA_SOURCE = Symbol('COFFEES_DATA_SOURCE');

export interface CoffeeDataSource {
  [index: number]: Coffee
}

@Injectable()
export class CoffeesService {
  constructor(
    @Inject(COFFEES_DATA_SOURCE) dataSource: CoffeeDataSource,
    private readonly lazyModuleLoader: LazyModuleLoader
  ) { }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const rewardModuleLoaderRef = await this.lazyModuleLoader.load(() => {
      return import('../rewards/rewards.module').then(m => m.RewardsModule);
    });

    const rewardsServiceModule = await import('../rewards/rewards.service');
    const rewardsService = rewardModuleLoaderRef.get(rewardsServiceModule.RewardsService);
    rewardsService.grantTo();
    return 'This action adds a new coffee';
  }

  findAll() {
    return `This action returns all coffees`;    // NestJS creates all providers and puts them in the IoC container
  }

  findOne(id: number) {
    return `This action returns a #${id} coffee`;
  }

  update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    return `This action updates a #${id} coffee`;
  }

  remove(id: number) {
    return `This action removes a #${id} coffee`;
  }
}
