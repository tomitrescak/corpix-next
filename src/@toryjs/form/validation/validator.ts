import * as Utils from './validation_utils';
import { JSONSchema } from '../json_schema';
import FormatValidators from './validation_formats';
import { DataSet } from '../stores/dataset_model';

const messages: { [index: string]: string } = {
  VALUE_REQUIRED: 'Value is required',
  INVALID_TYPE: 'Expected type {0} but found type {1}',
  INVALID_FORMAT: "Object didn't pass validation for format {0}: {1}",
  ENUM_MISMATCH: 'No enum match for: {0}',
  ENUM_CASE_MISMATCH: 'Enum does not match case for: {0}',
  ANY_OF_MISSING: "Data does not match any schemas from 'anyOf'",
  ONE_OF_MISSING: "Data does not match any schemas from 'oneOf'",
  ONE_OF_MULTIPLE: "Data is valid against more than one schema from 'oneOf'",
  NOT_PASSED: "Data matches schema from 'not'",

  // Array errors
  ARRAY_LENGTH_SHORT: 'Array is too short ({0}), minimum {1}',
  ARRAY_LENGTH_LONG: 'Array is too long ({0}), maximum {1}',
  ARRAY_UNIQUE: 'Array items are not unique (indexes {0} and {1})',
  ARRAY_ADDITIONAL_ITEMS: 'Additional items not allowed',

  // Numeric errors
  MULTIPLE_OF: 'Value {0} is not a multiple of {1}',
  MINIMUM: 'Value {0} is less than minimum {1}',
  MINIMUM_EXCLUSIVE: 'Value {0} is equal or less than exclusive minimum {1}',
  MAXIMUM: 'Value {0} is greater than maximum {1}',
  MAXIMUM_EXCLUSIVE: 'Value {0} is equal or greater than exclusive maximum {1}',

  // Object errors
  OBJECT_PROPERTIES_MINIMUM: 'Too few properties defined ({0}), minimum {1}',
  OBJECT_PROPERTIES_MAXIMUM: 'Too many properties defined ({0}), maximum {1}',
  OBJECT_MISSING_REQUIRED_PROPERTY: 'Missing required property: {0}',
  OBJECT_ADDITIONAL_PROPERTIES: 'Additional properties not allowed: {0}',
  OBJECT_DEPENDENCY_KEY: 'Dependency failed - key must exist: {0} (due to key: {1})',

  // String errors
  MIN_LENGTH: 'String is too short ({0} chars), minimum {1}',
  MAX_LENGTH: 'String is too long ({0} chars), maximum {1}',
  PATTERN: 'String does not match pattern {0}: {1}',

  // Schema validation errors
  KEYWORD_TYPE_EXPECTED: "Keyword '{0}' is expected to be of type '{1}'",
  KEYWORD_UNDEFINED_STRICT: "Keyword '{0}' must be defined in strict mode",
  KEYWORD_UNEXPECTED: "Keyword '{0}' is not expected to appear in the schema",
  KEYWORD_MUST_BE: "Keyword '{0}' must be {1}",
  KEYWORD_DEPENDENCY: "Keyword '{0}' requires keyword '{1}'",
  KEYWORD_PATTERN: "Keyword '{0}' is not a valid RegExp pattern: {1}",
  KEYWORD_VALUE_TYPE: "Each element of keyword '{0}' array must be a '{1}'",
  UNKNOWN_FORMAT: "There is no validation function for format '{0}'",
  CUSTOM_MODE_FORCE_PROPERTIES: '{0} must define at least one property if present',

  // Remote errors
  REF_UNRESOLVED: 'Reference has not been resolved during compilation: {0}',
  UNRESOLVABLE_REFERENCE: 'Reference could not be resolved: {0}',
  SCHEMA_NOT_REACHABLE: 'Validator was not able to read schema with uri: {0}',
  SCHEMA_TYPE_EXPECTED: "Schema is expected to be of type 'object'",
  SCHEMA_NOT_AN_OBJECT: 'Schema is not an object: {0}',
  ASYNC_TIMEOUT: '{0} asynchronous task(s) have timed out after {1} ms',
  PARENT_SCHEMA_VALIDATION_FAILED:
    'Schema failed to validate against its parent schema, see inner errors for details.',
  REMOTE_NOT_VALID: "Remote reference didn't compile successfully: {0}"
};

