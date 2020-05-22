import { JSONSchema } from '../../json_schema';
import { buildSchema } from '../schema_model';
import { autorun } from 'mobx';

describe('Schema model', () => {
  const schema: JSONSchema = {
    type: 'object',
    uid: '1',
    properties: {
      name: { type: 'string', title: 'name', uid: 'name1' },
      children: {
        uid: 'children1',
        type: 'array',
        title: 'children',
        items: {
          type: 'object',
          uid: 'items1',
          properties: {
            age: { type: 'number', title: 'age', uid: 'age1' }
          },
          allOf: [
            { properties: { foot: { type: 'string', title: 'foot', uid: 'foot1' } }, uid: 'c1' },
            { properties: { hand: { type: 'string', title: 'hand', uid: 'hand1' } }, uid: 'c2' }
          ],
          anyOf: [
            { properties: { eye: { type: 'string', title: 'eye', uid: 'eye1' } }, uid: 'c3' },
            { properties: { ear: { type: 'string', title: 'ear', uid: 'ear1' } }, uid: 'c4' }
          ],
          oneOf: [
            { properties: { belly: { type: 'string', title: 'belly', uid: 'belly1' } }, uid: 'c5' },
            { properties: { back: { type: 'string', title: 'back', uid: 'back1' } }, uid: 'c6' }
          ]
        }
      }
    }
  };

  it('creates a json', () => {
    const schemaModel = buildSchema(schema);
    // console.log(schemaModel.rootSchema);

    schemaModel.properties!.name?.setValue('maxLength', 20);
    expect(schemaModel.properties!.name.maxLength).toBe(20);

    schemaModel.properties!.children.items!.anyOf![0].properties!.eye?.setValue('minLength', 10);
    schemaModel.addProperty({ type: 'string', title: 'newProperty', uid: 'new' });

    expect(schemaModel.toJS()).toEqual({
      type: 'object',
      uid: '1',
      properties: {
        newProperty: { type: 'string', title: 'newProperty', uid: 'new' },
        name: { type: 'string', title: 'name', uid: 'name1', maxLength: 20 },
        children: {
          uid: 'children1',
          type: 'array',
          title: 'children',
          items: {
            type: 'object',
            uid: 'items1',
            properties: {
              age: { type: 'number', title: 'age', uid: 'age1' }
            },
            allOf: [
              { properties: { foot: { type: 'string', title: 'foot', uid: 'foot1' } }, uid: 'c1' },
              { properties: { hand: { type: 'string', title: 'hand', uid: 'hand1' } }, uid: 'c2' }
            ],
            anyOf: [
              {
                properties: { eye: { type: 'string', title: 'eye', uid: 'eye1', minLength: 10 } },
                uid: 'c3'
              },
              { properties: { ear: { type: 'string', title: 'ear', uid: 'ear1' } }, uid: 'c4' }
            ],
            oneOf: [
              {
                properties: { belly: { type: 'string', title: 'belly', uid: 'belly1' } },
                uid: 'c5'
              },
              { properties: { back: { type: 'string', title: 'back', uid: 'back1' } }, uid: 'c6' }
            ]
          }
        }
      }
    });
  });

  // it('definitions path for prop is not counted all the way to the top', () => {
  //   // ARRANGE
  //   const schema: JSONSchema = {
  //     type: 'object',
  //     properties: {
  //       students: {
  //         type: 'array',
  //         items: {
  //           $ref: '#/definitions/person'
  //         }
  //       }
  //     },
  //     definitions: {
  //       person: {
  //         title: 'person',
  //         type: 'object',
  //         properties: {
  //           name: { type: 'string' }
  //         }
  //       }
  //     }
  //   };

  //   const form: FormElement = {
  //     control: 'Table',
  //     props: {
  //       value: { source: 'students' }
  //     }
  //   };
  // });

  it('creates na new instance of a schema with initialised references', () => {
    const schemaModel = buildSchema(schema);
    expect(schemaModel.properties!.name.getValue('title')).toBe('name');
    expect(schemaModel.properties!.children!.items!.allOf).toHaveLength(2);
    expect(schemaModel.properties!.children!.getValue('type')).toBe('array');
  });

  it('allows to reactively add new properties and undo them', () => {
    const schemaModel = buildSchema({ properties: {} });
    const spy = mock.fn();
    autorun(() => {
      Object.keys(schemaModel.properties!);
      spy();
    });
    schemaModel.addProperty({ title: 'First' });
    expect(spy).toHaveBeenCalledTimes(2);

    expect(schemaModel.properties!.First).toBeDefined();
    schemaModel.undoManager.undo();
    expect(schemaModel.properties!.First).not.toBeDefined();
    // expect(spy).toHaveBeenCalledTimes(3);
  });

  it('resolves schema references', () => {
    const schema: JSONSchema = {
      type: 'object',
      uid: '1',
      properties: {
        name: {
          uid: 'name',
          title: 'name',
          $ref: '#/definitions/personal'
        },
        person: {
          uid: 'person',
          type: 'array',
          title: 'person',
          items: {
            uid: 'items',
            $ref: '#/definitions/personal'
          }
        }
      },
      definitions: {
        personal: {
          uid: 'personal',
          type: 'object',
          title: 'personal',
          minLength: 10,
          properties: {
            age: { type: 'number', title: 'age', uid: 'age' }
          }
        }
      }
    };

    const schemaModel = buildSchema(schema);

    expect(schemaModel.properties!.name!.title).toBe('name');
    expect(schemaModel.properties!.name!.getValue('minLength')).toBe(10);

    // adding a property adds to the parent element
    schemaModel.properties!.name.addProperty({ title: 'hair', type: 'string', uid: '4' });

    expect(schemaModel.properties!.name.getValue('type')).toBe('object');
    expect(schemaModel.properties!.name.properties!.age.getValue('type')).toBe('number');
    expect(schemaModel.properties!.person.items!.getValue('type')).toBe('object');

    expect(schemaModel.toJS()).toEqual({
      definitions: {
        personal: {
          minLength: 10,
          properties: {
            age: { title: 'age', type: 'number', uid: 'age' },
            hair: { title: 'hair', type: 'string', uid: '4' }
          },
          title: 'personal',
          type: 'object',
          uid: 'personal'
        }
      },
      properties: {
        name: { $ref: '#/definitions/personal', title: 'name', uid: 'name' },
        person: {
          items: { $ref: '#/definitions/personal', uid: 'items' },
          title: 'person',
          type: 'array',
          uid: 'person'
        }
      },
      type: 'object',
      uid: '1'
    });

    // TEST if renaming the definition also renames the reference
    schemaModel.definitions!.personal.setValue('title', 'NEW_NAME');
    expect(schemaModel.toJS().properties.name.$ref).toBe('#/definitions/NEW_NAME');
  });

  it('can change a parent', () => {
    const schema: JSONSchema = {
      type: 'object',
      uid: '0',
      properties: {
        // uid: '0',
        personal: {
          uid: '1',
          title: 'personal',
          type: 'object',
          properties: { name: { type: 'string', title: 'name', uid: '6' } }
        },
        foreign: { uid: '2', title: 'foreign', type: 'object', properties: {} },
        array: { uid: '3', title: 'array', type: 'array', items: { uid: '8' } }
      }
    };

    const schemaModel = buildSchema(schema);
    expect(Object.keys(schemaModel.properties!)).toEqual(['personal', 'foreign', 'array']);

    // ACT: Move to root
    schemaModel.properties!.personal.properties!.name.changeParent(schemaModel);

    expect(Object.keys(schemaModel.properties!)).toEqual(['personal', 'foreign', 'array', 'name']);
    expect(schemaModel.toJS()).toEqual({
      properties: {
        array: { items: { uid: '8' }, title: 'array', type: 'array', uid: '3' },
        foreign: { title: 'foreign', type: 'object', uid: '2' },
        name: { title: 'name', type: 'string', uid: '6' },
        personal: { title: 'personal', type: 'object', uid: '1' }
      },
      type: 'object',
      uid: '0'
    });

    // ACT: Move to property

    schemaModel.properties!.name.changeParent(schemaModel.properties!.foreign);

    expect(schemaModel.toJS()).toStrictEqual({
      properties: {
        array: { items: { uid: '8' }, title: 'array', type: 'array', uid: '3' },
        foreign: {
          title: 'foreign',
          type: 'object',
          uid: '2',
          properties: { name: { title: 'name', type: 'string', uid: '6' } }
        },
        personal: { title: 'personal', type: 'object', uid: '1' }
      },
      type: 'object',
      uid: '0'
    });

    // ACT: Move to array
    schemaModel.properties!.foreign.properties!.name.changeParent(schemaModel.properties!.array);

    expect(schemaModel.toJS()).toEqual({
      properties: {
        array: {
          items: { uid: '8', properties: { name: { title: 'name', type: 'string', uid: '6' } } },
          title: 'array',
          type: 'array',
          uid: '3'
        },
        foreign: { title: 'foreign', type: 'object', uid: '2' },
        personal: { title: 'personal', type: 'object', uid: '1' }
      },
      type: 'object',
      uid: '0'
    });

    // UNDO
    schemaModel.undoManager.undo();
    expect(schemaModel.toJS()).toStrictEqual({
      properties: {
        array: { items: { uid: '8' }, title: 'array', type: 'array', uid: '3' },
        foreign: {
          title: 'foreign',
          type: 'object',
          uid: '2',
          properties: { name: { title: 'name', type: 'string', uid: '6' } }
        },
        personal: { title: 'personal', type: 'object', uid: '1' }
      },
      type: 'object',
      uid: '0'
    });
  });

  it('allows to add or remove required values', () => {
    const schema: JSONSchema = { type: 'object' };
    const schemaModel = buildSchema(schema);

    // expect(schemaModel.required).toEqual([]);
    schemaModel.addRequired('name');
    expect(schemaModel.required).toEqual(['name']);
    schemaModel.addRequired('sure');
    expect(schemaModel.required).toEqual(['name', 'sure']);
    schemaModel.removeRequired('sure');
    expect(schemaModel.required).toEqual(['name']);

    schemaModel.undoManager.undo();
    expect(schemaModel.required).toEqual(['name', 'sure']);
  });
});
