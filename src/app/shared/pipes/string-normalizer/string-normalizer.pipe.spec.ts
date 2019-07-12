import { StringNormalizerPipe } from './string-normalizer.pipe';

describe('StringNormalizerPipe', () => {
  it('create an instance', () => {
    const pipe = new StringNormalizerPipe();
    expect(pipe).toBeTruthy();
  });
});
