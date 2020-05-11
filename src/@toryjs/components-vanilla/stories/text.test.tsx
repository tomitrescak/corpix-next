import React from 'react';
import { testRender } from './common';

import { Simple, Bound, Interpolated, Styled } from './text.stories';

describe('Vanilla > Text', () => {
  it('checkbox renders with top label and allows click', () => {
    const root = testRender(<Simple />);

    expect(root.getByText('Simple')).toBeInTheDocument();
  });

  it('checkbox renders with top label and allows click', () => {
    const root = testRender(<Bound />);

    expect(root.getByText('Tomas Trescak')).toBeInTheDocument();
  });

  it('checkbox renders with top label and allows click', () => {
    const root = testRender(<Interpolated />);

    expect(root.getByText('My name is Tomas Trescak')).toBeInTheDocument();
  });

  it('checkbox renders with top label and allows click', () => {
    const root = testRender(<Styled />);
    const item = root.getByText('Styled');
    expect(item).toHaveStyle('font-size: 24px');
    expect(item.parentElement).toHaveStyle('padding: 18px');

    const item2 = root.getByText('Styled No Label');
    expect(item2).toHaveStyle('font-size: 24px'); // from component
    expect(item2).toHaveStyle('padding: 18px'); // from container
  });
});
