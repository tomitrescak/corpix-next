export type JSONSchema7Version =
  | 'http://json-schema.org/schema#'
  | 'http://json-schema.org/hyper-schema#'
  | 'http://json-schema.org/draft-07/schema#'
  | 'http://json-schema.org/draft-07/hyper-schema#';

export type JSONSchema7TypeName =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'object'
  | 'array'
  | 'null';
export type JSONSchema7Type = JSONSchema7Array[] | boolean | number | null | object | string;

// Workaround for infinite type recursion
// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface JSONSchema7Array extends Array<JSONSchema7Type> {}

export type JSONSchemaType = JSONSchema7Type;

export type ErrorMessages = {
  [index: string]: ErrorMessage;
};

export type ErrorMessage = string;

export class JSONSchemaBase {
  /* =========================================================
      OVERRIDEN
     ======================================================== */

  expression?: string;
  validationExpression?: string;
  validationGroup?: string;
  share?: boolean;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.1
   */
  type?: JSONSchema7TypeName;
  enum?: JSONSchema7Type[];
  const?: JSONSchema7Type;

  /* =========================================================
      ORIGINAL
     ======================================================== */

  $id?: string;
  $ref?: string;
  $resolved?: boolean;
  $schema?: JSONSchema7Version;
  $comment?: string;
  $import?: number;
  // $enum?: Option[];

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.2
   */
  multipleOf?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minimum?: number;
  exclusiveMinimum?: number;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.3
   */
  maxLength?: number;
  minLength?: number;
  pattern?: string;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.4
   */

  additionalItems?: JSONSchema;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  contains?: JSONSchema;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.5
   */
  maxProperties?: number;
  minProperties?: number;

  patternProperties?: {
    [key: string]: JSONSchema;
  };
  additionalProperties?: JSONSchema | boolean;
  dependencies?: {
    [key: string]: JSONSchema | string[];
  };
  propertyNames?: JSONSchema;
  errorMessage?: ErrorMessage;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-6.6
   */
  if?: JSONSchema;
  then?: JSONSchema;
  else?: JSONSchema;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-7
   */
  format?: string;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-8
   */
  contentMediaType?: string;
  contentEncoding?: string;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-10
   */
  title?: string;
  description?: string;
  default?: JSONSchema7Type;
  readOnly?: boolean;
  writeOnly?: boolean;
  examples?: JSONSchema7Type;
}

export class JSONSchema extends JSONSchemaBase {
  uid?: string;
  properties?: {
    [key: string]: JSONSchema;
  };
  allOf?: JSONSchema[];
  anyOf?: JSONSchema[];
  oneOf?: JSONSchema[];
  not?: JSONSchema;

  /**
   * @see https://tools.ietf.org/html/draft-handrews-json-schema-validation-01#section-9
   */
  definitions?: {
    [key: string]: JSONSchema;
  };
  items?: JSONSchema;
  required?: string[];
  // reference?: string;
}

export const schemaOfJsonSchema: JSONSchema = {
  type: 'object',
  properties: {
    uid: { type: 'string' },
    required: { type: 'array', items: { type: 'string' } },
    expression: { type: 'string' },
    validationExpression: { type: 'string' },
    validationGroup: { type: 'string' },
    share: { type: 'boolean' },
    type: { type: 'string' },
    const: { type: 'object' },
    enum: {
      type: 'array',
      items: { type: 'string' }
    },
    $id: { type: 'string' },
    $ref: { type: 'string' },
    // $schema: { type: 'string'},
    // $comment: { type: 'string' },
    $import: { type: 'string' },
    // $enum: {
    //   type: 'array',
    //   items: {
    //     type: 'object',
    //     properties: {
    //       text: { type: 'string' },
    //       value: { type: 'string' },
    //       icon: { type: 'string' }
    //     }
    //   }
    // },
    faker: { type: 'string' },
    multipleOf: { type: 'number' },
    maximum: { type: 'number' },
    exclusiveMaximum: { type: 'number' },
    minimum: { type: 'number' },
    exclusiveMinimum: { type: 'number' },
    maxLength: { type: 'integer' },
    minLength: { type: 'integer' },
    pattern: { type: 'string' },
    // additionalItems: JSONSchema;
    items: { type: 'object' },
    maxItems: { type: 'integer' },
    minItems: { type: 'integer' },
    uniqueItems: { type: 'boolean' },
    // contains: JSONSchema;
    // maxProperties: { type: 'integer' },
    // minProperties: { type: 'integer' },
    // patternProperties: { type: 'string' },
    properties: { type: 'object' },
    definitions: { type: 'object' },
    // additionalProperties: { type: 'boolean' },
    // dependencies: {
    //     [key: string]: JSONSchema | string[];
    // };
    // propertyNames: JSONSchema;
    errorMessage: { type: 'string' },
    // if: JSONSchema;
    // then: JSONSchema;
    // else: JSONSchema;

    // allOf: {
    //   type: 'array',
    //   items: { $ref: '#' }
    // },
    // anyOf: {
    //   type: 'array',
    //   items: { $ref: '#' }
    // },
    // oneOf: {
    //   type: 'array',
    //   items: { $ref: '#' }
    // },
    // not: { $ref: '#' },
    format: { type: 'string' },
    // contentMediaType: { type: 'string' },
    // contentEncoding: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    default: { type: 'string' },
    readOnly: { type: 'boolean' },
    writeOnly: { type: 'boolean' },
    // definitions: { type: 'object' },
    imports: { type: 'object' }
    //examples: JSONSchema7Type;
  }
};

export const schemaOfContainerProps: JSONSchema = {
  type: 'object',
  properties: {
    css: { type: 'string' },
    style: { type: 'object' },
    className: { type: 'string' },

    label: { type: 'string' },
    labelPosition: { type: 'string' },
    inline: { type: 'boolean' },
    documentation: { type: 'string' },
    display: { type: 'string' },

    hidden: { type: 'boolean' },
    readOnly: { type: 'boolean' },

    onMount: { type: 'string' }
  }
};

export const schemaOfFormModel: JSONSchema = {
  properties: {
    uid: { type: 'string' },
    control: { type: 'string' },
    tuple: { type: 'string' },
    group: { type: 'string' },
    bound: { type: 'boolean' },
    documentation: { type: 'string' },
    isSelected: { type: 'boolean' }
  }
};
