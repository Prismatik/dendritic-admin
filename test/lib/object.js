import { deepFreeze } from '../../src/lib/object';

describe('./lib/object', function() {
  describe('.deepFreeze', function() {
    it('must freeze object', function() {
      const obj = { name: 'garry' };
      deepFreeze(obj).must.be.frozen();
    });

    it('must recursively freeze nested objects', function() {
      const obj = {
        name: 'garry',
        attributes: {
          hair: 'awesome',
          style: { front: 'super awesome' }
        }
      };
      deepFreeze(obj.attributes).must.be.frozen();
      deepFreeze(obj.attributes.style).must.be.frozen();
    });
  });
});
