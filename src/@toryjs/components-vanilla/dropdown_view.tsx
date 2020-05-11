import React from 'react';

import { FormComponentProps, Option, BoundType } from '@toryjs/form';

import { observer } from 'mobx-react';
import {
  simpleHandle,
  resolveProps,
  ToryComponent,
  setValue,
  resolveComponentProps,
  Text
} from '@toryjs/ui';
import { useAsyncMemo } from './async_memo_hook';

export type DropdownProps = {
  collection: number;
  filterSource: BoundType;
  filterColumn: string;
  asyncOptionsHandler: string;
  options: Option[];
  textField: string;
  valueField: string;
  value: BoundType;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
};

const defaultLoadingOptions: Option[] = [{ label: 'Loading ...', value: '' }];

async function parseOptions(
  props: FormComponentProps<DropdownProps>
): Promise<{ options: Option[]; selected: Any; componentProps: Any }> {
  let {
    formElement,
    componentProps: {
      filterSource,
      filterColumn,
      asyncOptionsHandler,
      textField,
      valueField,
      options,
      collection,
      value,
      ...componentProps
    }
  } = resolveProps(props);

  if (collection) {
    asyncOptionsHandler = 'loadCollection';
  }

  let cached: any = props.context.providers.ssr || {};

  if (asyncOptionsHandler != null) {
    options = cached[formElement.uid];

    if (!options) {
      options = await simpleHandle(props, asyncOptionsHandler, filterSource);
      cached[formElement.uid] = options;
    }
  }

  // this might happen before async load and FILTER becomes one of the async dependencies

  let filteredOptions: Option[] =
    filterSource && filterColumn && options
      ? options.filter((v: any) => v[filterColumn] === filterSource)
      : options
      ? options
      : [];

  // we may map to different fields
  if (textField || valueField) {
    filteredOptions = filteredOptions.map(o => ({
      label: textField ? o[textField] : o.text,
      value: valueField ? o[valueField] : o.value
    }));
  }

  const currentOption = filteredOptions.find((o: Option) => o.value === value);

  return { options: filteredOptions, selected: currentOption, componentProps };
}

export const Dropdown: ToryComponent<DropdownProps> = props => {
  const { filterSource, options: defaultOptions } = resolveComponentProps(props);

  let { options = defaultLoadingOptions, selected, componentProps } = useAsyncMemo(
    () => parseOptions(props),
    [filterSource],
    {
      options: defaultOptions,
      selected: undefined,
      componentProps: {}
    }
  );

  if (props.reportOnly) {
    return <Text {...componentProps}>{selected?.label}</Text>;
  }

  return (
    <select {...componentProps} disabled={props.readOnly}>
      {options.map((e: Option, i: number) => (
        <option key={i} value={e.value}>
          {e.label}
        </option>
      ))}
    </select>
  );
};

export const DropdownView: ToryComponent<DropdownProps> = {
  component: observer(Dropdown),
  componentProps(props) {
    return {
      onChange(e) {
        setValue(props, e.currentTarget.value);
      }
    };
  }
};
