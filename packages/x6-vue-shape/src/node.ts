import { ObjectExt, Graph, Node, Markup, NodeProperties } from '@antv/x6'

export type Primer =
  | 'rect'
  | 'circle'
  | 'path'
  | 'ellipse'
  | 'polygon'
  | 'polyline'

export interface Properties extends NodeProperties {
  primer?: Primer
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
  'vue-shape',
  {
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
      },
    },
    propHooks(metadata: Properties) {
      if (metadata.markup == null) {
        const primer = metadata.primer
        if (primer) {
          metadata.markup = getMarkup(primer)

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
          metadata.attrs = ObjectExt.merge(
            {},
            {
              body: {
                refWidth: null,
                refHeight: null,
                ...attrs,
              },
            },
            metadata.attrs || {},
          )
        }
      }
      return metadata
    },
  },
  true,
)

export type VueShape = Node
