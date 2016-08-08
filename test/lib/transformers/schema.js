import { forEach } from 'lodash';
import {
  mapSchemaToData,
  mapSchemaToFormInputs,
  extractHeaders,
  arrayToStr
} from '../../../src/lib/transformers/schema';
import { ValidSchema } from '../../fixtures/valid_schema';

describe('./lib/transformers/schema', function() {
  describe('.mapSchemaToData', function() {
    it('must return array of objects', function() {
      const result = mapSchemaToData(ValidSchema.sheep, { id: 1 });
      result.must.be.an.array();
      result[0].must.be.an.object();
    });

    it('must return schema prop as undefined if not in data', function() {
      const result = mapSchemaToData(ValidSchema.sheep, { id: 1 });
      result[0].must.have.property('name', undefined);
      result[0].must.have.property('attributes.color', undefined);
      result[0].must.have.property('attributes.size', undefined);
    });

    it('must not return nested properties without dot notation', function() {
      const result = mapSchemaToData(ValidSchema.sheep, { id: 1 });
      result[0].must.not.have.property('color');
    });

    it('must return dot notation item for nested properties', function() {
      const result = mapSchemaToData(ValidSchema.sheep, { id: 1 });
      result[0].must.have.property('attributes.color');
    });

    it('must return link formatted relationship', function() {
      const data = { sheep: 2 };
      const result = mapSchemaToData(ValidSchema.wolf, data);
      result[0].sheep.must.eql(`/sheep/${data.sheep}`);
    });

    it('must return formatted array values', function() {
      const data = { name: ['garry', 'larry'] };
      const result = mapSchemaToData(ValidSchema.sheep, data);
      result[0].name.must.eql(arrayToStr(data.name));
    });
  });

  describe('.mapSchemaToFormInputs', function() {
    beforeEach(function() {
      this.schema = ValidSchema.sheep;
    });

    it('must return an object', function() {
      const data = [
        { id: 1, name: 'garry' },
        { id: 2, name: 'larry' }
      ];
      const result = mapSchemaToFormInputs(this.schema, data);

      result.must.be.an.object();
    });

    it('must not return type = string', function() {
      const data = { id: 1 };
      const result = mapSchemaToFormInputs(this.schema, data);

      result.id.type.must.not.eql('string');
    });

    it('must return type = string as type = text', function() {
      const data = { id: 1 };
      const result = mapSchemaToFormInputs(this.schema, data);

      result.id.type.must.eql('text');
    });

    it('must not return faker property', function() {
      const data = { id: 1 };
      const result = mapSchemaToFormInputs(this.schema, data);

      result.must.not.have.property('faker');
    });

    it('must return value property', function() {
      const data = { id: 1 };
      const result = mapSchemaToFormInputs(this.schema, data);

      result.id.value.must.be(1);
    });

    it('must not return value property if undefined', function() {
      const data = { id: 1, name: undefined };
      const result = mapSchemaToFormInputs(this.schema, data);

      result.name.must.not.have.property('value');
    });

    it('must add required property if found in schema', function() {
      const data = { id: 1, name: undefined };
      const result = mapSchemaToFormInputs(this.schema, data);

      result.name.must.eql({ required: true, type: 'text' });
    });

    it('must not add required property if not required by schema', function() {
      const data = { id: 1, name: undefined };
      const result = mapSchemaToFormInputs(this.schema, data);

      result.id.must.not.have.property('required');
    });

    it('must return empty value property if no data passed', function() {
      forEach(mapSchemaToFormInputs(this.schema), val => {
        val.must.not.have.property('value');
      });
    });
  });

  describe('.extractHeaders', function() {
    it('must return array', function() {
      const result = extractHeaders(ValidSchema.sheep.properties);
      result.must.be.an.array();
    });

    it('must not return nested properties without dot notation', function() {
      const result = extractHeaders(ValidSchema.sheep.properties);
      result.must.not.include('color');
    });

    it('must return dot notation item for nested properties', function() {
      const result = extractHeaders(ValidSchema.sheep.properties);
      result.must.include('attributes.color');
    });
  });
});
