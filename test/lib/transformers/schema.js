import { cloneDeep } from 'lodash';
import { extractHeaders } from 'root/src/lib/transformers/schema';
import schema from 'root/test/valid_api_schema.json';

const ValidApiSchema = cloneDeep(schema);

describe('./lib/transformers/schema', function() {
  describe('.extractHeaders', function() {
    it('must return array', function() {
      const result = extractHeaders(ValidApiSchema.sheep.properties);
      result.must.be.an.array();
    });

    it('must not return nested properties without dot notation', function() {
      const result = extractHeaders(ValidApiSchema.sheep.properties);
      result.must.not.include('color');
    });

    it('must return dot notation item for nested properties', function() {
      const result = extractHeaders(ValidApiSchema.sheep.properties);
      result.must.include('attributes.color');
    });
  });
});
