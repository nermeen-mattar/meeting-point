import { GetLocalTimePipe } from './get-local-time.pipe';

describe('GetLocalTimePipe', () => {
  it('create an instance', () => {
    const pipe = new GetLocalTimePipe('en');
    expect(pipe).toBeTruthy();
  });
});
