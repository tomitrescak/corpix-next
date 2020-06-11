import React from 'react';
import { mount, fireEvent } from './common';

import { TopLabel, Readonly, Report } from './checkbox.stories';

describe('Vanilla > Checkbox', () => {
  it('checkbox renders with top label and allows click', () => {
    mount(<TopLabel />);
    cy.findByLabelText('Top').should('exist').should('be.checked');
    cy.findByLabelText('Top').click().should('not.be.checked');
  });

  it('renders disabled', () => {
    mount(<Readonly />);
    cy.findByLabelText('After').should('be.disabled');
  });

  it('renders in report mode', () => {
    mount(<Report />);

    cy.findByLabelText('Checked').should('have.attr', 'data-checked', 'true');
    cy.findByLabelText('Unchecked').should('have.attr', 'data-checked', 'false');
    // .its('nodeName')
    // .should('eq', 'svg');
  });
});
