import React, { useReducer } from 'react'

let active = false
let dispatch: React.Dispatch<Action>

export interface Action {
  type: 'add' | 'remove'
  payload: Partial<Payload>
}

export interface Payload {
  id: string
  portal: React.ReactPortal
}

const reducer = (state: Payload[], action: Action) => {
  const payload = action.payload as Payload
  switch (action.type) {
    case 'add': {
      const index = state.findIndex((item) => item.id === payload.id)
      if (index >= 0) {
        return [...state.slice(0, index), payload, ...state.slice(index + 1)]
      }
      return [...state, payload]
    }
    case 'remove': {
      const index = state.findIndex((item) => item.id === payload.id)
      if (index >= 0) {
        const result = [...state]
        result.splice(index, 1)
        return result
      }
      break
    }
    default: {
      break
    }
  }
  return state
}

export function connect(id: string, portal: React.ReactPortal) {
  if (active) {
    dispatch({ type: 'add', payload: { id, portal } })
  }
}

export function disconnect(id: string) {
  if (active) {
    dispatch({ type: 'remove', payload: { id } })
  }
}

export function isActive() {
  return active
}

export function getProvider() {
  const PortalProvider: React.FC = () => {
    active = true
    const [items, mutate] = useReducer(reducer, [])
    dispatch = mutate
    return React.createElement(
      React.Fragment,
      null,
      items.map((item) => item.portal),
    )
  }
  return PortalProvider
}
