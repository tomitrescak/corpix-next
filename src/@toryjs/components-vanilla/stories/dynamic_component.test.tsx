import React from 'react';
import { testRender, renderFormElement } from './common';

import {
  Default,
  WithLabel,
  WithLabelAndStyle,
  InlineLabel,
  Hidden,
  MissingComponent,
  DefaultWithStyle,
  CustomProps
} from './dynamic_component.stories';
import { ToryComponent } from '@toryjs/ui';
import { fireEvent } from '@testing-library/react';

describe.only('Vanilla > Dynamic Component', () => {
  it('renders a simple control', () => {
    const root = testRender(<Default />);
    expect(root.getByText('Test')).toBeInTheDocument();
    expect(root.getByText('Id: 1')).toBeInTheDocument();
    expect(root.getByText('ClassName: None')).toBeInTheDocument();
    expect(root.getByText('Style: None')).toBeInTheDocument();
  });

  it('renders with no label, combining classname and style from container', () => {
    const root = testRender(<DefaultWithStyle />);
    expect(
      root.getByText(
        'ClassName: ContainerClass ComponentClass css-o47rmu-DynamicContainerClass-DynamicComponentClass'
      )
    ).toBeInTheDocument();
    expect(root.getByText('Style: {"fontSize":"10px","padding":"10px"}')).toBeInTheDocument();
  });

  it('renders with label', () => {
    const root = testRender(<WithLabel />);
    expect(root.getByLabelText('My Label')).toBeInTheDocument();
  });

  it('renders with label and style', () => {
    const root = testRender(<WithLabelAndStyle />);
    expect(
      root.getByText('ClassName: ComponentClass css-95iktm-DynamicComponentClass')
    ).toBeInTheDocument();
    expect(root.getByText('Style: {"fontSize":"10px"}')).toBeInTheDocument();

    const container = root.getByText('Styled').parentElement;
    expect(container).toHaveClass('ContainerClass css-qdk962-DynamicContainerClass');
    expect(container).toHaveStyle('font-size: 30px;padding: 10px');
  });

  it('renders inline label', () => {
    const root = testRender(<InlineLabel />);
    const element = root.getByLabelText('My Label:');
    expect(element).toBeInTheDocument();

    expect(element.parentElement?.className).toContain('Inline');
  });

  it('hides the element', () => {
    const root = testRender(<Hidden />);
    expect(root.queryByText('Test')).not.toBeInTheDocument();
  });

  it('renders the missing component if compponent does not exist', () => {
    const root = testRender(<MissingComponent />);
    expect(root.getByText('Component does not exist: "Missing"')).toBeInTheDocument();
  });

  it('renders the custom pops using alternative syntax', () => {
    const root = testRender(<CustomProps />);
    expect(root.getByText('Name: Tomas')).toBeInTheDocument();
  });

  it('renders the custom pops using alternative syntax', () => {
    const root = testRender(<CustomProps />);
    expect(root.getByText('Name: Tomas')).toBeInTheDocument();
  });

  it('combines events', () => {
    const handledSpy = mock.fn();
    const componentSpy = mock.fn();

    const handlers = {
      handledClick: handledSpy
    };

    const TestComponent: ToryComponent<Any> = props => (
      <button onClick={props.componentProps.onClick}>Click</button>
    );
    const Test: ToryComponent<Any> = {
      component: TestComponent,
      componentProps() {
        return {
          onClick: componentSpy
        };
      }
    };
    const catalogue = {
      components: {
        Test
      }
    };
    const root = testRender(
      renderFormElement({
        componentCatalogue: catalogue,
        handlers,
        element: {
          control: 'Test',
          uid: 'test',
          componentProps: {
            onClick: { handler: 'handledClick' }
          },
          containerProps: {}
        }
      })
    );

    const button = root.getByText('Click');

    fireEvent.click(button, {});

    expect(handledSpy).toHaveBeenCalledTimes(1);
    expect(componentSpy).toHaveBeenCalledTimes(1);
  });
});
