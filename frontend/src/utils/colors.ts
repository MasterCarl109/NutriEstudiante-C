export type Difficulty = 'baja' | 'media' | 'alta'

export const BMI_COLORS: Record<string, string> = {
  underweight: '#0288d1',
  normal: '#2e7d32',
  overweight: '#ed6c02',
  obesity: '#d32f2f',
}

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  baja: '#2e7d32',
  media: '#ed6c02',
  alta: '#d32f2f',
}
