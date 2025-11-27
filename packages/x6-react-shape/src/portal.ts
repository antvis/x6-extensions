import React, { useReducer, useLayoutEffect } from 'react'

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
  const index = state.findIndex((item) => item.id === payload.id)
  switch (action.type) {
    case 'add': {
      if (index >= 0) {
        return [...state.slice(0, index), payload, ...state.slice(index + 1)]
      }
      return [...state, payload]
    }
    case 'remove': {
      if (index >= 0) {
        return [...state.slice(0, index), ...state.slice(index + 1)]
      }
      return state
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
    const [items, mutate] = useReducer(reducer, [])
    useLayoutEffect(() => {
      active = true
      dispatch = mutate
      return () => {
        active = false
        dispatch = (() => {}) as React.Dispatch<Action>
      }
    }, [mutate])
    return React.createElement(
      React.Fragment,
      null,
      items.map((item) => item.portal),
    )
  }
  return PortalProvider
}
