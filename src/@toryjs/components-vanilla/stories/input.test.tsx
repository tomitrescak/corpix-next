import React from 'react';
import { testRender, fireEvent } from './common';

import { View, Readonly, Report } from './input.stories';

describe('Vanilla > Input', () => {
  it('renders with label and allows change', () => {
    const root = testRender(<View />);
    const input = root.getByLabelText('Name');

    expect(input).toHaveValue('Tomas');
    fireEvent.change(input, { target: { value: 'Valeria' } });

    expect(input).toHaveValue('Valeria');
    expect(root.getByText('Valeria')).toBeInTheDocument();
  });

  it('renders disabled', () => {
    const root = testRender(<Readonly />);
    const input = root.getByLabelText('Name');

    expect(input).toBeDisabled();
  });

  it('renders in report mode', () => {
    const root = testRender(<Report />);
    const input = root.getByLabelText('Name');

    expect(input).toHaveTextContent('Tomas');
  });
});
