import { mapCategory, formatPostTime } from '../../../packages/app/utils/profileHelpers'

// This test verifies that the feed helper functions correctly transform API data into the format needed for display in the feed cards. 
// It checks that the category mapping and date formatting work as expected, ensuring that the feed displays accurate and user-friendly information.
describe('mapCategory', () => {
  it('maps Academic to School', () => {
    expect(mapCategory('Academic')).toBe('School')
  })

  it('maps Work to Work', () => {
    expect(mapCategory('Work')).toBe('Work')
  })

  it('maps Personal to Wellness', () => {
    expect(mapCategory('Personal')).toBe('Wellness')
  })

  it('defaults unknown values to School', () => {
    expect(mapCategory('Random Stuff')).toBe('School')
  })
})


describe('formatPostTime', () => {
  it('returns a string for a valid date', () => {
    const result = formatPostTime('2026-04-09T14:15:00.000Z')
    expect(typeof result).toBe('string')
  })

  it('returns empty string for invalid date', () => {
    expect(formatPostTime('not-a-real-date')).toBe('')
  })
})