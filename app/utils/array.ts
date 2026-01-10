import { getValue } from './object'

type SortOrder = 'asc' | 'desc'

export function sortBy (prop: string, order: SortOrder = 'asc', numeric: boolean = false) {
  return function (a: any, b: any): number {
    // values
    let valA = getValue(a, prop)
    let valB = getValue(b, prop)

    // order
    if (order === 'desc') {
      const t = valA
      valA = valB
      valB = t
    }

    // number
    if (numeric) {
      return valA - valB
    }

    // undefined items go to the end of the list
    if (typeof valA === 'undefined') {
      return 1
    }
    if (typeof valB === 'undefined') {
      return -1
    }

    // sort
    if (valA > valB) {
      return 1
    }
    if (valA < valB) {
      return -1
    }
    return 0
  }
}

interface Group<T> {
  title: string
  items: T[]
}

export function groupBy<T> (items: T[], property: string, transformer: (value: any) => any = value => value): Group<T>[] {
  const groups: Record<string, Group<T>> = {}
  return items
    .reduce((output, item) => {
      const prop = transformer(getValue(item, property))
      if (prop) {
        let group = groups[prop]
        if (!group) {
          group = {
            title: prop,
            items: [],
          }
          groups[prop] = group
          output.push(group)
        }
        group.items.push(item)
      }
      return output
    }, [] as Group<T>[])
}

export function offset (value: number, dir: number, max: number | any[], loop: boolean = false): number {
  const min = 0
  const maxValue = Array.isArray(max)
    ? max.length - 1
    : max - 1
  value += dir
  if (value < min) {
    return loop ? maxValue : min
  }
  if (value > maxValue) {
    return loop ? min : maxValue
  }
  return value
}
