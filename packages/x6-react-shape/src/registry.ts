import React from 'react'
import { Graph, Node } from '@antv/x6'
import { ReactShape } from './node'

export interface ReactShapeComponentProps {
  node: Node
  graph: Graph
}

export type ReactShapeComponent =
  | React.ComponentType<ReactShapeComponentProps>
  | React.ReactElement

export type EffectKeys = ReadonlyArray<string>

export interface ReactNodeOptions {
  width?: number
  height?: number
  primer?: ReactShape.Primer
  attrs?: ReactShape.Attributes
}

export interface ReactShapeConfig extends ReactNodeOptions {
  shape: string
  component: ReactShapeComponent
  effect?: EffectKeys
  inherit?: string
  [key: string]: unknown
}

export const shapeMaps: Record<
  string,
  {
    component: ReactShapeComponent
    effect?: EffectKeys
  }
> = {}

export function register(config: ReactShapeConfig) {
  const { shape, component, effect, inherit, ...others } = config
  if (!shape) {
    throw new Error('should specify shape in config')
  }
  shapeMaps[shape] = {
    component,
    effect,
  }

  Graph.registerNode(
    shape,
    {
      inherit: inherit || 'react-shape',
      ...(others as ReactNodeOptions),
    },
    true,
  )
}
