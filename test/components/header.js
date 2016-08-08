import React from 'react';
import Header from '../../src/components/header';
import Nav from '../../src/components/nav';
import { shallowComponent } from '../react_utils';

describe('./components/header', function() {
  describe('.render', function() {
    it('must render correctly', function() {
      const el = <Header collections={['sheep', 'wolf']} />;

      const rendered = <header className='red lighten-1'>
        <div className='row'>
          <div className='col s12'>
            <div className='container'>
              <Nav
                items={[
                  { path: '/', name: 'Home' },
                  { path: '/collections/sheep', name: 'Sheep' },
                  { path: '/collections/wolf', name: 'Wolf' }
                ]}
              />
            </div>
          </div>
        </div>
      </header>;

      shallowComponent(el).must.be.jsx(rendered);
    });
  });
});
