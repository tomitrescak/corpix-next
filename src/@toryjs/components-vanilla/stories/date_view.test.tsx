import React from 'react';
import { testRender } from './common';

import { NormalDate, IsoDate, InvalidDate } from './date_view.stories';

describe('Vanilla > Date View', () => {
  it('renders with top label and allows click', () => {
    const root = testRender(<NormalDate />);
    const checkbox = root.getByText('23/02/1980 11:16');

    expect(root.getByLabelText('Normal')).toBeInTheDocument();
    expect(checkbox).toBeInTheDocument();
  });

  it('renders with top label and allows click', () => {
    const root = testRender(<IsoDate />);
    const checkbox = root.getByText('15/Oct/1996 10:05');

    expect(checkbox).toBeInTheDocument();
  });

  it('renders with top label and allows click', () => {
    const root = testRender(<InvalidDate />);
    const checkbox = root.getByText('Invalid Iso Date');

    expect(checkbox).toBeInTheDocument();
  });
});
