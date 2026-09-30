import { describe, expect, it } from 'vitest';
import { parseTheme, toggledOverride } from '../src/theme';

describe('theme toggle', () => {
  it('saves the opposite of the system theme', () => {
    expect(toggledOverride('light', 'light')).toBe('dark');
    expect(toggledOverride('dark', 'dark')).toBe('light');
  });

  it('goes back to following the system when toggled to the system theme', () => {
    expect(toggledOverride('dark', 'light')).toBeNull();
    expect(toggledOverride('light', 'dark')).toBeNull();
  });

  it('ignores anything but light/dark in storage', () => {
    expect(parseTheme('dark')).toBe('dark');
    expect(parseTheme('blue')).toBeNull();
    expect(parseTheme(undefined)).toBeNull();
  });
});
