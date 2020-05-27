import React, { MouseEventHandler } from 'react';
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

const Level: React.FC<{ items: Item[]; dnd: Dnd }> = observer(({ items, dnd }) => {
  return (
    <>
      {items.map((item, index) => (
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

export const Handlers = () => {
  const container = React.useRef<HTMLDivElement | null>(null);
  const dnd = React.useMemo(() => new Dnd(), []);
  React.useEffect(() => {
    dnd.init(container.current);
  }, [dnd]);

  return (
    <Drag id="0" ref={container} onDragOver={e => e.preventDefault()}>
      <WithHandler items={items} dnd={dnd} />
    </Drag>
  );
};

export const WithParenting = () => {
  const container = React.useRef<HTMLDivElement | null>(null);
  const dnd = React.useMemo(
    () =>
      new Dnd({
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

type Options = {
  allowParenting?: boolean;
  add?(to: Any, item: Any): void;
};

class Dnd {
  lastElement?: HTMLDivElement;
  height = 0;
  splitColor = '#444';
  outlineStyle = '2px dotted #ccc';
  rootElement: HTMLDivElement = null as Any;

  position?: 'top' | 'bottom' | 'middle';
  dragging?: boolean = false;
  avatar?: HTMLDivElement;

  dragElement?: HTMLDivElement;
  dragItem?: Any;
  dragItemParent?: Any[];

  overItem?: Any;
  overItemParent?: Any;

  handlerPressed = false;
  overItemElement?: HTMLDivElement;

  options: Options;

  // preventions
  lastClick = Date.now();
  startPosition = 0;
  mouseMoved = false;

  handlerProps = {
    onMouseOver: (e: React.MouseEvent<HTMLDivElement>) => {
      if (this.dragging == false) {
        e.currentTarget.style.cursor = 'grab';
      }
    },
    onMouseOut: (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.cursor = '';
    },
    onMouseDown: () => {
      this.handlerPressed = true;
    }
  };

  // CONSTRUCTOR

  constructor(options: Options = {}) {
    this.options = options;
  }

  props(item: Any, owner: Any[], handler = false) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    return {
      // onDragOver(e) {
      //   e.preventDefault();
      // },
      // onDrop(e) {
      //   console.log('dropped');
      // },
      onMouseOver: (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();

        if (this.dragging == false) {
          return;
        }

        this.overItem = item;
        this.overItemParent = owner;
        this.overItemElement = e.currentTarget;

        // more efficient for simple lists
        if (!this.options.allowParenting) {
          this.calculateBorders(e as Any, e.currentTarget);
        }
      },
      onMouseOut: () => {
        this.overItem = undefined;
        this.overItemParent = undefined;
        this.overItemElement = undefined;
      },
      onMouseDown: (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        event.preventDefault();

        // PREVENT DOUBLE CLICKS

        if (Date.now() - this.lastClick < 300) {
          this.lastClick = Date.now();
          return;
        }
        this.lastClick = Date.now();
        this.startPosition = event.clientY;
        this.mouseMoved = false;

        // WE MAY LIMIT TO HANDLERS WHICH HANDLE THEIR OWN MOUSE EVENTS

        if (handler && !this.handlerPressed) {
          return;
        }

        // CREATE CLONE

        const avatar = event.currentTarget.cloneNode(true) as HTMLDivElement;
        avatar.style.width = event.currentTarget.offsetWidth + 'px';
        avatar.style.height = event.currentTarget.offsetHeight + 'px';

        let originalX = event.currentTarget.getBoundingClientRect().left;
        // let shiftX = event.clientX - originalX;
        let shiftY = event.clientY - event.currentTarget.getBoundingClientRect().top;

        avatar.style.position = 'absolute';
        avatar.style.zIndex = '1000';
        avatar.style.left = originalX + 'px';
        avatar.style.pointerEvents = 'none';
        document.body.style.cursor = 'grabbing';

        this.avatar = avatar;
        document.body.append(avatar);

        // MOUSE EVENTS FOR AVATAR

        const moveAt = (pageX: number, pageY: number) => {
          // ball.style.left = pageX - shiftX + 'px';
          this.avatar!.style.top = pageY - shiftY + 'px';
        };

        const onMouseMove = (event: MouseEvent) => {
          moveAt(event.pageX, event.pageY);

          if (Math.abs(event.clientY - this.startPosition) > 2) {
            this.mouseMoved = true;
          }

          if (this.overItemElement == null) {
            this.clear();
            return;
          }

          if (this.options.allowParenting) {
            this.calculateBorders(event, this.overItemElement);
          }
        };

        const onMouseUp = (e: MouseEvent) => {
          e.stopPropagation();

          // CLEAR

          this.rootElement.classList.remove('animated');
          this.dragging = false;
          this.handlerPressed = false;

          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
          document.body.style.cursor = '';

          // IF WE DID NOT MOVE THE MOUSE WE STOP

          if (this.mouseMoved == false) {
            this.cleanup();
          }
          this.mouseMoved = false;

          // WE REPLACE THE ELEMENT, OR WE CANCEL OPERATION

          if (this.overItemElement != null) {
            // FINAL ANIMATION

            avatar.style.transition = '0.2s ease-in-out';
            const bounds = this.overItemElement!.getBoundingClientRect();

            let top = 0;
            if (this.position === 'bottom') {
              top = bounds.top + this.height;
            } else {
              top = bounds.top;
            }

            this.avatar!.style.top = top + 'px';
            this.avatar!.style.left = bounds.left + 'px';

            // WHEN ANIMATION FNISHES DROP

            const { dragItemParent, dragItem, overItemParent, position, overItem } = this;

            setTimeout(() => {
              if (dragItemParent != null) {
                if (overItem == null) {
                  return;
                }

                // REPLACE IN ORIGINAL ARRAY

                action(() => {
                  // remove from original position
                  const fromIndex = dragItemParent!.findIndex(e => e === dragItem);
                  dragItemParent!.splice(fromIndex, 1);

                  if (this.position === 'middle') {
                    if (this.options.add == null) {
                      throw new Error(
                        'If you allow parenting, you have to define the add function'
                      );
                    }
                    // add to item
                    this.options.add(overItem, dragItem);
                  } else {
                    // add to the new position
                    const toIndex =
                      overItemParent.findIndex((e: Any) => e === overItem) +
                      (position === 'bottom' ? 1 : 0);
                    overItemParent.splice(toIndex, 0, dragItem);
                  }

                  this.cleanup();
                })();
              }
            }, 250);
          } else {
            this.cleanup();
          }
        };

        moveAt(event.pageX, event.pageY);

        // move the ball on mousemove
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        avatar.ondragstart = function () {
          return false;
        };

        this.dragElement = event.currentTarget as HTMLDivElement;
        this.height = this.dragElement.offsetHeight;
        this.dragging = true;
        this.dragItem = item;
        this.dragItemParent = owner;

        this.dragElement!.style.display = 'none';

        // add initial border
        if (this.dragElement?.nextSibling) {
          this.lastElement = this.dragElement.nextSibling as HTMLDivElement;
          this.lastElement.style.borderTop = `${this.height}px solid ${this.splitColor}`;
        } else if (this.dragElement?.previousSibling) {
          this.lastElement = this.dragElement.previousSibling as HTMLDivElement;
          this.lastElement.style.borderBottom = `${this.height}px solid ${this.splitColor}`;
        }

        window.requestAnimationFrame(() => {
          this.rootElement.classList.add('animated');
        });
      }
    };
  }

  // PRIVATE METHODS

  private calculateBorders(event: MouseEvent, child: HTMLDivElement) {
    const rect = child.getBoundingClientRect();
    const y = Math.floor(event.clientY - rect.top); //y position within the element.
    const height = child.clientHeight;
    const border = height < 10 ? height / 2 : 5;

    if (y < border) {
      if (!this.options.allowParenting || this.position !== 'top') {
        this.clear(child);
        child.style.borderTop = `${this.height}px solid ${this.splitColor}`;
        this.position = 'top';
      }
    } else if (y > height - border) {
      if (!this.options.allowParenting || this.position !== 'bottom') {
        this.position = 'bottom';
        if (child.nextSibling) {
          this.clear(child.nextSibling);
          (child.nextSibling as HTMLDivElement).style.borderTop = `${this.height}px solid ${this.splitColor}`;
        } else {
          this.clear(child);
          child.style.borderBottom = `${this.height}px solid ${this.splitColor}`;
        }
      }
    } else if (this.options.allowParenting) {
      if (this.position != 'middle') {
        this.clear(child);
        child.style.outline = this.outlineStyle;
        this.position = 'middle';
      }
    }
  }

  init(element: HTMLDivElement | null) {
    if (element == null) {
      throw new Error('Dnd container does not exists');
    }
    this.rootElement = element;
  }

  private clear(newElement?: Any) {
    if (this.lastElement) {
      this.lastElement.style.borderWidth = '0px';
      this.lastElement.style.outline = '0px';
    }
    if (newElement) {
      this.lastElement = newElement;
    }
  }

  private cleanup() {
    if (document.body.childNodes[document.body.childNodes.length - 1] === this.avatar) {
      document.body.removeChild(this.avatar!);
    }
    this.dragElement!.style.display = '';
    this.clear();
  }
}
