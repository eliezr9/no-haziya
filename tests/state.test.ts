import { describe, expect, it, vi } from 'vitest';
import { createStore, parseSavedLocation } from '../src/state';

describe('store', () => {
  it('notifies subscribers with the new and previous state', () => {
    const store = createStore({ lang: 'he', location: null, step: 'idle', outcome: null, news: false });
    const listener = vi.fn();
    store.subscribe(listener);
    store.set({ lang: 'en' });
    expect(listener).toHaveBeenCalledWith(
      { lang: 'en', location: null, step: 'idle', outcome: null, news: false },
      { lang: 'he', location: null, step: 'idle', outcome: null, news: false },
    );
  });
});

describe('parseSavedLocation', () => {
  it('accepts a well-formed location', () => {
    const loc = { id: 1, he: 'אילת', en: 'Eilat' };
    expect(parseSavedLocation(loc)).toEqual(loc);
  });

  it('rejects anything else', () => {
    expect(parseSavedLocation(undefined)).toBeNull();
    expect(parseSavedLocation('אילת')).toBeNull();
    expect(parseSavedLocation({ id: '1', he: 'אילת', en: 'Eilat' })).toBeNull();
  });
});
