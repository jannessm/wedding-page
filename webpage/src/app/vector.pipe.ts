import { Pipe, PipeTransform } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vector } from 'src/models/vector';

@Pipe({
  name: 'vector'
})
export class VectorPipe implements PipeTransform {

  transform(value: Vector, ...args: unknown[]): string {
    return value.vector.join(' / ');
  }

}
