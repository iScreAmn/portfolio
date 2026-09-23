"use client";

import { useCallback, useEffect, useRef, useState } from 'react';


const EDGE_ZONE = 88;

const MAX_SCROLL_STEP = 8;

const moveItem = (list, from, to) => {
  const next = list.slice();
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
};

const edgeSpeed = (clientY) => {
  const viewport = window.innerHeight;

  if (clientY < EDGE_ZONE) {
    const ratio = Math.min(1, (EDGE_ZONE - clientY) / EDGE_ZONE);
    return -Math.max(1, Math.round(ratio * ratio * MAX_SCROLL_STEP));
  }

  if (clientY > viewport - EDGE_ZONE) {
    const ratio = Math.min(1, (clientY - (viewport - EDGE_ZONE)) / EDGE_ZONE);
    return Math.max(1, Math.round(ratio * ratio * MAX_SCROLL_STEP));
  }

  return 0;
};

/**
 * @param {{ ids: string[], onReorder: (ids: string[]) => void }} params
 *   `ids` — порядок строк в том виде, в каком они отрисованы.
 * @returns ручка для элемента строки (`registerRow`), пропсы для кнопки-грипа
 *   (`getHandleProps`) и id строки, которую тянут прямо сейчас.
 */
const useDragSort = ({ ids, onReorder }) => {
  const [draggingId, setDraggingId] = useState(null);

  const rowsRef = useRef(new Map());
  const callbacksRef = useRef(new Map());
  const idsRef = useRef(ids);
  const reorderRef = useRef(onReorder);
  const sessionRef = useRef(null);

  useEffect(() => {
    idsRef.current = ids;
    reorderRef.current = onReorder;
  });

  const registerRow = useCallback((id) => {
    let callback = callbacksRef.current.get(id);
    if (!callback) {
      callback = (element) => {
        if (element) {
          rowsRef.current.set(id, element);
          return;
        }
        rowsRef.current.delete(id);
        callbacksRef.current.delete(id);
      };
      callbacksRef.current.set(id, callback);
    }
    return callback;
  }, []);

  const paint = useCallback(() => {
    const session = sessionRef.current;
    if (!session) return;

    const { items, from, height } = session;
    const pointer = session.clientY + window.scrollY;
    const delta = pointer - session.startY;

    let to = from;
    if (delta > 0) {
      for (let index = from + 1; index < items.length; index += 1) {
        if (pointer <= items[index].top + items[index].height / 2) break;
        to = index;
      }
    } else if (delta < 0) {
      for (let index = from - 1; index >= 0; index -= 1) {
        if (pointer >= items[index].top + items[index].height / 2) break;
        to = index;
      }
    }

    if (delta !== session.delta) {
      session.delta = delta;
      items[from].el.style.transform = `translate3d(0, ${delta}px, 0)`;
    }

    if (to !== session.to) {
      session.to = to;
      items.forEach((item, index) => {
        if (index === from) return;
        let shift = 0;
        if (index > from && index <= to) shift = -height;
        else if (index < from && index >= to) shift = height;
        item.el.style.transform = shift ? `translate3d(0, ${shift}px, 0)` : '';
      });
    }
  }, []);

  const finish = useCallback((commit) => {
    const session = sessionRef.current;
    if (!session) return;

    sessionRef.current = null;
    cancelAnimationFrame(session.frame);
    session.items.forEach((item) => {
      item.el.style.transform = '';
    });

    try {
      session.handle.releasePointerCapture(session.pointerId);
    } catch {
    }

    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    setDraggingId(null);

    if (commit && session.to !== session.from) {
      reorderRef.current(moveItem(session.order, session.from, session.to));
    }
  }, []);

  const startDrag = useCallback(
    (id, event) => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (sessionRef.current) return;

      const scrollY = window.scrollY;
      const items = [];
      idsRef.current.forEach((rowId) => {
        const element = rowsRef.current.get(rowId);
        if (!element) return;
        const rect = element.getBoundingClientRect();
        items.push({ id: rowId, el: element, top: rect.top + scrollY, height: rect.height });
      });

      const from = items.findIndex((item) => item.id === id);
      if (from < 0 || items.length < 2) return;

      event.preventDefault();

      const handle = event.currentTarget;
      try {
        handle.setPointerCapture(event.pointerId);
      } catch {
      }

      sessionRef.current = {
        pointerId: event.pointerId,
        handle,
        items,
        order: items.map((item) => item.id),
        from,
        to: from,
        delta: 0,
        height: items[from].height,
        startY: event.clientY + scrollY,
        clientY: event.clientY,
        frame: 0,
      };

      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
      setDraggingId(id);

      const frame = () => {
        const session = sessionRef.current;
        if (!session) return;

        const speed = edgeSpeed(session.clientY);
        if (speed) window.scrollBy(0, speed);

        paint();
        session.frame = requestAnimationFrame(frame);
      };

      sessionRef.current.frame = requestAnimationFrame(frame);
    },
    [paint],
  );

  const moveByKey = useCallback((id, event) => {
    if (sessionRef.current) return;

    let step = 0;
    if (event.key === 'ArrowUp') step = -1;
    else if (event.key === 'ArrowDown') step = 1;
    if (!step) return;

    const order = idsRef.current;
    const from = order.indexOf(id);
    const to = from + step;
    if (from < 0 || to < 0 || to >= order.length) return;

    event.preventDefault();
    reorderRef.current(moveItem(order, from, to));
  }, []);

  const getHandleProps = useCallback(
    (id) => ({
      onPointerDown: (event) => startDrag(id, event),
      onPointerMove: (event) => {
        const session = sessionRef.current;
        if (!session || session.pointerId !== event.pointerId) return;
        session.clientY = event.clientY;
        paint();
      },
      onPointerUp: (event) => {
        if (sessionRef.current?.pointerId === event.pointerId) finish(true);
      },
      onPointerCancel: () => finish(false),
      onLostPointerCapture: () => finish(false),
      onKeyDown: (event) => moveByKey(id, event),
    }),
    [startDrag, paint, finish, moveByKey],
  );

  useEffect(() => {
    if (!draggingId) return undefined;

    const cancel = (event) => {
      if (event.key === 'Escape') finish(false);
    };

    window.addEventListener('keydown', cancel);
    return () => window.removeEventListener('keydown', cancel);
  }, [draggingId, finish]);

  useEffect(
    () => () => {
      const session = sessionRef.current;
      if (!session) return;
      cancelAnimationFrame(session.frame);
      sessionRef.current = null;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    },
    [],
  );

  return { draggingId, registerRow, getHandleProps };
};

export default useDragSort;
