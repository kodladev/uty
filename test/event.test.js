import { describe, expect, it } from 'vitest';
import { emit, event, off, on, once } from '../src/event.js';

describe('event', () => {
  it('event:on:emit', () => {
    const bus = event();
    const calls = [];
    bus.on('tick', (a, b) => calls.push([a, b]));
    bus.emit('tick', 1, 2);
    bus.emit('tock', 3);
    expect(calls).toEqual([[1, 2]]);
  });

  it('event:unsubscribe', () => {
    const bus = event();
    const calls = [];
    const first = bus.on('tick', n => calls.push(`first:${n}`));
    bus.on('tick', n => calls.push(`second:${n}`));
    first();
    bus.emit('tick', 1);
    expect(calls).toEqual(['second:1']);
  });

  it('event:once', () => {
    const bus = event();
    let count = 0;
    bus.once('tick', () => count++);
    bus.emit('tick');
    bus.emit('tick');
    expect(count).toBe(1);
  });

  it('event:off', () => {
    const bus = event();
    let count = 0;
    bus.on('tick', () => count++);
    bus.off('tick');
    bus.emit('tick');
    expect(count).toBe(0);
  });

  it('event:off:then:on', () => {
    const bus = event();
    const calls = [];
    const stale = bus.on('tick', () => calls.push('stale'));
    bus.off('tick');
    stale();
    bus.on('tick', () => calls.push('fresh'));
    bus.emit('tick');
    expect(calls).toEqual(['fresh']);
  });

  it('event:on:during:emit', () => {
    const bus = event();
    const calls = [];
    bus.on('tick', () => {
      calls.push('outer');
      bus.on('tick', () => calls.push('inner'));
    });
    bus.emit('tick');
    expect(calls).toEqual(['outer']);
  });

  it('event:unsubscribe:during:emit', () => {
    const bus = event();
    const calls = [];
    const first = bus.on('tick', () => {
      calls.push('first');
      first();
    });
    bus.on('tick', () => calls.push('second'));
    bus.emit('tick');
    bus.emit('tick');
    expect(calls).toEqual(['first', 'second', 'second']);
  });

  it('event:built:in:names', () => {
    const bus = event();
    let count = 0;
    expect(() => bus.emit('toString')).not.toThrow();
    bus.on('constructor', () => count++);
    bus.emit('constructor');
    expect(count).toBe(1);
  });

  it('event:global', () => {
    const calls = [];
    const stop = on('uty:test', n => calls.push(n));
    once('uty:test', n => calls.push(`once:${n}`));
    emit('uty:test', 1);
    emit('uty:test', 2);
    stop();
    emit('uty:test', 3);
    off('uty:test');
    expect(calls).toEqual([1, 'once:1', 2]);
  });
});
