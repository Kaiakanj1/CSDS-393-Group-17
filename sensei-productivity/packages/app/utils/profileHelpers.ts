export function mapCategory(categoryName: string): 'School' | 'Work' | 'Wellness' {
  const lower = categoryName?.toLowerCase?.() ?? ''

  if (lower.includes('school') || lower.includes('academic')) return 'School'
  if (lower.includes('work')) return 'Work'
  if (lower.includes('well') || lower.includes('health') || lower.includes('personal')) return 'Wellness'

  return 'School'
}

export function formatPostTime(dateValue: string | Date) {
  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleString()
}