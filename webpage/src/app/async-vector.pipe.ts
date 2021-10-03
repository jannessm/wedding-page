import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vector } from 'src/models/vector';

@Pipe({
  name: 'asyncVector'
})
export class AsyncVectorPipe implements PipeTransform {

  transform(value: Vector, ...args: unknown[]): Observable<string> {
    return value.vector.pipe(map(vec => vec.join(' / ')));
  }

}
