import { defineComponent, h, onMounted, ref } from 'vue'
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

const NodeComponent = defineComponent({
  name: 'VueNodeComponent',
  setup() {
    return () =>
      h('div', { class: 'vue-node' }, [
        h('div', { class: 'vue-node-header' }, 'Vue Node'),
      ])
  },
})

register({
  shape: 'custom-basic-vue-node',
  width: 100,
  height: 100,
  component: NodeComponent,
})

export default defineComponent({
  name: 'Example',
  setup() {
    const container = ref<HTMLDivElement | null>(null)

    onMounted(() => {
      const graph = new Graph({
        container: container.value!,
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
        shape: 'custom-basic-vue-node',
        x: 60,
        y: 100,
      })

      const n2 = graph.addNode({
        shape: 'custom-basic-vue-node',
        x: 240,
        y: 100,
      })

      graph.addEdge({
        source: { cell: n1.id },
        target: { cell: n2.id },
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
    })

    return () =>
      h('div', { class: 'vue-basic-app' }, [
        h('div', {
          class: 'app-content',
          ref: (el: any) => (container.value = el),
        }),
      ])
  },
})
