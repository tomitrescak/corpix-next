import { JSONSchema } from '../json_schema';

type SchemaLookup = (control: string) => JSONSchema;

function findDefinition(schema: JSONSchema, item: JSONSchema) {
  const definition = schema.definitions![item.$ref!.split('/')[2]];
  if (definition == null) {
    throw new Error('Definition not found: ' + item.$ref);
  }
  return definition;
}

export function resolveSchemaReferences(schema: JSONSchema, current: JSONSchema = schema) {
  if (schema.$resolved) {
    return schema;
  }
  if (current.properties == null) {
    return;
  }

  for (let key of Object.keys(current.properties)) {
    const item = current.properties[key];
    if (item.$ref) {
      current.properties[key] = { ...item, ...findDefinition(schema, item) };
    }
    if (item.items && item.items.$ref) {
      item.items = { ...item.items, ...findDefinition(schema, item.items) };
    }
    if (item.properties) {
      resolveSchemaReferences(schema, item);
    }
    if (item.items && item.items.properties) {
      resolveSchemaReferences(schema, item.items);
    }
  }

  return schema;
}
