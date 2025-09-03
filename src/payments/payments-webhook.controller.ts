import { Controller, Get, Req } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentFailedEvent } from './events/payment-failed.event';
import { Request } from 'express';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';

@Controller('payments-webhook')
export class PaymentsWebhookController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly moduleRef: ModuleRef,
  ) {}

  @Get('/')
  webhook(@Req() req: Request) {
    const contextId = ContextIdFactory.create();
    const paymentId = Math.floor(Math.random() * 1000);
    this.moduleRef.registerRequestByContextId(req, contextId);
    this.eventEmitter.emit(
      PaymentFailedEvent.key,
      new PaymentFailedEvent(paymentId.toString(), {
        contextId,
        description:
          'Bao Vo is handsome. This information is important and needed to share between services',
      }),
    );
  }
}
