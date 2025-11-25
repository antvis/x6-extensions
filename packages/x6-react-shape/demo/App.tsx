import React from 'react'
import { Graph } from '@antv/x6'
import { register } from '../src'
import './index.less'

const NodeComponent: React.FC<{ node: any; graph: Graph }> = () => (
  <div className="react-node">
    <div className="react-node-header">React Node</div>
  </div>
)

register({
  shape: 'custom-basic-react-node',
  width: 200,
  height: 100,
  component: NodeComponent,
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
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
      shape: 'custom-basic-react-node',
      x: 60,
      y: 100,
    })

    const b = graph.addNode({
      shape: 'custom-basic-react-node',
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

    graph.on('node:click', ({ node }) => {
      node.setData({ clicked: true })
    })

    graph.centerContent()
  }

  refContainer = (container: HTMLDivElement) => {
    this.container = container
  }

  render() {
    return (
      <div className="react-basic-app">
        <div className="app-content" ref={this.refContainer} />
      </div>
    )
  }
}
