import React from 'react';
import { testRender, fireEvent } from './common';

import { Basic, Async, Cascade, CascadeAsync, Readonly, Report } from './dropdown.stories';

describe('Vanilla > Dropdown', () => {
  it('renders with top label, allows click and changes options', async () => {
    const root = testRender(<Basic />);

    const control = await root.findByLabelText('Basic');
    expect(control.childNodes).toHaveLength(3);

    const option = root.getByText('Two');
    expect(option).toHaveAttribute('value', '2');
  });

  it('renders with asynchronous options', async () => {
    //mock.useFakeTimers();
    const root = testRender(<Async />);

    mock.runAllTimers();
    const control = await root.findByLabelText('Async Load');

    expect(control.childNodes).toHaveLength(3);
    expect(root.getByText('Two')).toHaveAttribute('value', '2');
  });

  it('renders in cascade based on filter fields', async () => {
    //mock.useFakeTimers();
    const root = testRender(<Cascade />);
    mock.runAllTimers();

    const carControl = (await root.findByLabelText('Cars')) as HTMLSelectElement;

    // change to skoda
    fireEvent.change(carControl, { target: { value: 'skoda' } });
    expect(carControl.value).toBe('skoda');

    let makeControl = await root.findByLabelText('Makes');
    expect(makeControl.childNodes).toHaveLength(2);
    expect(root.getByText('Octavia')).toBeInTheDocument();

    // change to bmw

    fireEvent.change(carControl, { target: { value: 'bmw' } });

    makeControl = await root.findByLabelText('Makes');
    expect(makeControl.childNodes).toHaveLength(3);
    expect(root.getByText('M5')).toBeInTheDocument();
    expect(root.queryByText('Octavia')).not.toBeInTheDocument();
  });

  it('renders in async cascade based on filter fields', async () => {
    //mock.useFakeTimers();
    const root = testRender(<CascadeAsync />);
    mock.runAllTimers();

    const carControl = (await root.findByLabelText('Cars')) as HTMLSelectElement;

    // change to skoda
    fireEvent.change(carControl, { target: { value: 'skoda' } });
    expect(carControl.value).toBe('skoda');

    mock.runAllTimers();
    let makeControl = await root.findByLabelText('Makes');
    expect(makeControl.childNodes).toHaveLength(2);
    expect(root.getByText('Octavia')).toBeInTheDocument();

    // change to bmw

    fireEvent.change(carControl, { target: { value: 'bmw' } });
    mock.runAllTimers();

    makeControl = await root.findByLabelText('Makes');
    expect(makeControl.childNodes).toHaveLength(3);
    expect(root.getByText('M5')).toBeInTheDocument();
    expect(root.queryByText('Octavia')).not.toBeInTheDocument();
  });

  it('renders disabled', async () => {
    const root = testRender(<Readonly />);
    mock.runAllTimers();
    const input = await root.findByLabelText('Basic');

    expect(input).toBeDisabled();
  });

  it('renders in report mode', async () => {
    const root = testRender(<Report />);
    const input = await root.findByLabelText('Basic');

    expect(input).toHaveTextContent('Skoda');
  });

  // it('renders with top label and allows click', () => {
  //   const root = testRender(<InvalidDate />);
  //   const checkbox = root.getByText('Invalid Iso Date');

  //   expect(checkbox).toBeInTheDocument();
  // });
});
