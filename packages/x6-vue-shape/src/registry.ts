import { Graph } from '@antv/x6'

export type VueShapeConfig = {
  shape: string
  component: any
  inherit?: string
} & Record<string, any>

export const shapeMaps: Record<
  string,
  {
    component: any
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
      ...others,
    },
    true,
  )
}
