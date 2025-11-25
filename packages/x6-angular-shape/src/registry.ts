import { Injector, TemplateRef, Type } from '@angular/core'
import { Graph } from '@antv/x6'
import { AngularShape } from './node'

export type Content = TemplateRef<unknown> | Type<unknown>

export interface AngularNodeOptions {
  width?: number
  height?: number
  primer?: AngularShape.Primer
  attrs?: AngularShape.Attributes
  markup?: AngularShape.MarkupNode[]
}

export interface AngularShapeConfig extends AngularNodeOptions {
  shape: string
  injector: Injector
  content: Content
  inherit?: string
  [key: string]: unknown
}

export const registerInfo: Map<
  string,
  {
    injector: Injector
    content: Content
  }
> = new Map()

export function register(config: AngularShapeConfig) {
  const { shape, injector, content, inherit, ...others } = config
  registerInfo.set(shape, { injector, content })

  Graph.registerNode(
    shape,
    {
      inherit: inherit || 'angular-shape',
      ...(others as AngularNodeOptions),
    },
    true,
  )
}
