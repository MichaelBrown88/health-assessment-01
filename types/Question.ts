export type AnswerType = {
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface Question {
  id: string
  question: string
  type: 'radio' | 'checkbox' | 'slider'
  options?: { value: string, label: string }[]
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  condition?: (answers: AnswerType) => boolean
}
