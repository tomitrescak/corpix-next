import * as React from 'react';

import { Text, ToryComponent } from '@toryjs/ui';

import { renderFormElement, create } from './common';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Vanilla/Dynamic Component'
};

type Props = {
  name: string;
  onClick: Any;
};

const TestControl: ToryComponent<{}> = props => (
  <Text is="div" {...props.componentProps}>
    Test
    <div>Id: {props.componentProps?.id}</div>
    <div>Data-Control: {props.componentProps?.['data-control'] || 'None'}</div>
    <div>ClassName: {props.componentProps?.className || 'None'}</div>
    <div>Style: {JSON.stringify(props.componentProps?.style) || 'None'}</div>
  </Text>
);
const AdvancedControl: ToryComponent<Props> = {
  // eslint-disable-next-line react/display-name
  component: props => {
    const { onClick, ...componentProps } = props.componentProps!;
    return (
      <Text is="div" {...componentProps}>
        Advanced:
        <div>Name: {props.componentProps?.name}</div>
        <button onClick={onClick}>Click Me!</button>
      </Text>
    );
  },
  componentProps: () => ({
    name: 'Tomas',
    onClick: action('Component props click ...')
  })
};

const catalogue = {
  components: {
    Test: TestControl,
    Advanced: AdvancedControl
  }
};

const handlers = {
  clicked: action('Handled Click ...')
};

const createControl = create<{}>('Test');
const createAdvanced = create<Props>('Advanced');

export const Default = () =>
  renderFormElement({
    componentCatalogue: catalogue,
    element: createControl({}, {})
  });

export const DefaultWithStyle = () =>
  renderFormElement({
    componentCatalogue: catalogue,
    element: createControl(
      {
        className: 'ComponentClass',
        css: `
        background: blue;
        label: DynamicComponentClass;
      `,
        style: {
          fontSize: '10px'
        }
      },
      {
        className: 'ContainerClass',
        css: `
          background: red;
          font-weight: bold;
          color: white;
          label: DynamicContainerClass;
        `,
        style: {
          fontSize: '20px',
          padding: '10px'
        }
      }
    )
  });

export const WithLabel = () =>
  renderFormElement({
    componentCatalogue: catalogue,
    element: createControl({}, { label: 'My Label' })
  });

export const WithLabelAndStyle = () =>
  renderFormElement({
    componentCatalogue: catalogue,
    element: createControl(
      {
        className: 'ComponentClass',
        css: `
        background: blue;
        color: white;
        label: DynamicComponentClass;
      `,
        style: {
          fontSize: '10px'
        }
      },
      {
        className: 'ContainerClass',
        css: `
          background: red;
          font-weight: bold;
          label: DynamicContainerClass;
        `,
        label: 'Styled',
        style: {
          fontSize: '30px',
          padding: '10px'
        }
      }
    )
  });

export const InlineLabel = () =>
  renderFormElement({
    componentCatalogue: catalogue,
    element: createControl({}, { label: 'My Label:', inline: true })
  });

export const Hidden = () =>
  renderFormElement({
    componentCatalogue: catalogue,
    element: createControl({}, { hidden: true })
  });

export const MissingComponent = () =>
  renderFormElement({
    componentCatalogue: catalogue,
    element: { control: 'Missing', componentProps: {}, containerProps: {} } as Any
  });

export const CustomProps = () =>
  renderFormElement({
    componentCatalogue: catalogue,
    handlers,
    element: createAdvanced({
      onClick: {
        handler: 'clicked'
      }
    })
  });
