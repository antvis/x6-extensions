import React, { ReactPortal } from 'react'
import { createPortal } from 'react-dom'
import { createRoot, Root } from 'react-dom/client'
import { Dom, NodeView, Node } from '@antv/x6'
import {
  isActive as portalIsActive,
  connect as portalConnect,
  disconnect as portalDisconnect,
} from './portal'
import { Wrap } from './wrap'

export class ReactShapeView extends NodeView<Node> {
  static action = 'react' as any
  root?: Root

  protected targetId() {
    return `${this.graph.view.cid}:${this.cell.id}`
  }

  getComponentContainer() {
    return this.selectors && (this.selectors.foContent as HTMLDivElement)
  }

  confirmUpdate(flag: number) {
    const ret = super.confirmUpdate(flag)
    return this.handleAction(ret, ReactShapeView.action, () => {
      this.renderReactComponent()
    })
  }

  protected renderReactComponent() {
    this.unmountReactComponent()
    const container = this.getComponentContainer()
    const node = this.cell

    if (container) {
      const elem = React.createElement(Wrap, { node, graph: this.graph })
      if (portalIsActive()) {
        const portal = createPortal(elem, container, node.id) as ReactPortal
        portalConnect(this.targetId(), portal)
      } else {
        this.root = createRoot(container)
        this.root.render(elem)
      }
    }
  }

  protected unmountReactComponent() {
    const container = this.getComponentContainer()
    if (container && this.root) {
      this.root.unmount()
      this.root = undefined
    }
  }

  onMouseDown(e: Dom.MouseDownEvent, x: number, y: number) {
    const target = e.target as Element
    const tagName = target.tagName.toLowerCase()
    if (tagName === 'input') {
      const type = target.getAttribute('type')
      if (
        type == null ||
        [
          'text',
          'password',
          'number',
          'email',
          'search',
          'tel',
          'url',
        ].includes(type)
      ) {
        return
      }
    }

    super.onMouseDown(e, x, y)
  }

  unmount() {
    if (portalIsActive()) {
      portalDisconnect(this.targetId())
    }
    this.unmountReactComponent()
    super.unmount()
    return this
  }
}

ReactShapeView.config({
  bootstrap: [ReactShapeView.action],
  actions: {
    component: ReactShapeView.action,
  },
})

NodeView.registry.register('react-shape-view', ReactShapeView, true)
