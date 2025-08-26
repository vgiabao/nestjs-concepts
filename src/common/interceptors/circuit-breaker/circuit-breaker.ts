import { CallHandler } from "@nestjs/common"
import { tap, throwError } from 'rxjs'

const SUCCESS_THRESHOLD = 3
const FAILURE_THRESHOLD = 3
const OPEN_TO_HALF_OPEN_WAIT_TIME = 60000

enum CIRCUIT_BREAKER_STATE {
    Closed,
    Open,
    HalfOpen
}

export class CircuitBreaker {
    private state: CIRCUIT_BREAKER_STATE = CIRCUIT_BREAKER_STATE.Closed
    private failureCount: number = 0
    private successCount: number = 0
    private lastError: Error;
    private nextAttempt: number;

    exec(next: CallHandler) {
        if (this.state === CIRCUIT_BREAKER_STATE.Open) {
            if (this.nextAttempt > Date.now()) {
                return throwError(() => this.lastError);
            }
            this.state = CIRCUIT_BREAKER_STATE.HalfOpen;
        }
        return next.handle().pipe(
            tap({
                next: () => this.handleSuccess(),
                error: (error: Error) => this.handleError(error)
            })
        )
    }

    private handleSuccess() {
        this.failureCount = 0

        if (this.state === CIRCUIT_BREAKER_STATE.HalfOpen) {
            this.successCount++;
        }

        if (this.successCount >= SUCCESS_THRESHOLD) {
            this.successCount = 0;
            this.state = CIRCUIT_BREAKER_STATE.Closed;
        }
    }

    private handleError(error: Error) {
        this.failureCount++;

        if (this.failureCount >= FAILURE_THRESHOLD ||
            this.state === CIRCUIT_BREAKER_STATE.HalfOpen
        ) {
            this.state = CIRCUIT_BREAKER_STATE.Open
            this.lastError = error
            this.nextAttempt = Date.now() + OPEN_TO_HALF_OPEN_WAIT_TIME
            console.log('Circuit breaker opened')
        }
    }
}

