import { JSONSchema } from '../json_schema';
import { DataSet } from '../stores/dataset_model';
import { buildDataModel } from '../stores/dataset_builder';

function isSimpleType(schema: JSONSchema) {
  return !schema.type?.match(/(object|array)/);
}

function tryParseInt(value: Any) {
  let parsedValue = parseInt(value);
  if (isNaN(parsedValue)) {
    return value;
  }
  return parsedValue;
}

function tryParseFloat(value: Any) {
  let parsedValue = parseFloat(value);
  if (isNaN(parsedValue)) {
    return value;
  }
  return parsedValue;
}

export function buildJs(value: Any): Any {
  if (value instanceof DataSet) {
    return value.toJS();
  } else if (Array.isArray(value)) {
    return value.map(v => buildJs(v));
  }
  return value;
}

export function buildValue(itemSchema: JSONSchema, value: Any, parent: DataSet) {
  if (isSimpleType(itemSchema)) {
    if (value !== '' && value != null) {
      if (itemSchema.type === 'number') {
        return tryParseFloat(value);
      }
      if (itemSchema.type === 'integer') {
        return tryParseInt(value);
      }
      if (itemSchema.type === 'boolean') {
        return !!value && value !== 'false';
      }
    }
    return value;
  } else if (itemSchema.type === 'array') {
    if (value == null) {
      return [];
    }
    return value.map((v: Any) => buildValue(itemSchema.items!, v, parent));
  } else {
    return buildDataModel(value, itemSchema, parent);
  }
}
