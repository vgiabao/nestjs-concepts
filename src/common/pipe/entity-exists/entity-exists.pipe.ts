import { ArgumentMetadata, Inject, Injectable, PipeTransform, Type } from '@nestjs/common';

export function EntityExistsPipe(entityCls: Type): Type<PipeTransform> {
  @Injectable()
  class EntityExistsPipeCls implements PipeTransform {

    constructor(@Inject(entityCls) private entityRepository: { exists(condition: unknown): Promise<void> }) { }

    transform(value: any, metadata: ArgumentMetadata) {
      return value;
    }
  }
  return EntityExistsPipeCls;
}



