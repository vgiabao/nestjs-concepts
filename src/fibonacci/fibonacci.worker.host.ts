import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { filter, firstValueFrom, fromEvent, Observable, map } from "rxjs";
import { join } from "path";
import { Worker } from "worker_threads";
import { randomUUID } from "crypto";

@Injectable()
export class FibonacciWorkerHost implements OnApplicationBootstrap, OnApplicationShutdown {
    private worker: Worker;
    private message$: Observable<{ id: string; result: number }>

    onApplicationBootstrap() {
        this.worker = new Worker(join(__dirname, 'fibonacci.worker'));
        this.message$ = fromEvent(this.worker, 'message') as Observable<{ id: string; result: number }>;

    }

    async onApplicationShutdown(signal?: string) {
        this.worker.terminate();
    }

    run(n: number) {
        const requestCallIdentifier = randomUUID();
        this.worker.postMessage({ n, requestCallIdentifier });
        return firstValueFrom(
            this.message$.pipe(
                filter(({ id }) => id === requestCallIdentifier),
                map(({ result }) => result)
            )
        )
    }
}