<template>
  <svg
    ref="el"
    class="splash"
    viewBox="0 0 840 400"
    xmlns="http://www.w3.org/2000/svg"
    @animationend="onAnimationEnd"
  >
    <path
      id="background"
      fill="#FFF"
      fill-rule="nonzero"
      d="M0 0h840v400H0z"
    />
    <g
      id="logo"
      transform="translate(59.078 131.608)"
      fill="#EA4848"
      fill-rule="nonzero"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @mousemove="onMouseMove"
    >
      <path id="mouth"
            d="M96.232 136.84c9.037 0 17.262-1.706 24.678-5.118 7.415-3.413 13.753-8.171 19.016-14.276 5.262-6.105 9.342-13.337 12.239-21.695 2.896-8.36 4.345-17.485 4.345-27.378 0-9.83-1.449-18.925-4.345-27.283-2.897-8.36-6.977-15.575-12.24-21.649-5.262-6.073-11.6-10.832-19.015-14.275C113.494 1.722 105.269 0 96.232 0H58.917v136.84h37.315Zm-10.206-24.419V24.42h10.926c5.156 0 9.754 1.017 13.794 3.052 4.04 2.035 7.455 4.947 10.246 8.735 2.79 3.788 4.93 8.406 6.418 13.853 1.488 5.447 2.233 11.552 2.233 18.314 0 6.825-.745 12.96-2.233 18.408s-3.628 10.065-6.418 13.853c-2.791 3.788-6.206 6.7-10.246 8.735-4.04 2.035-8.638 3.052-13.794 3.052H86.026Z" />
      <path id="eyes"
            d="M18.341 55.515c2.57 0 4.967-.464 7.19-1.394a18.243 18.243 0 0 0 5.836-3.861c1.668-1.645 2.97-3.593 3.908-5.846.938-2.252 1.407-4.665 1.407-7.24 0-2.574-.469-4.97-1.407-7.186a17.771 17.771 0 0 0-3.908-5.792c-1.667-1.644-3.612-2.95-5.835-3.915-2.224-.965-4.62-1.448-7.191-1.448-2.64 0-5.072.483-7.295 1.448-2.223.966-4.15 2.27-5.783 3.915s-2.918 3.575-3.856 5.792C.469 32.205 0 34.6 0 37.174c0 2.575.469 4.988 1.407 7.24.938 2.253 2.223 4.201 3.856 5.846 1.632 1.644 3.56 2.931 5.783 3.861 2.223.93 4.655 1.394 7.295 1.394ZM18.341 120.865c2.57 0 4.967-.465 7.19-1.394a18.243 18.243 0 0 0 5.836-3.862c1.668-1.644 2.97-3.593 3.908-5.845.938-2.253 1.407-4.666 1.407-7.24s-.469-4.97-1.407-7.186a17.771 17.771 0 0 0-3.908-5.792c-1.667-1.645-3.612-2.95-5.835-3.915-2.224-.965-4.62-1.448-7.191-1.448-2.64 0-5.072.483-7.295 1.448s-4.15 2.27-5.783 3.915C3.63 91.19 2.345 93.12 1.407 95.338.469 97.554 0 99.95 0 102.524s.469 4.987 1.407 7.24c.938 2.252 2.223 4.2 3.856 5.845 1.632 1.645 3.56 2.932 5.783 3.862 2.223.93 4.655 1.394 7.295 1.394Z" />
    </g>
    <path
      id="border"
      stroke="#DDD"
      stroke-width="3"
      stroke-dasharray="3"
      d="M267.5 89v222"
    />
    <g
      id="hello"
      transform="translate(317.624 135.149)"
      fill="#323232"
      fill-rule="nonzero"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @mousemove="onMouseMove"
    >
      <g id="text">
        <path id="h" d="M19.227 121.131V72.903h47.908v48.228h19.227V8.973H67.135v45.664H19.227V8.973H0v112.158z" />
        <path id="e"
              d="M140.839 43.261c20.621 0 37.944 15.86 38.289 38.876l.005.7v.97a126.654 126.654 0 0 1-.136 5.773l-.024.467h-56.72c1.442 6.73 9.293 15.382 21.31 15.382 12.481 0 19.882-6.775 20.744-7.607l.032-.03.053-.054 9.614 14.42s-12.017 10.896-30.443 10.896c-23.073 0-40.858-17.625-40.858-39.897 0-22.271 16.183-39.896 38.134-39.896Zm0 17.465c-12.196 0-17.816 8.454-18.562 15.149l-.024.232h37.653c-.32-6.569-6.41-15.381-19.067-15.381Z" />
        <path id="l-1" d="M214.703 121.131V0h-19.227v121.131z" />
        <path id="l-2" d="M257.644 121.131V0h-19.227v121.131z" />
        <path id="o"
              d="M314.524 43.261c22.592 0 40.537 17.465 40.537 39.896 0 22.272-17.945 39.897-40.537 39.897s-40.537-17.625-40.537-39.897c0-22.431 17.945-39.896 40.537-39.896Zm0 17.945c-12.978 0-20.99 10.095-20.99 21.951 0 11.857 8.012 21.951 20.99 21.951 12.979 0 20.99-10.094 20.99-21.95 0-11.857-8.011-21.952-20.99-21.952Z" />
      </g>
      <g id="dots">
        <path
          id="dot-1"
          d="M380.537 123.054c7.05 0 12.658-5.608 12.658-12.658s-5.608-12.658-12.658-12.658-12.657 5.608-12.657 12.658 5.608 12.658 12.657 12.658Z"
          @click="onDotClick"
          @animationend="onDotAnimationEnd"
        />
        <path
          id="dot-2"
          d="M419.567 123.054c7.05 0 12.658-5.608 12.658-12.658s-5.608-12.658-12.658-12.658-12.658 5.608-12.658 12.658 5.608 12.658 12.658 12.658Z"
          @click="onDotClick"
          @animationend="onDotAnimationEnd"
        />
        <path
          id="dot-3"
          d="M458.596 123.054c7.05 0 12.658-5.608 12.658-12.658s-5.608-12.658-12.658-12.658-12.658 5.608-12.658 12.658 5.608 12.658 12.658 12.658Z"
          @click="onDotClick"
          @animationend="onDotAnimationEnd"
        />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { throttle } from 'throttle-debounce'

