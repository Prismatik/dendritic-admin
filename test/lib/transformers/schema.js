import { cloneDeep } from 'lodash';
import {
  mapSchemaToData,
  mapSchemaToFormInputs,
  extractHeaders,
  arrayToStr
} from 'root/src/lib/transformers/schema';
import schema from 'root/test/valid_api_schema.json';

const ValidApiSchema = cloneDeep(schema);

describe('./lib/transformers/schema', function() {
  describe('.mapSchemaToData', function() {
    it('must return array of objects', function() {
      const result = mapSchemaToData(ValidApiSchema.sheep, { id: 1 });
      result.must.be.an.array();
      result[0].must.be.an.object();
    });

    it('must return schema prop as undefined if not in data', function() {
      const result = mapSchemaToData(ValidApiSchema.sheep, { id: 1 });
      result[0].must.have.property('name', undefined);
      result[0].must.have.property('attributes.color', undefined);
      result[0].must.have.property('attributes.size', undefined);
    });

    it('must not return nested properties without dot notation', function() {
      const result = mapSchemaToData(ValidApiSchema.sheep, { id: 1 });
      result[0].must.not.have.property('color');
    });

    it('must return dot notation item for nested properties', function() {
      const result = mapSchemaToData(ValidApiSchema.sheep, { id: 1 });
      result[0].must.have.property('attributes.color');
    });

    it('must return link formatted relationship', function() {
      const data = { sheep: 2 };
      const result = mapSchemaToData(ValidApiSchema.wolf, data);
      result[0].sheep.must.eql(`/sheep/${data.sheep}`);
    });

    it('must return formatted array values', function() {
      const data = { name: ['garry', 'larry'] };
      const result = mapSchemaToData(ValidApiSchema.sheep, data);
      result[0].name.must.eql(arrayToStr(data.name));
    });
  });

  describe('.mapSchemaToFormInputs', function() {
    it('must return array of objects', function() {
      const data = [
        { id: 1, name: 'garry' },
        { id: 2, name: 'larry' }
      ];
      const props = ValidApiSchema.sheep.properties;
      const result = mapSchemaToFormInputs(props, data);

      result.must.be.an.array();
      result[0].must.be.an.object();
    });

    it('must not return type = string', function() {
      const data = { id: 1 };
      const props = ValidApiSchema.sheep.properties;
      const result = mapSchemaToFormInputs(props, data);

      result[0].id.type.must.not.eql('string');
    });

    it('must return type = string as type = text', function() {
      const data = { id: 1 };
      const props = ValidApiSchema.sheep.properties;
      const result = mapSchemaToFormInputs(props, data);

      result[0].id.type.must.eql('text');
    });

    it('must not return faker property', function() {
      const data = { id: 1 };
      const props = ValidApiSchema.sheep.properties;
      const result = mapSchemaToFormInputs(props, data);

      result[0].must.not.have.property('faker');
    });

    it('must return value property', function() {
      const data = { id: 1 };
      const props = ValidApiSchema.sheep.properties;
      const result = mapSchemaToFormInputs(props, data);

      result[0].id.value.must.be(1);
    });

    it('must not return value property if undefined', function() {
      const data = { id: 1, name: undefined };
      const props = ValidApiSchema.sheep.properties;
      const result = mapSchemaToFormInputs(props, data);

      result[0].name.must.not.have.property('value');
    });
  });

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
