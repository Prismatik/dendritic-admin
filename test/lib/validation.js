import { isUUID } from '../../src/lib/validation';

describe('./lib/validation', function() {
  describe('.isUUID', function() {
    it('must allow passing numbers', function() {
      isUUID(123).must.be.false();
    });

    it('must return false if not UUID', function() {
      isUUID('123').must.be.false();
    });

    it('must return ture if UUID', function() {
      isUUID('12429635-4c0e-43fb-be41-6fd7aeb89405').must.be.true();
    });
  });
});