type ReportConsumer = {
  getValue(path: string): ReportConsumer;
  setError(path: string, error: string): void;
};

class Report {
  rootSchema?: JSONSchema;
  path: string[];
  errors: Any[];
  commonErrorMessage = '';

  addError(code: string, params: Any[] | null | undefined, some: Any, schema: JSONSchema) {
    // console.log(code);
    // console.log(this.path);
    // console.log(params);

    let path = [...this.path];

    if (code === 'OBJECT_MISSING_REQUIRED_PROPERTY') {
      path.push(params![0]);
      code = 'VALUE_REQUIRED';
    }

    let message = schema.errorMessage || messages[code];

    if (params) {
      for (let i = 0; i < params.length; i++) {
        message = message.replace(`{${i}}`, params[i]);
      }
    }

    // if (this.report) {
    //   console.log('====== PARENT ======');
    //   console.log(this.report.errors);
    //   console.log(this.report.path);
    //   console.log(this.path)
    // }

    // console.log(message);
    // console.log('----');

    // build path

    let report = this.report;
    while (report) {
      path = [...report.path, ...path];
      report = report.report;
    }

    // console.log(path);

    // assign errors to the owner
    if (this.owner) {
      let item = this.owner;
      for (let i = 0; i < path.length - 1; i++) {
        if (path[i] === 'items') {
          item = item;
        } else if (path[i].match(/^\d+$/)) {
          item = item ? item[parseInt(path[i])] : item[parseInt(path[i])];
        } else {
          item = item.getValue(path[i]);
        }
      }
      // console.log(path);
      // console.log('Setting: ' + message);
      item.setError(path[path.length - 1], message);
    }

    this.errors.push(message + ` \u00B7 ${path.join('.')}`);
  }

  constructor(public owner?: ReportConsumer, private report?: Report) {
    this.path = [];
    this.errors = [];
  }
}

