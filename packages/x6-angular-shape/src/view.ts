import {
  ComponentRef,
  EmbeddedViewRef,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core'
import { Dom, NodeView } from '@antv/x6'
import { AngularShape } from './node'
import { Content, registerInfo } from './registry'

export class AngularShapeView extends NodeView<AngularShape> {
  getNodeContainer(): HTMLDivElement {
    return this.selectors && (this.selectors.foContent as HTMLDivElement)
  }

  override confirmUpdate(flag: number): number {
    const ret = super.confirmUpdate(flag)
    return this.handleAction(ret, AngularShapeView.action, () =>
      this.renderAngularContent(),
    )
  }

  private getNgArguments(): Record<string, unknown> {
    const raw = (this.cell.getData?.() ?? this.cell.data) as unknown
    if (raw && typeof raw === 'object') {
      const data = raw as { ngArguments?: Record<string, unknown> }
      return data.ngArguments || {}
    }
    return {}
  }

  /** 当执行 node.setData() 时需要对实例设置新的输入值 */
  private setInstanceInput(
    content: Content,
    ref: EmbeddedViewRef<unknown> | ComponentRef<unknown>,
  ): void {
    const ngArguments = this.getNgArguments()
    if (content instanceof TemplateRef) {
      const embeddedViewRef = ref as EmbeddedViewRef<{
        ngArguments: Record<string, unknown>
      }>
      embeddedViewRef.context = { ngArguments }
    } else {
      const componentRef = ref as ComponentRef<unknown>
      Object.keys(ngArguments).forEach((v) =>
        componentRef.setInput(v, ngArguments[v]),
      )
      componentRef.changeDetectorRef.detectChanges()
    }
  }

  protected renderAngularContent(): void {
    const container = this.getNodeContainer()
    if (container) {
      this.unmountAngularContent()
      const node = this.cell
      const { injector, content } = registerInfo.get(node.shape)!
      const viewContainerRef = injector.get(ViewContainerRef)
      if (content instanceof TemplateRef) {
        const ngArguments = this.getNgArguments()
        const embeddedViewRef = viewContainerRef.createEmbeddedView(content, {
          ngArguments,
        })
        embeddedViewRef.rootNodes.forEach((node) => container.appendChild(node))
        embeddedViewRef.detectChanges()
        node.on('change:data', () =>
          this.setInstanceInput(content, embeddedViewRef),
        )
      } else {
        const componentRef = viewContainerRef.createComponent(content, {
          injector,
        })
        const insertNode = (componentRef.hostView as EmbeddedViewRef<unknown>)
          .rootNodes[0] as HTMLElement
        container.appendChild(insertNode)
        this.setInstanceInput(content, componentRef)
        node.on('change:data', () =>
          this.setInstanceInput(content, componentRef),
        )
        node.on('removed', () => componentRef.destroy())
      }
    }
  }

  protected unmountAngularContent(): HTMLDivElement {
    const container = this.getNodeContainer()
    container.innerHTML = ''
    return container
  }

  override onMouseDown(e: Dom.MouseDownEvent, x: number, y: number) {
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

  override unmount(): this {
    this.unmountAngularContent()
    super.unmount()
    return this
  }
}

export namespace AngularShapeView {
  export const action = 'angular' as any

  AngularShapeView.config({
    bootstrap: [action],
    actions: {
      component: action,
    },
  })

  NodeView.registry.register('angular-shape-view', AngularShapeView, true)
}
