import { WithUuid } from './with-uuid.mixin';

describe('WithUuid', () => {
  it('should be defined', () => {
    expect(new WithUuidMixin()).toBeDefined();
  });
});
