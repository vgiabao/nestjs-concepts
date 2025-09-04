import {
  ContextId,
  ContextIdFactory,
  ContextIdResolver,
  ContextIdResolverFn,
  ContextIdStrategy,
  HostComponentInfo,
} from '@nestjs/core';
import { Request } from 'express';

export class AggregateByTenantStrategy implements ContextIdStrategy {
  private readonly tenants = new Map<string, ContextId>();

  attach(
    contextId: ContextId,
    request: Request,
  ): ContextIdResolverFn | ContextIdResolver {
    const tenantId = request.headers['x-tenant-id'] as string;
    console.log('Request for tenant', tenantId);
    if (!tenantId) {
      return () => contextId;
    }

    let tenantSubTreeId: ContextId;
    if (this.tenants.has(tenantId)) {
      tenantSubTreeId = this.tenants.get(tenantId)!;
    } else {
      tenantSubTreeId = ContextIdFactory.create();
      this.tenants.set(tenantId, tenantSubTreeId);
      //   delete tenant contextId after 3s of inactivity to avoid memory leak
      setTimeout(() => {
        this.tenants.delete(tenantId);
      }, 3000);
    }
    return {
      payload: { tenantId },
      resolve: (info: HostComponentInfo) => {
        return info.isTreeDurable ? tenantSubTreeId : contextId;
      },
    };
  }
}
