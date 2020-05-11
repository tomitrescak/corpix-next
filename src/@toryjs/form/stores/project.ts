import { FormElement } from '../form_definition';
import { JSONSchema } from '../json_schema';
import { ProjectModel } from './project_model';

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

export function buildProject<T = Any>(
  formDefinition: FormElement,
  schemaDefinition: JSONSchema,
  data: T = {} as Any
) {
  resolveSchemaReferences(schemaDefinition, schemaDefinition);
  schemaDefinition.$resolved = true;

  const model = {};
  // buildDataModel(data, schemaDefinition);

  return new ProjectModel(formDefinition, schemaDefinition, data);
}
