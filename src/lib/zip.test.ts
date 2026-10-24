import { expect, test } from 'bun:test'
import { uniqueNames } from './zip'

test('keeps distinct names untouched', () => {
  expect(uniqueNames(['a.png', 'b.png'])).toEqual(['a.png', 'b.png'])
})

test('numbers repeated names before the extension', () => {
  expect(uniqueNames(['IMG_1.png', 'IMG_1.png', 'IMG_1.png'])).toEqual([
    'IMG_1.png',
    'IMG_1 (2).png',
    'IMG_1 (3).png',
  ])
})

test('treats names as case-insensitive, like the filesystems that unzip them', () => {
  expect(uniqueNames(['A.png', 'a.png'])).toEqual(['A.png', 'a (2).png'])
})

test('handles names without extension', () => {
  expect(uniqueNames(['photo', 'photo'])).toEqual(['photo', 'photo (2)'])
})
