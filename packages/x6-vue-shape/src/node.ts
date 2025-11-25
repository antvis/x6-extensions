import { ObjectExt, Node, Dom } from '@antv/x6'

export class VueShape extends Node {}

export namespace VueShape {
  export type Primer =
    | 'rect'
    | 'circle'
    | 'path'
    | 'ellipse'
    | 'polygon'
    | 'polyline'

  export type StyleMap = Record<string, string | number>

  export interface MarkupNode {
    tagName: string
    selector?: string
    ns?: string
    attrs?: Record<string, string | number | null>
    style?: StyleMap
    children?: MarkupNode[]
  }

  export type Attributes = Record<
    string,
    Record<string, string | number | null>
  >

  export interface Properties {
    primer?: Primer
    markup?: MarkupNode[]
    attrs?: Attributes
  }
}

export namespace VueShape {
  function getMarkup(primer?: Primer): MarkupNode[] {
    const content: MarkupNode = {
      tagName: 'foreignObject',
      selector: 'fo',
      children: [
        {
          tagName: 'body',
          selector: 'foBody',
          ns: Dom.ns.xhtml,
          attrs: {
            xmlns: Dom.ns.xhtml,
          },
          style: {
            width: '100%',
            height: '100%',
            background: 'transparent',
          },
          children: [
            {
              tagName: 'div',
              selector: 'foContent',
              style: {
                width: '100%',
                height: '100%',
              },
            },
          ],
        },
      ],
    }
    const markup: MarkupNode[] = []

    if (primer) {
      markup.push(
        ...[
          {
            tagName: primer,
            selector: 'body',
          },
          content,
        ],
      )
    } else {
      markup.push(content)
    }

    return markup
  }

  VueShape.config({
    view: 'vue-shape-view',
    markup: getMarkup(),
    attrs: {
      body: {
        fill: 'none',
        stroke: 'none',
        refWidth: '100%',
        refHeight: '100%',
      },
      fo: {
        refWidth: '100%',
        refHeight: '100%',
        width: '100%',
        height: '100%',
      },
    },
    propHooks(metadata: Properties) {
      if (metadata.markup == null) {
        const primer = metadata.primer
        if (primer) {
          metadata.markup = getMarkup(primer)

          let shapeAttrs: Record<string, string> = {}
          switch (primer) {
            case 'circle':
              shapeAttrs = {
                refCx: '50%',
                refCy: '50%',
                refR: '50%',
              }
              break
            case 'ellipse':
              shapeAttrs = {
                refCx: '50%',
                refCy: '50%',
                refRx: '50%',
                refRy: '50%',
              }
              break
            default:
              break
          }
          metadata.attrs = ObjectExt.merge(
            {},
            {
              body: {
                refWidth: null,
                refHeight: null,
                ...shapeAttrs,
              },
            },
            metadata.attrs || {},
          ) as Attributes
        }
      }
      return metadata
    },
  })

  Node.registry.register('vue-shape', VueShape, true)
}
