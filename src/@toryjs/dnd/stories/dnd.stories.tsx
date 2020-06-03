import React from 'react';
import { observable } from 'mobx';

import styled from '@emotion/styled';
import { observer } from 'mobx-react';
import { Dnd } from '../index';

export default {
  title: 'Vanilla/Dnd'
};

type Props = { height?: number };

const Drag = styled.div`
  width: 160px;

  &.animated {
    div {
      transition: box-shadow 0.3s linear;
      transition: opacity 1s linear;
      transition: border-width 0.2s linear;
      border-top: 0px solid #efefef;
      border-bottom: 0px solid #efefef;
    }
  }
`;

const Box = styled.div<Props>``;

const HBox = styled.div<Props>`
  display: flex;
  align-items: center;
`;

const Handler = styled.div`
  background: blue;
  width: 10px;
  height: 20px;
`;

const BoxItem = styled.div`
  background: salmon;
  flex: 1;
`;

const Container = styled.div`
  padding-left: 15px;
`;

type Item = { title: string; children?: Item[] };

const items = observable([
  { title: 'A' },
  {
    title: 'B',
    children: [
      { title: 'C' },
      { title: 'D' },
      {
        title: 'E',
        children: [{ title: 'F' }, { title: 'G' }]
      },
      { title: 'H' }
    ]
  },
  { title: 'I' },
  { title: 'J' },
  { title: 'K' },
  { title: 'L' },
  { title: 'M' },
  { title: 'N' },
  { title: 'O' }
]);

const items2 = observable([{ title: 'I2' }, { title: 'J2' }, { title: 'K2' }]);

const items3 = observable([{ title: 'L3' }, { title: 'M3' }, { title: 'N3' }]);

const Level: React.FC<{ items: Item[]; dnd: Dnd }> = observer(({ items, dnd }) => {
  return (
    <>
      {items.map(item => (
        <div key={item.title} {...dnd.props(item, items)}>
          <BoxItem>{item.title}</BoxItem>
          {item.children && (
            <Container>
              <Level items={item.children} dnd={dnd} />
            </Container>
          )}
        </div>
      ))}
    </>
  );
});

const WithHandler: React.FC<{ items: Item[]; dnd: Dnd }> = observer(({ items, dnd }) => {
  return (
    <>
      {items.map((item, index) => (
        <HBox key={index} {...dnd.props(item, items, true)}>
          <Handler {...dnd.handlerProps} />
          <BoxItem>{item.title}</BoxItem>
        </HBox>
      ))}
    </>
  );
});

export const Vertical = () => {
  const dnd = React.useMemo(() => new Dnd(), []);

  return (
    <Drag id="0" onDragOver={e => e.preventDefault()} data-dnd="container">
      <Level items={items} dnd={dnd} />
    </Drag>
  );
};

export const Handlers = () => {
  const dnd = React.useMemo(() => new Dnd(), []);

  return (
    <Drag id="0" onDragOver={e => e.preventDefault()} data-dnd="container">
      <WithHandler items={items} dnd={dnd} />
    </Drag>
  );
};

export const WithParenting = () => {
  const dnd = React.useMemo(
    () =>
      new Dnd({
        id: '0',
        allowParenting: true,
        add(to, item) {
          if (to.children == null) {
            to.children = [];
          }
          to.children.push(item);
        }
      }),
    []
  );

  return (
    <Drag id="0" onDragOver={e => e.preventDefault()} data-dnd="container">
      <Level items={items} dnd={dnd} />
    </Drag>
  );
};

export const MultipleLists = () => {
  const dnd1 = React.useMemo(
    () =>
      new Dnd({
        id: '1',
        accepts: [{ id: '2' }]
      }),
    []
  );
  const dnd2 = React.useMemo(
    () =>
      new Dnd({
        id: '2',
        accepts: [{ id: '3' }, { id: 'drag' }],
        allowHorizontalMove: true
      }),
    []
  );
  const dnd3 = React.useMemo(
    () =>
      new Dnd({
        id: '3',
        accepts: [
          { id: '2', parse: e => ({ title: e.title + '-Parsed' }) },
          { id: 'drag', parse: e => ({ title: e.title + '-Parsed' }) }
        ],
        allowHorizontalMove: true
      }),
    []
  );

  return (
    <div style={{ display: 'flex' }}>
      <Drag id="0" style={{ flex: 1, padding: '6px' }} data-dnd="container">
        [1] Accepts 2, 3
        <Level items={items} dnd={dnd1} />
      </Drag>
      <Drag id="1" style={{ flex: 1, padding: '6px' }} data-dnd="container">
        [2] Accepts 3, Drop
        <Level items={items2} dnd={dnd2} />
      </Drag>
      <Drag id="2" style={{ flex: 1, padding: '6px' }} data-dnd="container">
        [3] Accepts Drop
        <Level items={items3} dnd={dnd3} />
      </Drag>
      <div style={{ flex: 1, padding: '6px' }}>
        <div
          style={{ width: '50px', height: '50px', margin: '16px', background: 'blue' }}
          draggable={true}
          onDragStart={ev => {
            Dnd.height = 50;
            Dnd.dragItem = { title: 'Blue' };
            Dnd.dragId = 'drag';
          }}
          onDragEnd={e => {
            dnd1.clear();
            dnd2.clear();
            dnd3.clear();
          }}
        >
          OK
        </div>
        <div
          style={{ width: '50px', height: '50px', margin: '16px', background: 'red' }}
          draggable={true}
          onDragStart={ev => {
            Dnd.height = 50;
            Dnd.dragItem = { title: 'Red' };
            Dnd.dragId = 'drag';
          }}
        >
          NOK
        </div>
      </div>
    </div>
  );
};
