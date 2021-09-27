import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'countdown'
})
export class CountdownPipe implements PipeTransform{
    transform(remainingSeconds: number): string {
        const minutes = Math.floor(remainingSeconds/60);
        const seconds = Math.floor(remainingSeconds - (minutes * 60));
        return `${minutes}m ${seconds}s`;
    }

}