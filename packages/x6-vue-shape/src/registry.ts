import { Graph, Node } from '@antv/x6'
import { VueShape } from './node'

export interface VueShapeComponentProps {
  node: Node
  graph: Graph
}

export type VueShapeComponent = unknown

export interface VueNodeOptions {
  width?: number
  height?: number
  primer?: VueShape.Primer
  attrs?: VueShape.Attributes
  markup?: VueShape.MarkupNode[]
}

export interface VueShapeConfig extends VueNodeOptions {
  shape: string
  component: VueShapeComponent
  inherit?: string
  [key: string]: unknown
}

export const shapeMaps: Record<
  string,
  {
    component: VueShapeComponent
  }
> = {}

export function register(config: VueShapeConfig) {
  const { shape, component, inherit, ...others } = config
  if (!shape) {
    throw new Error('should specify shape in config')
  }
  shapeMaps[shape] = {
    component,
  }

  Graph.registerNode(
    shape,
    {
      inherit: inherit || 'vue-shape',
      ...(others as VueNodeOptions),
    },
    true,
  )
}
