import { testElementC, fireEvent, create, renderFormElement } from './common';
import { ButtonProps } from '../buttons_view';

import sinon from 'sinon';

const createButton = create<ButtonProps>('Button');

describe('Vanilla > Buttons', () => {
  it('renders with base properties', () => {
    const buttonDefinition = createButton({ text: 'Button', type: 'Custom Type' as Any });
    testElementC({ element: buttonDefinition });

    cy.findByText('Button').should('exist');
    cy.findByText('Button').should('have.attr', 'type', 'Custom Type');
  });

  it('allows to click with string specified handler', () => {
    const fn = sinon.spy();
    const handlers = {
      click: () => fn()
    };
    const buttonDefinition = createButton({ text: 'Button', onClick: 'click' });
    testElementC({ element: buttonDefinition, handlers });
    cy.findByText('Button')
      .click()
      .then(() => {
        sinon.assert.calledOnce(fn);
      });
  });

  it('allows to click with string specified handler', () => {
    const fn = cy.spy().as('spy');
    const handlers = {
      click: () => fn()
    };
    const buttonDefinition = createButton({ text: 'Button', onClick: 'click' });
    testElementC({ element: buttonDefinition, handlers });
    cy.findByText('Button').click();
    cy.get('@spy').should('have.been.called');
  });

  it('allows to click with dynamic handler', () => {
    const fn = cy.spy().as('spy');
    (global as Any)._test = fn;

    const buttonDefinition = createButton({
      text: 'Button',
      onClick: { dynamicHandler: `_test()` }
    });
    testElementC({ element: buttonDefinition });
    cy.findByText('Button').click();
    cy.get('@spy').should('have.been.called');
  });

  it('uses labels', () => {
    const buttonDefinition = createButton(
      {
        text: 'Button'
      },
      { label: 'My Button' }
    );
    testElementC({ element: buttonDefinition });
    cy.findByLabelText('My Button').should('exist');
  });
});
