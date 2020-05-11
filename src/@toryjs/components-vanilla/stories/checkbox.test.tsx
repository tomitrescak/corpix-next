import React from 'react';
import { testRender, fireEvent } from './common';

import { TopLabel, Readonly, Report } from './checkbox.stories';

describe('Vanilla > Checkbox', () => {
  it('checkbox renders with top label and allows click', () => {
    const root = testRender(<TopLabel />);
    const checkbox = root.getByLabelText('Top');

    expect(checkbox).toBeDefined();
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });
});

it('renders disabled', () => {
  const root = testRender(<Readonly />);
  const input = root.getByLabelText('After');

  expect(input).toBeDisabled();
});

it('renders in report mode', () => {
  const root = testRender(<Report />);

  const checked = root.getByLabelText('Checked');
  expect(checked).toHaveAttribute('data-checked', 'true');
  expect(checked.nodeName).toBe('svg');

  const unchecked = root.getByLabelText('Unchecked');
  expect(unchecked).toHaveAttribute('data-checked', 'false');
  expect(unchecked.nodeName).toBe('svg');
});
