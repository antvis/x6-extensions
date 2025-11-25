<template>
  <div class="vue-basic-app">
    <div class="app-content" ref="container" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, h } from 'vue'
import { Graph } from '@antv/x6'
import { register } from '../src'
import './index.less'

const container = ref<HTMLDivElement | null>(null)

const NodeComponent = {
  name: 'VueNodeComponent',
  props: { node: Object, graph: Object },
  render() {
    return h(
      'div',
      {
        class: 'vue-node',
        style: {
          width: '100%',
          height: '100%',
          border: '1px solid #8f8f8f',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      },
      [h('div', { class: 'vue-node-header' }, 'Vue Node')],
    )
  },
}

register({
  shape: 'custom-basic-vue-node',
  width: 200,
  height: 100,
  component: NodeComponent,
})

onMounted(() => {
  const graph = new Graph({
    container: container.value!,
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
    shape: 'custom-basic-vue-node',
    x: 60,
    y: 100,
  })

  const b = graph.addNode({
    shape: 'custom-basic-vue-node',
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
})
</script>