let JsonValidators = {
  multipleOf(report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.1.1.2
    if (typeof json !== 'number') {
      return;
    }
    if (Utils.whatIs(json / schema.multipleOf!) !== 'integer') {
      report.addError('MULTIPLE_OF', [json, schema.multipleOf], null, schema);
    }
  },
  maximum(report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.1.2.2
    if (typeof json !== 'number') {
      return;
    }

    if (json > schema.maximum!) {
      report.addError('MAXIMUM', [json, schema.maximum], null, schema);
    }
  },
  exclusiveMaximum(report: Report, schema: JSONSchema, json: Any) {
    if (typeof json !== 'number') {
      return;
    }
    if (json >= schema.exclusiveMaximum!) {
      report.addError('MAXIMUM_EXCLUSIVE', [json, schema.maximum], null, schema);
    }
  },
  minimum(report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.1.3.2
    if (typeof json !== 'number') {
      return;
    }

    if (json < schema.minimum!) {
      report.addError('MINIMUM', [json, schema.minimum], null, schema);
    }
  },
  exclusiveMinimum(report: Report, schema: JSONSchema, json: Any) {
    if (typeof json !== 'number') {
      return;
    }
    if (json <= schema.minimum!) {
      report.addError('MINIMUM_EXCLUSIVE', [json, schema.minimum], null, schema);
    }
  },
  maxLength(report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.2.1.2
    if (typeof json !== 'string') {
      return;
    }
    if (Utils.ucs2decode(json).length > schema.maxLength!) {
      report.addError('MAX_LENGTH', [json.length, schema.maxLength], null, schema);
    }
  },
  minLength(report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.2.2.2
    if (typeof json !== 'string') {
      return;
    }
    if (Utils.ucs2decode(json).length < schema.minLength!) {
      report.addError('MIN_LENGTH', [json.length, schema.minLength], null, schema);
    }
  },
  pattern(report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.2.3.2
    if (typeof json !== 'string') {
      return;
    }
    if (RegExp(schema.pattern!).test(json) === false) {
      report.addError('PATTERN', [schema.pattern, json], null, schema);
    }
  },
  additionalItems(report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.3.1.2
    if (!Array.isArray(json)) {
      return;
    }
    // if the value of "additionalItems" is boolean value false and the value of "items" is an array,
    // the json is valid if its size is less than, or equal to, the size of "items".
    if (schema.additionalItems === false && Array.isArray(schema.items)) {
      if (json.length > schema.items.length) {
        report.addError('ARRAY_ADDITIONAL_ITEMS', null, null, schema);
      }
    }
  },
  items() {
    /*report: Report, schema: JSONSchema, json: Any*/
    // covered in additionalItems
  },
  maxItems(report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.3.2.2
    if (!Array.isArray(json)) {
      return;
    }
    if (json.length > schema.maxItems!) {
      report.addError('ARRAY_LENGTH_LONG', [json.length, schema.maxItems], null, schema);
    }
  },
  minItems(report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.3.3.2
    if (!Array.isArray(json)) {
      return;
    }
    if (json.length < schema.minItems!) {
      report.addError('ARRAY_LENGTH_SHORT', [json.length, schema.minItems], null, schema);
    }
  },
  uniqueItems(report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.3.4.2
    if (!Array.isArray(json)) {
      return;
    }
    if (schema.uniqueItems === true) {
      let matches: Any[] = [];
      if (Utils.isUniqueArray(json, matches) === false) {
        report.addError('ARRAY_UNIQUE', matches, null, schema);
      }
    }
  },
  maxProperties(report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.1.2
    if (Utils.whatIs(json) !== 'object') {
      return;
    }
    let keysCount = Object.keys(json).length;
    if (keysCount > schema.maxProperties!) {
      report.addError('OBJECT_PROPERTIES_MAXIMUM', [keysCount, schema.maxProperties], null, schema);
    }
  },
  minProperties(report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.2.2
    if (Utils.whatIs(json) !== 'object') {
      return;
    }
    let keysCount = Object.keys(json).length;
    if (keysCount < schema.minProperties!) {
      report.addError('OBJECT_PROPERTIES_MINIMUM', [keysCount, schema.minProperties], null, schema);
    }
  },
  required(report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.3.2
    if (Utils.whatIs(json) !== 'object') {
      return;
    }
    let idx = schema.required!.length;
    while (idx--) {
      let requiredPropertyName = schema.required![idx];
      if (json[requiredPropertyName] == null || json[requiredPropertyName] === '') {
        report.addError('OBJECT_MISSING_REQUIRED_PROPERTY', [requiredPropertyName], null, schema);
      }
    }
  },
  additionalProperties(this: Validator, report: Report, schema: JSONSchema, json: Any) {
    // covered in properties and patternProperties
    if (schema.properties === undefined && schema.patternProperties === undefined) {
      return JsonValidators.properties.call(this, report, schema, json);
    }
  },
  patternProperties(this: Validator, report: Report, schema: JSONSchema, json: Any) {
    // covered in properties
    if (schema.properties === undefined) {
      return JsonValidators.properties.call(this, report, schema, json);
    }
  },
  properties(this: Validator, report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.4.2
    if (Utils.whatIs(json) !== 'object') {
      return;
    }
    let properties = schema.properties !== undefined ? schema.properties : {};
    let patternProperties = schema.patternProperties !== undefined ? schema.patternProperties : {};
    if (schema.additionalProperties === false) {
      // The property set of the json to validate.
      let s = Object.keys(json);
      // The property set from "properties".
      let p = Object.keys(properties);
      // The property set from "patternProperties".
      let pp = Object.keys(patternProperties);
      // remove from "s" all elements of "p", if any;
      s = Utils.difference(s, p);
      // for each regex in "pp", remove all elements of "s" which this regex matches.
      let idx = pp.length;
      while (idx--) {
        let regExp = RegExp(pp[idx]),
          idx2 = s.length;
        while (idx2--) {
          if (regExp.test(s[idx2]) === true) {
            s.splice(idx2, 1);
          }
        }
      }
      // Validation of the json succeeds if, after these two steps, set "s" is empty.
      if (s.length > 0) {
        // assumeAdditional can be an array of allowed properties
        let idx3 = (this.options.assumeAdditional || []).length;
        if (idx3) {
          while (idx3--) {
            let io = s.indexOf((this.options.assumeAdditional as [])[idx3]);
            if (io !== -1) {
              s.splice(io, 1);
            }
          }
        }
        if (s.length > 0) {
          report.addError('OBJECT_ADDITIONAL_PROPERTIES', [s], null, schema);
        }
      }
    }
  },
  dependencies(report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.4.5.2
    if (Utils.whatIs(json) !== 'object') {
      return;
    }

    let keys = Object.keys(schema.dependencies!),
      idx = keys.length;

    while (idx--) {
      // iterate all dependencies
      let dependencyName = keys[idx];
      if (json[dependencyName]) {
        let dependencyDefinition = schema.dependencies![dependencyName];
        if (Utils.whatIs(dependencyDefinition) === 'object') {
          // if dependency is a schema, validate against this schema
          exports.validate.call(this, report, dependencyDefinition, json);
        } else {
          // Array
          // if dependency is an array, object needs to have all properties in this array
          let dd = dependencyDefinition as string[];
          let idx2 = dd.length;
          while (idx2--) {
            let requiredPropertyName = dd[idx2];
            if (json[requiredPropertyName] === undefined) {
              report.addError(
                'OBJECT_DEPENDENCY_KEY',
                [requiredPropertyName, dependencyName],
                null,
                schema
              );
            }
          }
        }
      }
    }
  },
  enum(this: Validator, report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.1.2
    let match = false,
      caseInsensitiveMatch = false,
      idx = schema.enum!.length;
    while (idx--) {
      if (Utils.areEqual(json, schema.enum![idx])) {
        match = true;
        break;
      } else if ((Utils.areEqual(json, schema.enum![idx]), { caseInsensitiveComparison: true })) {
        caseInsensitiveMatch = true;
      }
    }

    if (match === false) {
      let error =
        caseInsensitiveMatch && this.options.enumCaseInsensitiveComparison
          ? 'ENUM_CASE_MISMATCH'
          : 'ENUM_MISMATCH';
      report.addError(error, [json], null, schema);
    }
  },
  type(report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.2.2
    let jsonType = Utils.whatIs(json);
    if (typeof schema.type === 'string') {
      if (jsonType !== schema.type && (jsonType !== 'integer' || schema.type !== 'number')) {
        report.addError('INVALID_TYPE', [schema.type, jsonType], null, schema);
      }
    } else {
      if (
        schema.type!.indexOf(jsonType) === -1 &&
        (jsonType !== 'integer' || schema.type!.indexOf('number') === -1)
      ) {
        report.addError('INVALID_TYPE', [schema.type, jsonType], null, schema);
      }
    }
  },
  allOf(this: Validator, report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.3.2
    let idx = schema.allOf!.length;
    while (idx--) {
      let validateResult = exports.validate.call(this, report, schema.allOf![idx], json);
      if (this.options.breakOnFirstError && validateResult === false) {
        break;
      }
    }
  },
  anyOf(this: Validator, report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.4.2
    let subReports = [],
      passed = false,
      idx = schema.anyOf!.length;

    while (idx-- && passed === false) {
      let subReport = new Report(undefined, report);
      subReports.push(subReport);

      passed = this.isValid(subReport, schema.anyOf![idx], json);
    }

    if (passed === false) {
      report.addError('ANY_OF_MISSING', undefined, subReports, schema);
    }
  },
  oneOf(this: Validator, report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.5.2
    let passes = 0,
      subReports = [],
      idx = schema.oneOf!.length;

    while (idx--) {
      let subReport = new Report(undefined, report);
      subReports.push(subReport);
      if (this.isValid(subReport, schema.oneOf![idx], json) === true) {
        passes++;
      }
    }

    if (passes === 0) {
      report.addError('ONE_OF_MISSING', undefined, subReports, schema);
    } else if (passes > 1) {
      report.addError('ONE_OF_MULTIPLE', null, null, schema);
    }
  },
  not(report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.6.2
    let subReport = new Report(report.owner, report);
    if (exports.validate.call(this, subReport, schema.not, json) === true) {
      report.addError('NOT_PASSED', null, null, schema);
    }
  },
  definitions() {
    /*report: Report, schema: JSONSchema, json: Any*/
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.5.5.7.2
    // nothing to do here
  },
  format(this: Validator, report: Report, schema: JSONSchema, json: Any) {
    // http://json-schema.org/latest/json-schema-validation.html#rfc.section.7.2
    let formatValidatorFn = FormatValidators[schema.format!];
    if (typeof formatValidatorFn === 'function') {
      if (formatValidatorFn.length === 2) {
        // async
        // report.addAsyncTask(formatValidatorFn, [json], function(result) {
        //   if (result !== true) {
        //     report.addError('INVALID_FORMAT', [schema.format, json], null, schema);
        //   }
        // });
      } else {
        // sync
        if (formatValidatorFn.call(this, json) !== true) {
          report.addError('INVALID_FORMAT', [schema.format, json], null, schema);
        }
      }
    } else if (this.options.ignoreUnknownFormats !== true) {
      report.addError('UNKNOWN_FORMAT', [schema.format], null, schema);
    }
  }
};

