import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterIgnoreCaseLike',
})
export class FilterIgnoreCaseLikePipe implements PipeTransform {
  transform(values: string[], search: string): string[] {
    if (!values || !search) {
      return values;
    }

    return values.filter((v) =>
      v.toLocaleUpperCase().includes(search.toLocaleUpperCase())
    );
  }
}
