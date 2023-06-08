import { FilterIgnoreCaseLikePipe } from './filter.pipe';

describe('FilterPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterIgnoreCaseLikePipe();
    expect(pipe).toBeTruthy();
  });
});