function recurseObject(this: Validator, report: Report, schema: JSONSchema, json: Any) {
  // http://json-schema.org/latest/json-schema-validation.html#rfc.section.8.3

  // this guy pretty much browses through all schema properties and finds
  // which exists in the data, it adds them to the queue and executes them

  // If "additionalProperties" is absent, it is considered present with an empty schema as a value.
  // In addition, boolean value true is considered equivalent to an empty schema.
  let additionalProperties = schema.additionalProperties;
  if (additionalProperties === true || additionalProperties === undefined) {
    additionalProperties = {};
  }

  // p - The property set from "properties".
  let p = schema.properties ? Object.keys(schema.properties) : [];

  // pp - The property set from "patternProperties". Elements of this set will be called regexes for convenience.
  let pp = schema.patternProperties ? Object.keys(schema.patternProperties) : [];

  // m - The property name of the child.
  let keys = Object.keys(json);
  let idx = keys.length;

  while (idx--) {
    let m = keys[idx];
    let propertyValue = json[m];

    if (propertyValue == null) {
      continue;
    }

    // s - The set of schemas for the child instance.
    let s = [];

    // 1. If set "p" contains value "m", then the corresponding schema in "properties" is added to "s".
    if (p.indexOf(m) !== -1) {
      s.push(schema.properties![m]);
    }

    // 2. For each regex in "pp", if it matches "m" successfully, the corresponding schema in "patternProperties" is added to "s".
    let idx2 = pp.length;
    while (idx2--) {
      let regexString = pp[idx2];
      if (RegExp(regexString).test(m) === true) {
        s.push(schema.patternProperties![regexString]);
      }
    }

    // 3. The schema defined by "additionalProperties" is added to "s" if and only if, at this stage, "s" is empty.
    if (s.length === 0 && additionalProperties !== false) {
      s.push(additionalProperties);
    }

    // we are passing tests even without this assert because this is covered by properties check
    // if s is empty in this stage, no additionalProperties are allowed
    // report.expect(s.length !== 0, 'E001', m);

    // Instance property value must pass all schemas from s
    idx2 = s.length;
    while (idx2--) {
      report.path.push(m);
      this.isValid(report, s[idx2], propertyValue);
      report.path.pop();
    }
  }
}

