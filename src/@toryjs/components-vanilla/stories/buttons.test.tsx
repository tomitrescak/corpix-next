import { testElement, fireEvent, create } from './common';
import { ButtonProps } from '../buttons_view';
import sinon from 'sinon';

const createButton = create<ButtonProps>('Button');

describe('Vanilla > Buttons', () => {
  it('renders with base properties', () => {
    const buttonDefinition = createButton({ text: 'Button', type: 'Custom Type' as Any });
    const root = testElement({ element: buttonDefinition });

    expect(root.getByText('Button')).toBeDefined();
    expect(root.getByText('Button')).toHaveAttribute('type', 'Custom Type');
  });

  it.only('allows to click with string specified handler', () => {
    const fn = sinon.spy();
    const handlers = {
      click: () => fn()
    };
    const buttonDefinition = createButton({ text: 'Button', onClick: 'click' });
    const root = testElement({ element: buttonDefinition, handlers });
    const button = root.getByText('Button');

    fireEvent.click(button);

    sinon.assert.calledOnce(fn);
  });

  it('allows to click with string specified handler', () => {
    const fn = mock.fn();
    const handlers = {
      click: () => fn()
    };
    const buttonDefinition = createButton({ text: 'Button', onClick: 'click' });
    const root = testElement({ element: buttonDefinition, handlers });
    const button = root.getByText('Button');

    fireEvent.click(button);

    expect(fn).toHaveBeenCalled();
  });

  it('allows to click with dynamic handler', () => {
    const fn = mock.fn();
    (global as Any)._test = fn;

    const buttonDefinition = createButton({
      text: 'Button',
      onClick: { dynamicHandler: `_test()` }
    });
    const root = testElement({ element: buttonDefinition });
    const button = root.getByText('Button');

    fireEvent.click(button);

    expect(fn).toHaveBeenCalled();
  });

  it('uses labels', () => {
    const buttonDefinition = createButton(
      {
        text: 'Button'
      },
      { label: 'My Button' }
    );
    const root = testElement({ element: buttonDefinition });
    const button = root.getByLabelText('My Button');

    expect(button).toBeInTheDocument();
  });
});
