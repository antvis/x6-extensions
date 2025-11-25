import './index.less'
import { Graph } from '@antv/x6'
import { register } from '../src'

const container = document.querySelector('.app-content') as HTMLDivElement

const viewContainerRef = {
  createComponent() {
    const el = document.createElement('div')
    el.className = 'angular-node'
    const header = document.createElement('div')
    header.className = 'angular-node-header'
    header.textContent = 'Angular Node'
    el.appendChild(header)
    return {
      hostView: {
        rootNodes: [el],
      },
      setInput: () => {},
      changeDetectorRef: { detectChanges: () => {} },
      destroy: () => {},
    }
  },
  createEmbeddedView() {
    const el = document.createElement('div')
    el.className = 'angular-node'
    const header = document.createElement('div')
    header.className = 'angular-node-header'
    header.textContent = 'Angular Template'
    el.appendChild(header)
    return {
      rootNodes: [el],
      detectChanges: () => {},
    }
  },
}

const injector = {
  get: () => viewContainerRef,
} as unknown as import('@angular/core').Injector

class FakeComponent {}

register({
  shape: 'custom-basic-angular-node',
  width: 200,
  height: 100,
  injector,
  content: FakeComponent,
})

const graph = new Graph({
  container,
  background: { color: '#F2F7FA' },
  grid: { size: 10, visible: true },
  panning: { enabled: true },
  mousewheel: { enabled: true, modifiers: ['ctrl', 'meta'] },
  connecting: {
    anchor: 'center',
    connectionPoint: 'anchor',
    allowBlank: false,
    allowLoop: false,
    highlight: true,
  },
})

const a = graph.addNode({
  shape: 'custom-basic-angular-node',
  x: 60,
  y: 100,
})

const b = graph.addNode({
  shape: 'custom-basic-angular-node',
  x: 360,
  y: 100,
})

graph.addEdge({
  source: { cell: a.id, anchor: 'right' },
  target: { cell: b.id, anchor: 'left' },
  attrs: {
    line: { stroke: '#5F95FF', strokeWidth: 2 },
  },
})

graph.centerContent()