function recurseArray(this: Validator, report: Report, schema: JSONSchema, json: Any) {
  // http://json-schema.org/latest/json-schema-validation.html#rfc.section.8.2

  let idx = json.length;

  // If "items" is an array, this situation, the schema depends on the index:
  // if the index is less than, or equal to, the size of "items",
  // the child instance must be valid against the corresponding schema in the "items" array;
  // otherwise, it must be valid against the schema defined by "additionalItems".
  if (Array.isArray(schema.items)) {
    while (idx--) {
      // equal to doesnt make sense here
      if (idx < schema.items.length) {
        report.path.push(idx.toString());
        this.isValid(report, schema.items[idx], json[idx]);
        report.path.pop();
      } else {
        // might be boolean, so check that it's an object
        if (typeof schema.additionalItems === 'object') {
          report.path.push(idx.toString());
          this.isValid(report, schema.additionalItems, json[idx]);
          report.path.pop();
        }
      }
    }
  } else if (typeof schema.items === 'object') {
    // If items is a schema, then the child instance must be valid against this schema,
    // regardless of its index, and regardless of the value of "additionalItems".
    while (idx--) {
      report.path.push(idx.toString());
      this.isValid(report, schema.items, json[idx]);
      report.path.pop();
    }
  }
}

export class Validator {
  constructor(public options: Any) {}

