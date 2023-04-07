export interface vector2D {
  x: number
  y: number
}

export interface basicEntity {
  position: vector2D
  velocity: vector2D
  radius: number
  node?: {
    prev: basicEntity | null
    next: basicEntity | null
    gridX: number
    gridY: number
  }
}

export interface LinkedListNode<T> {
  data: T
  next: LinkedListNode<T> | null
}

export interface DoublyLinkedListNode<T> {
  data: T
  prev: DoublyLinkedListNode<T> | null
  next: DoublyLinkedListNode<T> | null
}
export function clamp (num:number, min:number, max:number) {return Math.min(Math.max(num, min), max)};


export function random(a: number, b: number) {
  return Math.random() * (b - a) + a
}

export function add(a: vector2D, b: vector2D): vector2D {
  return { x: a.x + b.x, y: a.y + b.y }
}

export function subtract(a: vector2D, b: vector2D): vector2D {
  return { x: a.x - b.x, y: a.y - b.y }
}

export function dotProduct(a: vector2D, b: vector2D): number {
  return (a.x * b.x) + (a.y * b.y)
}

export function unitVector(a: vector2D): vector2D {
  const len = Math.sqrt(a.x ** 2 + a.y ** 2)
  return { x: a.x / len, y: a.y / len }
}
/*
export function makeDoublyLinkedList<T>(data: T) {
  let head: DoublyLinkedListNode<T> | null = { data, next: null, prev: null }
  let current: DoublyLinkedListNode<T> | null = head
  return {
    goNext() {
      if (current?.next) {
        current = current.next
        return current
      } else {
        return null
      }
    },
    goPrev() {
      if (current?.prev) {
        current = current.prev
        return current
      }
      else {
        return null
      }
    },
    reset() {
      current && current = head
      return head
    },
    head() {
      return head
    },
    current() {
      return current
    },
    append(data: T) {
      current.next = { data, prev: current, next: current.next }
      current = current.next
    },
    remove() {
      if (current === head) {
        if (head.next) {
          head = head.next
        }
        else {
          head = null
        }
      } else {
        current.next && (current.next.prev = current.prev)
        current.prev && (current.prev.next = current.next)
        current && (current = current.next)
      }
    },
    print() {
      let output: string = "LINKED LIST: "
      let myCurrent = head
      while (myCurrent) {
        output += myCurrent.data + ', '
        myCurrent = myCurrent.next
      }
      return output
    }
  }
}*/