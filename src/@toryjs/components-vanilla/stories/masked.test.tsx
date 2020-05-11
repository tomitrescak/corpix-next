import React from 'react';
import { testRender, fireEvent } from './common';

import { Empty, Filled, Readonly, Report } from './masked.stories';

describe('Vanilla > Masked Input', () => {
  it('renders with mask and allows only masked change', () => {
    const root = testRender(<Empty />);
    const input = root.getByLabelText('Zip');

    expect(input).toHaveValue('');

    fireEvent.change(input, { target: { value: '111ttt' } });
    expect(input).toHaveValue('111-___');

    fireEvent.change(input, { target: { value: '111666' } });
    expect(input).toHaveValue('111-666');
  });

  it('renders pre-filled', () => {
    const root = testRender(<Filled />);
    const input = root.getByLabelText('Zip');

    expect(input).toHaveValue('123-456');
  });

  it('renders disabled', () => {
    const root = testRender(<Readonly />);
    const input = root.getByLabelText('Zip');

    expect(input).toBeDisabled();
  });

  it('renders in report mode', () => {
    const root = testRender(<Report />);
    const input = root.getByLabelText('Zip');

    expect(input).toHaveTextContent('123-456');
  });
});
