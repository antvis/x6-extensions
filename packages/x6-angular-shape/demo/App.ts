import {
  Graph,
  Selection,
  Snapline,
  Keyboard,
  Clipboard,
  History,
  Transform,
} from '@antv/x6'
import {
  Component,
  Injector,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ViewContainerRef,
} from '@angular/core'
import { register } from '../src'
import './index.less'

@Component({
  selector: 'ng-node',
  template: `<div class="ng-node">
    <div class="ng-node-header">Angular Node</div>
  </div>`,
})
export class NgNodeComponent {}

@Component({
  selector: 'demo-root',
  standalone: true,
  template: `
    <div class="angular-basic-app">
      <div #container class="app-content"></div>
      <ng-container #vc></ng-container>
    </div>
  `,
})
export class DemoRootComponent implements AfterViewInit {
  @ViewChild('container', { static: true })
  containerRef!: ElementRef<HTMLDivElement>
  @ViewChild('vc', { static: true, read: ViewContainerRef })
  vcr!: ViewContainerRef

  ngAfterViewInit(): void {
    const injector = Injector.create({
      providers: [{ provide: ViewContainerRef, useValue: this.vcr }],
    })

    register({
      shape: 'custom-basic-angular-node',
      width: 100,
      height: 100,
      injector,
      content: NgNodeComponent,
    })

    const graph = new Graph({
      container: this.containerRef.nativeElement,
      background: {
        color: '#F2F7FA',
      },
      grid: true,
    })

    graph.use(
      new Selection({
        multiple: true,
        rubberband: true,
        showNodeSelectionBox: true,
      }),
    )
    graph.use(new Snapline({ enabled: true }))
    graph.use(new Keyboard({ enabled: true }))
    graph.use(new Clipboard({ enabled: true }))
    graph.use(new History({ enabled: true }))
    graph.use(
      new Transform({
        resizing: { enabled: true },
        rotating: { enabled: true },
      }),
    )

    const n1 = graph.addNode({
      shape: 'custom-basic-angular-node',
      x: 60,
      y: 100,
    })
    const n2 = graph.addNode({
      shape: 'custom-basic-angular-node',
      x: 240,
      y: 100,
    })

    graph.addEdge({ source: { cell: n1.id }, target: { cell: n2.id } })

    graph.centerContent()
  }
}
