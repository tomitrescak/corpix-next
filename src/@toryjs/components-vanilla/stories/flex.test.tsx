import React from 'react';
import { testRender } from './common';

import { Horizontal, Vertical } from './flex.stories';

describe('Vanilla > Flex', () => {
  it('renders horizontal list', async () => {
    const root = testRender(<Horizontal />);

    const control = root.getByLabelText('Horizontal');
    expect(control.childNodes).toHaveLength(3);

    expect(control.className).toContain('row-layout');
  });

  it('renders horizontal list', async () => {
    const root = testRender(<Vertical />);

    const control = root.getByLabelText('Vertical');
    expect(control.childNodes).toHaveLength(3);

    expect(control.className).toContain('column-layout');
  });
});