interface Position {
  x: number
  y: number
}

function pos (event: MouseEvent): Position {
  const x = event.clientX
  const y = event.clientY
  return { x, y }
}

function dist (a: Position, b: Position): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}

const el = ref<SVGSVGElement>()
const position = ref<Position>({ x: 0, y: 0 })
let timeoutId: ReturnType<typeof setTimeout> | undefined

function animate (delay = 0) {
  stop()
  timeoutId = setTimeout(() => {
    el.value?.classList.add('bounce')
  }, delay)
}

function stop () {
  clearTimeout(timeoutId)
}

function onDotClick (event: MouseEvent) {
  event.preventDefault()
  event.stopImmediatePropagation()
  ;(event.currentTarget as HTMLElement).classList.add('bounce')
}

function onMouseEnter (event: MouseEvent) {
  position.value = pos(event)
  animate()
}

const onMouseMove = throttle(100, (event: MouseEvent) => {
  const p = pos(event)
  const d = dist(position.value, p)
  position.value = p
  if (d > 20) {
    animate()
  }
})

function onMouseLeave () {
  stop()
  if (!el.value?.classList.contains('bounce')) {
    stop()
  }
}

function onAnimationEnd (event: AnimationEvent) {
  if ((event.target as HTMLElement).id === 'dot-3') {
    el.value?.classList.remove('bounce')
  }
}

function onDotAnimationEnd (event: AnimationEvent) {
  const target = event.target as HTMLElement
  const classList = target.classList
  if (target.id.startsWith('dot') && classList.contains('bounce')) {
    classList.remove('bounce')
  }
}

onMounted(() => {
  const animCount = parseInt(document.body.getAttribute('data-animCount') || '0')
  if (animCount < 3) {
    document.body.setAttribute('data-animCount', String(animCount + 1))
    animate(600)
  }
})
</script>

<style lang="scss">
.splash {
  width: 100%;
  aspect-ratio: 840/400;
  user-select: none;
  pointer-events: all;

  #logo, #hello, #splash {
    pointer-events: bounding-box;
    cursor: grab;
  }

  &.bounce {
    #dot-1, #dot-2, #dot-3 {
      //animation: squash-3 1.4s ease;
      animation: bounce-3 1.1s;
    }

    #dot-1 {
      animation-delay: .0s;
    }

    #dot-2 {
      animation-delay: .1s;
    }

    #dot-3 {
      animation-delay: .17s;
    }
  }

  #dot-1.bounce,
  #dot-2.bounce,
  #dot-3.bounce {
    animation: bounce-3 1.1s;
  }
}

$rise: cubic-bezier(0.5, 0.0, 1.0, 0.7);
$fall: cubic-bezier(0.0, 0.3, 0.5, 1.0);

@mixin top($p, $s: 1, $t: $rise) {
  transform: translateY($p) scaleY($s);
  animation-timing-function: $t;
}

@mixin bottom($s: 1, $t: $fall) {
  transform: translateY(0) scaleY($s);
  animation-timing-function: $t;
}

@keyframes bounce-2 {
  0% {
    @include bottom;
  }

  30% {
    @include top(-40px);
  }
  60% {
    @include bottom;
  }

  80% {
    @include top(-10px);
  }
  100% {
    @include bottom;
  }
}

@keyframes bounce-3 {
  0% {
    @include bottom;
  }

  25% {
    @include top(-40px);
  }
  50% {
    @include bottom;
  }

  62% {
    @include top(-10px);
  }
  75% {
    @include bottom;
  }

  88% {
    @include top(-3px);
  }
  100% {
    @include bottom;
  }
}

@keyframes bounce-5 {
  0% {
    @include bottom;
  }

  19% {
    @include top(-40px);
  }
  37% {
    @include bottom;
  }

  50% {
    @include top(-20px);
  }
  62% {
    @include bottom;
  }

  71% {
    @include top(-10px);
  }
  80% {
    @include bottom;
  }

  85% {
    @include top(-4px);
  }
  91% {
    @include bottom;
  }

  95% {
    @include top(-2px);
  }
  100% {
    @include bottom;
  }
}

@keyframes squash-3 {
  0% {
    transform: translateY(0) scaleY(1);
    transform-origin: 12px 120px;
    animation-timing-function: ease-in;
  }

  10% {
    transform-origin: 12px 120px;
    @include bottom(.68);
  }

  20% {
    transform-origin: 12px 120px;
    @include bottom(.6, $fall);
  }

  40% {
    @include top(-50px, 1.1);
  }
  62% {
    @include bottom;
  }

  74% {
    @include top(-18px);
  }
  86% {
    @include bottom;
  }

  92% {
    @include top(-3px);
  }
  100% {
    @include bottom;
  }
}
</style>
