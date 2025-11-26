import { ObjectExt, Graph, Node, Markup } from '@antv/x6'

export type Primer =
  | 'rect'
  | 'circle'
  | 'path'
  | 'ellipse'
  | 'polygon'
  | 'polyline'

export interface Properties {
  primer?: Primer
  markup?: any
  attrs?: any
}

function getMarkup(primer?: Primer) {
  const content = Markup.getForeignObjectMarkup()

  if (primer) {
    return [
      {
        tagName: primer,
        selector: 'body',
      },
      content,
    ]
  }

  return [content]
}

Graph.registerNode(
  'react-shape',
  {
    view: 'react-shape-view',
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
      },
    },
    propHooks(metadata: Properties) {
      if ((metadata as any).markup == null) {
        const primer = metadata.primer
        if (primer) {
          ;(metadata as any).markup = getMarkup(primer)

          let attrs: any = {}
          switch (primer) {
            case 'circle':
              attrs = {
                refCx: '50%',
                refCy: '50%',
                refR: '50%',
              }
              break
            case 'ellipse':
              attrs = {
                refCx: '50%',
                refCy: '50%',
                refRx: '50%',
                refRy: '50%',
              }
              break
            default:
              break
          }
          ;(metadata as any).attrs = ObjectExt.merge(
            {},
            {
              body: {
                refWidth: null,
                refHeight: null,
                ...attrs,
              },
            },
            (metadata as any).attrs || {},
          )
        }
      }
      return metadata
    },
  },
  true,
)

export type ReactShape = Node
