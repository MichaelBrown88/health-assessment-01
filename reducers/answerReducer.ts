export type AnswerType = {
  [key: string]: string | number | string[];
}

type AnswerAction = 
  | { type: 'SET_ANSWER', payload: { id: string, value: string | number | string[] } }
  | { type: 'RESET_ANSWERS' }

export const answerReducer = (state: AnswerType, action: AnswerAction): AnswerType => {
  switch (action.type) {
    case 'SET_ANSWER':
      return { ...state, [action.payload.id]: action.payload.value }
    case 'RESET_ANSWERS':
      return {}
    default:
      return state
  }
}
