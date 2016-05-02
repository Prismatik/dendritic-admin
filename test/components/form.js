import React from 'react';
import Form from 'root/src/components/form';
import FormInput from 'root/src/components/form_input';
import { shallowComponent } from 'root/test/react_utils';

describe('./components/form', function() {
  describe('.render', function() {
    it('must render correctly', function() {
      const el = <Form>
        {{
          id: { type: 'text', value: 123 },
          name: { type: 'text', value: 'garry' }
        }}
      </Form>;

      const rendered = <form onSubmit={function() {}}>
        <FormInput
          defaultValue={123}
          id='id'
          name='id'
          type='text'
        />
        <FormInput
          defaultValue='garry'
          id='name'
          name='name'
          type='text'
        />
        <FormInput
          className='waves-effect waves-light btn cyan'
          text='Submit'
          type='submit'
        />
      </form>;

      shallowComponent(el).must.be.jsx(rendered);
    });
  });
});
