import { autorun } from 'mobx';
import { buildDataModel } from '../../builders/dataset_builder';
import { JSONSchema } from '../../json_schema';

describe('DataModel', () => {
  // const s
  const data = {
    name: 'Tomas',
    address: {
      street: 'Smith Avenue',
      number: 73,
      resident: true,
      neighbours: {
        name: 'Tomas'
      }
    },
    cars: [{ model: 'Hyundai' }, { model: 'Tesla' }],
    children: ['Vittoria']
  };

  const schema: JSONSchema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      address: {
        type: 'object',
        properties: {
          street: { type: 'string' },
          number: { type: 'string' },
          resident: { type: 'string' },
          neighbours: {
            type: 'object',
            properties: {
              name: { type: 'string' }
            }
          }
        }
      },
      cars: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            model: { type: 'string' }
          }
        }
      },
      children: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    }
  };

  it('creates a new dataset respecting the data structure', () => {
    const model = buildDataModel(data, schema);
    expect(model.getValue('address').getValue('street')).toBe('Smith Avenue');
    expect(model.getValue('cars')).toHaveLength(2);
  });

  it('allows to select data with the .dot. notation', () => {
    const model = buildDataModel(data, schema);
    expect(model.getValue('address.street')).toBe('Smith Avenue');
  });

  it('creates observable error data description from original data', () => {
    const model = buildDataModel(data, schema);

    const fn = mock.fn();
    autorun(() => {
      if (model.getError('name')) {
        fn();
      }
    });

    model.setError('name', 'We have error!');
    expect(fn).toHaveBeenCalled();
  });

  // it('resets data', () => {
  //   const model = buildDataModel(data, schema);
  //   expect(model.getDataSet('address').getValue('street')).toBe('Smith Avenue');
  //   model.reset();
  //   // expect(model.data).toEqual({});
  //   expect(model.getArray('cars').items).toHaveLength(0);
  //   expect(model.getArray('children').items).toHaveLength(0);

  //   expect(model.toJS()).toEqual({
  //     address: {
  //       neighbours: {
  //         name: undefined
  //       },
  //       number: undefined,
  //       resident: undefined,
  //       street: undefined
  //     },
  //     cars: [],
  //     children: [],
  //     name: undefined
  //   });
  // });

  type TestType = {
    name?: string;
    address?: {
      street: string;
    };
    cars?: Array<{ model: 'string' }>;
    children?: string[];
  };

  it('creates default reactive data', () => {
    const model = buildDataModel<TestType>({}, schema);
    console.log(model.toJS());

    expect(model.getValue('address').getValue('street')).toBeUndefined();
    expect(model.getValue('cars')).toHaveLength(0);
    expect(model.getValue('children')).toHaveLength(0);

    expect(model.toJS()).toEqual({
      address: {
        neighbours: undefined,
        number: undefined,
        resident: undefined,
        street: undefined
      },
      cars: [],
      children: [],
      name: undefined
    });

    const fn = mock.fn();
    autorun(() => {
      if (model.getValue('address').getValue('street')) {
        fn();
      }
    });
    model.getValue('address').setValue('street', 'new address');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('lazily fills in missing data while maintaining reactivity', () => {
    const model = buildDataModel<TestType>({ name: 'Tomas' }, schema);
    expect(model.getValue('address.street')).toBeUndefined();
    //expect(model.getArray('cars')).toBeUndefined();
    //expect(model.getArray('children')).toBeUndefined();

    expect(model.toJS()).toEqual({
      address: {
        neighbours: undefined,
        number: undefined,
        resident: undefined,
        street: undefined
      },
      cars: [],
      children: [],
      name: 'Tomas'
    });

    const fn = mock.fn();
    autorun(() => {
      if (model.getValue('address.street')) {
        fn();
      }
    });
    model.setValue('address.street' as Any, 'new address');
    expect(model.getValue('address.street')).toBe('new address');
    expect(model.address!.street).toBe('new address');
    expect(fn).toHaveBeenCalledTimes(1);

    expect(model.toJS()).toStrictEqual({
      address: {
        neighbours: undefined,
        number: undefined,
        resident: undefined,
        street: 'new address'
      },
      cars: [],
      children: [],
      name: 'Tomas'
    });
  });

  it('allows to set and get values of the object based on key', () => {
    const model = buildDataModel(data, schema);

    // check reactivity
    const fn = mock.fn();
    autorun(() => {
      if (model.getValue('name')) {
        fn();
      }
    });

    // // check setting atomic values in the object
    // model.setValue('name', 'new address');
    // expect(model.getValue('name')).toBe('new address');
    // expect(fn).toHaveBeenCalledTimes(2);

    // // check setting complex values in the object
    // model.setValue('address', { street: 'Elm' } as Any);
    // expect(model.getDataSet('address').getValue('street')).toBe('Elm');

    // use dot notations
    (model as Any).address.street = 'Pine';
    expect((model as Any).address.street).toBe('Pine');
  });

  it('contains schema information on each level', () => {
    const model = buildDataModel(data, schema);
    expect(model.getSchema('name')).toEqual({ type: 'string' });
    expect(model.getValue('address').getSchema('neighbours')).toEqual({
      properties: {
        name: {
          type: 'string'
        }
      },
      type: 'object'
    });
  });

  it('validates data and removes errors on undo', () => {
    // mock.useFakeTimers();

    const schema: JSONSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        personal: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 5
            }
          }
        }
      }
    };
    const dataset = buildDataModel(
      {
        personal: {
          name: 'Branislav'
        }
      },
      schema
    );
    dataset.validateBounceTime = 0;

    // dataConfig.validateOnType = true;

    // validate initial model
    dataset.validate();
    expect(dataset.getValue('personal').getError('name')).toBeUndefined();

    // ARRANGE reactivity spy
    const spy = mock.fn();
    autorun(() => {
      if (dataset.getValue('personal').getError('name')) {
        spy();
      }
    });

    // ASSERT

    // undoManager.clearUndo();

    dataset.getValue('personal').setValue('name', 'Lu');
    dataset.validate();
    // mock.runAllTimers();

    expect(dataset.getValue('personal').getError('name')).toEqual(
      'String is too short (2 chars), minimum 5'
    );

    // model.setValue('name', 'tt', model.data.personal)

    //model.undoManager!.undo();

    // console.log(model.undoManager.undoQueue.map(q => JSON.stringify(q.patches)))

    dataset.undoManager.undo();
    dataset.validate();
    // model.undoManager.undo();

    // mock.runAllTimers();

    expect(dataset.getValue('personal').getValue('name')).toBe('Branislav');
    expect(dataset.getValue('personal').getError('name')).toBeUndefined();
    // expect(spy).toHaveBeenCalledTimes(2);

    // Check if reset maintains reactivity

    dataset.getDataSet('personal').setValue('name', 'Lu');
    // expect(spy).toHaveBeenCalledTimes(3);
  });

  //   it('default value is created from the schema', () => {
  //     const schema: JSONSchema = {
  //       type: 'object',
  //       properties: {
  //         name: { type: 'string' },
  //         address: {
  //           type: 'object',
  //           properties: {
  //             street: { type: 'string' },
  //             number: { type: 'number' }
  //           }
  //         }
  //       }
  //     };
  //     const model = buildDataModel<TestType>({}, schema);
  //     expect(model.getDefaultValue()).toStrictEqual({
  //       address: {
  //         street: undefined,
  //         number: undefined
  //       },
  //       name: undefined
  //     });

  //     expect(model.getDataSet('address').getDefaultValue()).toStrictEqual({
  //       street: undefined,
  //       number: undefined
  //     });
  //   });
  // });

  it('addRow adds a new row with default complex value or data', () => {
    const schema: JSONSchema = {
      type: 'object',
      properties: {
        cars: {
          type: 'array',
          items: { type: 'object', properties: { make: { type: 'string' } } }
        }
      }
    };
    type TestType = {
      cars: Array<{ make: string }>;
    };
    const model = buildDataModel<TestType>({} as Any, schema);
    expect(model.toJS()).toStrictEqual({
      cars: []
    });

    // ADD DEFAULT ROW
    model.addRow('cars', { make: 'Toyota' } as Any);
    expect(model.toJS()).toStrictEqual({
      cars: [{ make: 'Toyota' }]
    });

    model.addRow('cars', {});
    expect(model.toJS()).toStrictEqual({
      cars: [{ make: 'Toyota' }, { make: undefined }]
    });

    model.undoManager.undo();
    expect(model.toJS()).toStrictEqual({
      cars: [{ make: 'Toyota' }]
    });

    model.undoManager.undo();
    expect(model.toJS()).toStrictEqual({
      cars: []
    });

    model.undoManager.redo();
    expect(model.toJS()).toStrictEqual({
      cars: [{ make: 'Toyota' }]
    });
  });

  it('addRow adds a new row with default atomic value or data', () => {
    const schema: JSONSchema = {
      type: 'object',
      properties: {
        people: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    };
    type TestType = {
      people?: string[];
    };
    const model = buildDataModel<TestType>({}, schema);

    // ADD DEFAULT ROW
    model.addRow('people', 'Tomi');
    expect(model.toJS()).toStrictEqual({
      people: ['Tomi']
    });

    model.addRow('people', null);
    expect(model.toJS()).toStrictEqual({
      people: ['Tomi', null]
    });
  });

  it('inserts row', () => {
    const schema: JSONSchema = {
      type: 'object',
      properties: {
        cars: {
          type: 'array',
          items: { type: 'object', properties: { make: { type: 'string' } } }
        }
      }
    };
    const model = buildDataModel({ cars: [{ make: 'Hyundai' }, { make: 'Toyota' }] }, schema);

    model.insertRow('cars', 1, { make: 'Skoda' });
    expect(model.toJS()).toStrictEqual({
      cars: [{ make: 'Hyundai' }, { make: 'Skoda' }, { make: 'Toyota' }]
    });

    // UNDO

    model.undoManager.undo();
    expect(model.toJS()).toStrictEqual({
      cars: [{ make: 'Hyundai' }, { make: 'Toyota' }]
    });

    // REDO

    model.undoManager.redo();
    expect(model.toJS()).toStrictEqual({
      cars: [{ make: 'Hyundai' }, { make: 'Skoda' }, { make: 'Toyota' }]
    });
  });

  it('removesRow by index or data', () => {
    const schema: JSONSchema = {
      type: 'object',
      properties: {
        cars: {
          type: 'array',
          items: { type: 'object', properties: { make: { type: 'string' } } }
        }
      }
    };
    const model = buildDataModel(
      { cars: [{ make: 'Hyundai' }, { make: 'Toyota' }, { make: 'Skoda' }] },
      schema
    );

    model.removeRowByIndex('cars', 1);
    expect(model.toJS()).toStrictEqual({
      cars: [{ make: 'Hyundai' }, { make: 'Skoda' }]
    });

    // UNDO

    model.undoManager.undo();
    expect(model.toJS()).toStrictEqual({
      cars: [{ make: 'Hyundai' }, { make: 'Toyota' }, { make: 'Skoda' }]
    });

    // REDO

    model.undoManager.redo();
    expect(model.toJS()).toStrictEqual({
      cars: [{ make: 'Hyundai' }, { make: 'Skoda' }]
    });

    // REMOVE BY VALUE

    const hyundai = model.getValue('cars')[0];

    model.removeRow('cars', hyundai);
    expect(model.toJS()).toStrictEqual({
      cars: [{ make: 'Skoda' }]
    });

    // UNDO

    model.undoManager.undo();
    expect(model.toJS()).toStrictEqual({
      cars: [{ make: 'Hyundai' }, { make: 'Skoda' }]
    });

    // REDO

    model.undoManager.redo();
    expect(model.toJS()).toStrictEqual({
      cars: [{ make: 'Skoda' }]
    });

    expect(model.getValue('cars')[0].toJS()).toStrictEqual({ make: 'Skoda' });
  });

  it('swaps atomic data', () => {
    const schema: JSONSchema = {
      type: 'object',
      properties: {
        people: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    };
    const model = buildDataModel({ people: ['Tomas', 'Valeria', 'Vittoria'] }, schema);

    // ADD DEFAULT ROW
    model.swapRows('people', 0, 2);
    expect(model.toJS()).toStrictEqual({
      people: ['Vittoria', 'Valeria', 'Tomas']
    });

    model.undoManager!.undo();

    console.log(model.toJS());
    expect(model.toJS()).toStrictEqual({
      people: ['Tomas', 'Valeria', 'Vittoria']
    });
  });

  it('swaps object data', () => {
    const schema: JSONSchema = {
      type: 'object',
      properties: {
        cars: {
          type: 'array',
          items: { type: 'object', properties: { make: { type: 'string' } } }
        }
      }
    };
    const model = buildDataModel(
      { cars: [{ make: 'Hyundai' }, { make: 'Toyota' }, { make: 'Skoda' }] },
      schema
    );

    // ADD DEFAULT ROW
    model.swapRows('cars', 0, 2);

    expect(model.getValue('cars')[0].getValue('make')).toEqual('Skoda');
    expect(model.getValue('cars')[2].getValue('make')).toEqual('Hyundai');

    model.undoManager!.undo();

    expect(model.getValue('cars')[0].getValue('make')).toEqual('Hyundai');
    expect(model.getValue('cars')[2].getValue('make')).toEqual('Skoda');
  });

  it('strips all the data not in the scheme', () => {
    const schema: JSONSchema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        address: {
          type: 'object',
          properties: {
            street: { type: 'string' }
          }
        },
        cars: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' }
            }
          }
        },
        kids: {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      }
    };
    const dataset = buildDataModel(
      {
        name: 'Tomas',
        surename: 'Trescak',
        address: {
          street: 'Cadigal',
          city: 'Pyrmont'
        },
        cars: [{ name: 'Hyundai', year: 2001 }],
        kids: ['Valeria', 'Luca']
      },
      schema
    );

    expect(dataset.toJS()).toEqual({
      address: { street: 'Cadigal' },
      cars: [{ name: 'Hyundai' }],
      kids: ['Valeria', 'Luca'],
      name: 'Tomas'
    });
  });
});