  validateDataSet(owner: DataSet<Any>): boolean {
    const report = new Report(owner);

    // clear all errors
    owner.clearErrors();

    const schema = (owner.schema as Any).toJS
      ? (owner.schema as Any).toJS({ keepResolutions: true })
      : owner.schema;
    const dataset = owner.toJS();

    const isValid = this.isValid(report, schema, dataset);

    if (report.errors.length) {
      owner.setError('allErrors', report.errors);
    }

    return isValid;
  }

  validateData(owner: ReportConsumer, schema: JSONSchema, data: Any): boolean {
    const report = new Report(owner);

    // clear all errors
    // owner.clearErrors();

    return this.isValid(report, schema, data);
  }

  // validate(schema: JSONSchema, data: Any) {
  //   const report = new Report(null);
  //   return this.isValid(report, schema, data);
  // }

  isValid(report: Report, schema: JSONSchema, json: Any) {
    report.commonErrorMessage = 'JSON_OBJECT_VALIDATION_FAILED';

    // check if schema is an object
    let to = Utils.whatIs(schema);
    if (to !== 'object') {
      report.addError('SCHEMA_NOT_AN_OBJECT', [to], null, schema);
      return false;
    }

    // check if schema is empty, everything is valid against empty schema
    let keys = Object.keys(schema);
    if (keys.length === 0) {
      return true;
    }

    // this method can be called recursively, so we need to remember our root
    let isRoot = false;
    if (!report.rootSchema) {
      report.rootSchema = schema;
      isRoot = true;
    }

    // follow schema.$ref keys
    // if (schema.$ref !== undefined) {
    //   // avoid infinite loop with maxRefs
    //   let maxRefs = 99;
    //   while (schema.$ref && maxRefs > 0) {
    //     if (!(schema as Any).__$refResolved) {
    //       // throw new Error('Schemas must be resolved!');
    //       //report.addError('REF_UNRESOLVED', [schema.$ref], null, schema);
    //       //break;
    //     } else if ((schema as Any).__$refResolved === schema) {
    //       break;
    //     } else {
    //       schema = (schema as Any).__$refResolved;
    //       keys = Object.keys(schema);
    //     }
    //     maxRefs--;
    //   }
    //   if (maxRefs === 0) {
    //     throw new Error('Circular dependency by $ref references!');
    //   }
    // }

    // type checking first
    let jsonType = Utils.whatIs(json);
    if (schema.type) {
      keys.splice(keys.indexOf('type'), 1);
      JsonValidators.type.call(this, report, schema, json);
      if (report.errors.length && this.options.breakOnFirstError) {
        return false;
      }
    }

    // now iterate all the keys in schema and execute validation methods
    let idx = keys.length;
    while (idx--) {
      if ((JsonValidators as Any)[keys[idx]]) {
        (JsonValidators as Any)[keys[idx]].call(this, report, schema, json);
        if (report.errors.length && this.options.breakOnFirstError) {
          break;
        }
      }
    }

    if (report.errors.length === 0 || this.options.breakOnFirstError === false) {
      if (jsonType === 'array') {
        recurseArray.call(this, report, schema, json);
      } else if (jsonType === 'object') {
        recurseObject.call(this, report, schema, json);
      }
    }

    if (typeof this.options.customValidator === 'function') {
      this.options.customValidator(report, schema, json);
    }

    // we don't need the root pointer anymore
    if (isRoot) {
      report.rootSchema = undefined;
    }

    // return valid just to be able to break at some code points
    return report.errors.length === 0;
  }
}
