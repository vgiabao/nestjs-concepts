import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CircuitBreaker } from './circuit-breaker';

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
  private circuitBreadkerMap = new WeakMap<Function, CircuitBreaker>()

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const methodRef = context.getHandler();
    let circuitBreaker: CircuitBreaker;

    if (this.circuitBreadkerMap.has(methodRef)) {
      circuitBreaker = this.circuitBreadkerMap.get(methodRef)!;
    } else {
      circuitBreaker = new CircuitBreaker();
      this.circuitBreadkerMap.set(methodRef, circuitBreaker);
    }
    return circuitBreaker.exec(next);
  }
}
