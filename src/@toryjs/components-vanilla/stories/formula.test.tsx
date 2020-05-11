import React from 'react';
import { testRender } from './common';

import { Default } from './formula.stories';

describe('Vanilla > Formula', () => {
  it('evaluates and renders the formula', async () => {
    const root = testRender(<Default />);

    const control = root.getByLabelText('Formula');
    expect(control).toHaveTextContent('40');
  });
});
