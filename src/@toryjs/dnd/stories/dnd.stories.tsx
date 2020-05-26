import React from 'react';
import { action, observable } from 'mobx';

import { ToryFormContext } from '@toryjs/form';
import styled from '@emotion/styled';
import { observer } from 'mobx-react';

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

const BoxItem = styled.div`
  background: salmon;
`;

const BoxItem2 = styled.div`
  background: orange;
`;

const BoxItem3 = styled.div`
  background: yellow;
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

const Level: React.FC<{ items: Item[]; dnd: Dnd }> = observer(({ items, dnd }) => {
  return (
    <>
      {items.map((item, index) => (
        <Box key={index} {...dnd.props(item, items)}>
          <BoxItem>{item.title}</BoxItem>
          {item.children && (
            <Container>
              <Level items={item.children} dnd={dnd} />
            </Container>
          )}
        </Box>
      ))}
    </>
  );
});

export const Vertical = () => {
  const container = React.useRef<HTMLDivElement | null>(null);
  const dnd = React.useMemo(() => new Dnd(), []);
  React.useEffect(() => {
    dnd.init(container.current);
  }, []);

  return (
    <Drag id="0" ref={container} onDragOver={e => e.preventDefault()}>
      <Level items={items} dnd={dnd} />
    </Drag>
  );
};

type DndElement = {
  element: HTMLElement;
  height: number;
};

type DndConfig = {
  title: string;
  id: string;
  children: string;
};

class Dnd {
  lastElement?: HTMLDivElement;
  height = 0;
  splitColor = '#444';
  rootElement: HTMLDivElement = null as Any;

  dragItem?: Any;
  dragItemParent?: Any[];
  position?: 'top' | 'bottom';

  init(element: HTMLDivElement | null) {
    if (element == null) {
      throw new Error('Dnd container does not exists');
    }
    this.rootElement = element;
  }

  clear(newElement?: Any) {
    if (this.lastElement) {
      this.lastElement.style.borderWidth = '0px';
    }
    if (newElement) {
      this.lastElement = newElement;
    }
  }

  staticProps = {
    onMouseOver: (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.setAttribute('draggable', 'true');
    },
    onMouseOut(e: React.MouseEvent<HTMLDivElement>) {
      e.currentTarget.removeAttribute('draggable');
    },

    onDragEnd: (e: React.DragEvent) => {
      const item = e.target as HTMLDivElement;
      item.style.opacity = '1';
      item.style.display = 'block';
      item.style.cursor = 'inherit';
      this.rootElement.classList.remove('animated');
      this.clear();
    },

    onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      e.dataTransfer.dropEffect = 'move';

      const child = e.currentTarget;
      const rect = child.getBoundingClientRect();
      const y = Math.floor(e.clientY - rect.top); //y position within the element.
      const border = rect.height < 20 ? rect.height / 2 : 10;

      if (y < border) {
        this.clear(child);
        child.style.borderTop = `${this.height}px solid ${this.splitColor}`;
        this.position = 'top';
      } else if (y > rect.height - border) {
        this.position = 'bottom';
        if (child.nextSibling) {
          this.clear(child.nextSibling);
          (child.nextSibling as HTMLDivElement).style.borderTop = `${this.height}px solid ${this.splitColor}`;
        } else {
          this.clear(child);
          child.style.borderBottom = `${this.height}px solid ${this.splitColor}`;
        }
      }
    }
  };

  props(item: Any, owner: Any[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    return {
      onDragStart: (e: React.DragEvent) => {
        e.stopPropagation();

        e.dataTransfer.effectAllowed = 'move';

        const targetItem = e.target as HTMLDivElement;
        this.height = targetItem.offsetHeight + 2;

        window.requestAnimationFrame(() => {
          targetItem.style.display = 'none';
          window.requestAnimationFrame(() => {
            this.rootElement.classList.add('animated');
          });
        });

        this.dragItem = item;
        this.dragItemParent = owner;
      },
      onDrop: (e: React.DragEvent) => {
        e.stopPropagation();
        console.log(item.title);

        if (this.dragItemParent != null) {
          window.requestAnimationFrame(
            action(() => {
              // remove from original position
              const fromIndex = this.dragItemParent!.findIndex(e => e === this.dragItem);
              this.dragItemParent!.splice(fromIndex, 1);

              // add to the new position
              const toIndex =
                owner.findIndex(e => e === item) + (this.position === 'bottom' ? 1 : 0);
              owner.splice(toIndex, 0, this.dragItem);

              this.clear();
            })
          );
        }
      },
      ...this.staticProps
    };
  }
}
