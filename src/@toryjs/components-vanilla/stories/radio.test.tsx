import React from 'react';
import { testRender, fireEvent } from './common';

import { Horizontal, Vertical, Readonly, Report } from './radio.stories';

describe('Vanilla > Radio', () => {
  it('renders as horizontal list', () => {
    const root = testRender(<Horizontal />);
    const input = root.getByLabelText('Sex');

    expect(input).toHaveStyle('display: flex');
    expect(input.childNodes).toHaveLength(3);

    const selection = root.getByLabelText('Female');
    expect(selection).not.toBeChecked();

    fireEvent.click(selection);
    expect(selection).toBeChecked();
  });

  it('renders in vertical manner with styled children', () => {
    const root = testRender(<Vertical />);
    const input = root.getByLabelText('Sex');

    expect(input).toHaveStyle('display: block');

    // container is styled with component props
    const selection = root.getByLabelText('Female');
    expect(selection.parentElement).toHaveStyle('margin: 4px');
  });

  it('renders readonly', () => {
    const root = testRender(<Readonly />);
    const input = root.getByLabelText('Female');

    expect(input).toBeDisabled();
  });

  it('renders in report mode', () => {
    const root = testRender(<Report />);
    const input = root.getByLabelText('Sex');

    expect(input).toHaveTextContent('Other');
  });
});
