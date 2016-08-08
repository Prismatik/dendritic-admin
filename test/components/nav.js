import React from 'react';
import Action from '../../src/components/action';
import ListItem from '../../src/components/list_item';
import Nav from '../../src/components/nav';
import { shallowComponent } from '../react_utils';

describe('./components/nav', function() {
  describe('.render', function() {
    it('must render correctly', function() {
      const el = <Nav items={[
        { path: '/', name: 'Home' },
        { path: '/collections/sheep', name: 'Sheep' },
        { path: '/collections/wolf', name: 'Wolf' }
      ]} />;

      const rendered = <nav className='red lighten-1'>
        <ul className='left'>
          <ListItem>
            <Action
              className='white-text flow-text'
              path='/'>
              Home
            </Action>
          </ListItem>
          <ListItem>
            <Action
              className='white-text flow-text'
              path='/collections/sheep'>
              Sheep
            </Action>
          </ListItem>
          <ListItem>
            <Action
              className='white-text flow-text'
              path='/collections/wolf'>
              Wolf
            </Action>
          </ListItem>
        </ul>
      </nav>;

      shallowComponent(el).must.be.jsx(rendered);
    });
  });
});
