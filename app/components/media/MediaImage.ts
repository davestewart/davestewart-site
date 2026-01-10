import { defineComponent, h } from 'vue'
import { getStyle } from '../../utils/media'

export default defineComponent({
  props: {
    source: {
      type: Object,
      required: true,
    },
  },

  setup (props) {
    return () => h('img', {
      style: getStyle(props.source),
      src: props.source.src || props.source.file,
      alt: props.source.caption || props.source.alt,
      draggable: false,
    })
  },
})
