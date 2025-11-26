import React from 'react'
import {
  Graph,
  Selection,
  Snapline,
  Keyboard,
  Clipboard,
  History,
  Transform,
} from '@antv/x6'
import { register } from '../src'
import './index.less'

const NodeComponent = () => {
  return (
    <div className="react-node">
      <div className="react-node-header">React Node</div>
    </div>
  )
}

register({
  shape: 'custom-basic-react-node',
  width: 100,
  height: 100,
  component: NodeComponent,
})

export default class Example extends React.Component {
  private container: HTMLDivElement

  componentDidMount() {
    const graph = new Graph({
      container: this.container,
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
      shape: 'custom-basic-react-node',
      x: 60,
      y: 100,
    })

    const n2 = graph.addNode({
      shape: 'custom-basic-react-node',
      x: 240,
      y: 100,
    })

    graph.addEdge({
      source: { cell: n1.id, anchor: 'right' },
      target: { cell: n2.id, anchor: 'left' },
    })

    graph.bindKey(['Ctrl+c', 'Meta+c'], () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.copy(cells)
      }
      return false
    })

    graph.bindKey(['Ctrl+v', 'Meta+v'], () => {
      if (graph.isClipboardEmpty()) {
        return false
      }
      const cells = graph.paste()
      graph.cleanSelection()
      graph.select(cells)
      return false
    })

    graph.bindKey(['Delete', 'Backspace'], () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.removeCells(cells)
      }
      return false
    })

    graph.bindKey(['Ctrl+z', 'Meta+z'], () => {
      if (graph.canUndo()) {
        graph.undo()
      }
      return false
    })

    graph.bindKey(['Ctrl+y', 'Meta+y'], () => {
      if (graph.canRedo()) {
        graph.redo()
      }
      return false
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
