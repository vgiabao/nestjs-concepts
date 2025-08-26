import { IntervalHost } from 'src/scheduler/decorators/interval-host.decorator';
import { Interval } from 'src/scheduler/decorators/interval.decorator';

@IntervalHost
export class CronService {
    @Interval(1000)
    handleCron() {
        console.log('Cron job running every 1000ms');
    }
}
