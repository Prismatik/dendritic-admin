import React from 'react';
import { Link } from 'react-router';
import Action from 'root/src/components/action';
import { shallowComponent } from 'root/test/react_utils';

describe('./components/action', function() {
  describe('.render', function() {
    it('must render correctly', function() {
      const el = <Action path='/harro/garry'>Hi!</Action>;
      const rendered = <Link
        onlyActiveOnIndex={false}
        style={{}}
        to={'/harro/garry'}>
        Hi!
      </Link>;

      shallowComponent(el).must.be.jsx(rendered);
    });
  });
});
