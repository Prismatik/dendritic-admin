import React from 'react';
import Header from 'root/src/components/header';
import Nav from 'root/src/components/nav';
import { shallowComponent } from 'root/test/react_utils';
import ValidState from 'root/test/fixtures/valid_state';

const state = ValidState();

describe('./components/header', function() {
  describe('.render', function() {
    it('must render correctly', function() {
      const collections = Object.keys(state.collections);
      const el = <Header collections={collections} />;
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
