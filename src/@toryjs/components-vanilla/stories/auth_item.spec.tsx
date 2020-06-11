import React from 'react';
import { mount } from 'cypress-react-unit-test';

import { view as View } from './auth_item.stories';

describe('Auth Item', () => {
  it('renders only authorised nodes', () => {
    mount(<View />);

    cy.findByText('Admin Invisible').should('not.exist');
    cy.findByText('User Visible').should('exist');
  });
});
