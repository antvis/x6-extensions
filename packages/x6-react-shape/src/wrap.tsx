import React from 'react'
import { Graph, Node } from '@antv/x6'
import { shapeMaps } from './registry'

export class Wrap extends React.PureComponent<WrapProps, WrapState> {
  constructor(props: WrapProps) {
    super(props)
    this.state = { tick: 0 }
  }

  componentDidMount() {
    const { node } = this.props
    node.on('change:*', ({ key }) => {
      // eslint-disable-next-line react/no-access-state-in-setstate
      const content = shapeMaps[node.shape]
      if (content) {
        const { effect } = content
        const k = String(key)
        if (!effect || effect.includes(k)) {
          this.setState({ tick: this.state.tick + 1 })
        }
      }
    })
  }

  clone(elem: React.ReactElement) {
    const { node, graph } = this.props
    return typeof elem.type === 'string'
      ? React.cloneElement(elem)
      : React.cloneElement(elem, { node, graph })
  }

  render() {
    const { node } = this.props
    const content = shapeMaps[node.shape]

    if (!content) {
      return null
    }

    const { component } = content
    if (React.isValidElement(component)) {
      return this.clone(component)
    }

    const FC = component as any
    return this.clone(<FC />)
  }
}

export interface WrapState {
  tick: number
}

export interface WrapProps {
  node: Node
  graph: Graph
}
