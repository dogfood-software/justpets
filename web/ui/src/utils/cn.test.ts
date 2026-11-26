import { describe, expect, test } from 'vitest'

import { cn, cnAria } from './cn'

describe('cn', () => {
  test('joins class names and drops falsy values', () => {
    expect(cn('a', false, 'c', null, undefined, 0)).toBe('a c')
  })

  test('applies conditional object keys', () => {
    expect(cn('base', { active: true, hidden: false })).toBe('base active')
  })

  test('resolves Tailwind conflicts with real twMerge', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })
})

describe('cnAria', () => {
  test('returns a function that merges static and state-based classes', () => {
    const className = cnAria<{ isLoading: boolean }>(
      'btn',
      ({ isLoading }) => isLoading && 'opacity-50',
      'bg-blue-500',
    )

    expect(className({ isLoading: false })).toBe('btn bg-blue-500')
    expect(className({ isLoading: true })).toBe('btn opacity-50 bg-blue-500')
  })
})
