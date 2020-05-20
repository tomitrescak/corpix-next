/// <reference types="cypress" />

import React from 'react';
import { mount } from 'cypress-react-unit-test';

import { Simple, Bound, Interpolated, Styled } from './text.stories';

const HelloWorld = () => <div>Hello World!</div>;

describe('HelloWorld component', () => {
  it('works', () => {
    mount(<HelloWorld />);
    // now use standard Cypress commands
    // cy.contains('Hello World!').should('be.visible');
    cy.findByText('Hello World!').should('exist');
  });

  it('renders with top label and allows click', () => {
    mount(<Simple />);

    cy.findByText('Simple').should('exist');
  });
});
