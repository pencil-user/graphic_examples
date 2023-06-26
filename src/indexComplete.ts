import { tabs } from "./tabs";
//import { DoublyLinkedListNode } from "./utils";
import { basicEntity, gridNode } from "./utils";
import { random, unitVector, add, subtract, dotProduct, vector2D, clamp } from "./utils";

const VIEWPORT_WIDTH = 900;
const VIEWPORT_HEIGHT = 900;
const GRID_WIDTH = 50;
const GRID_HEIGHT = 50;
const TILE_SIZE = 90;
const entityList: basicEntity[] = []
let lastRender: number = Date.now()
const grid: (basicEntity | null)[][] = new Array()

//let ctx: CanvasRenderingContext2D | null;
let viewport_offset_x = 0
let viewport_offset_y = 0

let mouseX = 0
let mouseY = 0

function init() {
  tabs('indexComplete');
  const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement
  let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  // init grid
  for (let a = 0; a < GRID_HEIGHT; a++) {
    grid[a] = new Array()
    for (let b = 0; b < GRID_WIDTH; b++) {
      grid[a][b] = null
    }
  }

  canvas.onmousemove = (e: any) => {
    if (e.target) {
      const rect = e.target.getBoundingClientRect();
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
    }
  }

  // init entities

  for (let a = 0; a < 2000; a++) {
    entityList.push({
      position: {
        x: random(50, 3000),
        y: random(50, 3000),
      },
      velocity: {
        x: random(-0.3, 0.3),
        y: random(-0.3, 0.3),
      },
      radius: random(5, 15)
    })
  }

  console.log(entityList)

  window.requestAnimationFrame(() => loop(ctx))
}

function loop(ctx: CanvasRenderingContext2D) {
  const delta = clamp(Date.now() - lastRender, 0, 500);
  lastRender = Date.now()
  update(delta)
  border();
  const pairs = broadPhase()
  narrowPhase(pairs)
  ctx.clearRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT)

  drawGrid(delta, ctx)
  drawEntities(ctx);
  window.requestAnimationFrame(() => loop(ctx))
}

function update(delta: number) {
  entityList.map((entity) => {
    entity.position.x += entity.velocity.x * delta;
    entity.position.y += entity.velocity.y * delta
  })

  if (mouseX < 40) {
    viewport_offset_x = viewport_offset_x - delta
  }
  if (mouseX > VIEWPORT_WIDTH - 40) {
    viewport_offset_x = viewport_offset_x + delta
  }

  if (mouseY < 40) {
    viewport_offset_y = viewport_offset_y - delta
  }
  if (mouseY > VIEWPORT_HEIGHT - 40) {
    viewport_offset_y = viewport_offset_y + delta
  }

  viewport_offset_x = clamp(viewport_offset_x, -50, GRID_WIDTH * TILE_SIZE + 50 - VIEWPORT_WIDTH)
  viewport_offset_y = clamp(viewport_offset_y, -50, GRID_HEIGHT * TILE_SIZE + 50 - VIEWPORT_HEIGHT)

}

function border() {
  const map_width = TILE_SIZE * GRID_WIDTH
  const map_height = TILE_SIZE * GRID_HEIGHT

  entityList.map((entity) => {

    if (entity.position.x < entity.radius) {
      entity.position.x = entity.radius
      entity.velocity.x *= -1
    }
    if (entity.position.y < entity.radius) {
      entity.position.y = entity.radius
      entity.velocity.y *= -1
    }
    if (entity.position.x > map_width - entity.radius) {
      entity.position.x = map_width - entity.radius
      entity.velocity.x *= -1
    }
    if (entity.position.y > map_height - entity.radius) {
      entity.position.y = map_height - entity.radius
      entity.velocity.y *= -1
    }

  })
}

function broadPhase() {
  const pairs: basicEntity[][] = new Array()
  for (let a = 0; a < entityList.length; a++) {
    const entity = entityList[a]
    const gridX = clamp(Math.floor((entity.position.x / TILE_SIZE)), 0, GRID_WIDTH)
    const gridY = clamp(Math.floor((entity.position.y / TILE_SIZE)), 0, GRID_HEIGHT)
    if (entity.node) { // node is set
      // node is set but doesn't match the grid
      if (entity.node.gridX != gridX || entity.node.gridY != gridY) {
        if (entity.node.prev?.node) { // is not head
          entity.node.prev.node.next = entity.node.next
          if (entity.node.next?.node) entity.node.next.node.prev = entity.node.prev
        } else { // is head
          if (entity.node.next?.node) { // is head and has next node
            entity.node.next.node.prev = null
            grid[entity.node.gridX][entity.node.gridY] = entity.node.next
          } else { // is head and no next node
            grid[entity.node.gridX][entity.node.gridY] = null
          }
        }
        const formerEntity = grid[gridX][gridY] || null
        grid[gridX][gridY] = entity
        entity.node.prev = null
        entity.node.next = formerEntity
        if (formerEntity?.node) formerEntity.node.prev = entity
        entity.node.gridX = gridX
        entity.node.gridY = gridY
        if (formerEntity?.node) formerEntity.node.prev = entity

      }
    } else {
      // if no node set, set it now. Only necessary once
      const next = grid[gridX][gridY] || null
      grid[gridX][gridY] = entity
      entity.node = { prev: null, next: next, gridX, gridY }
      if (next?.node) next.node.prev = entity
    }
  }

  for (let a = 0; a < entityList.length; a++) {
    const entity = entityList[a]
    if (entity.node) {
      const walk = (walker: basicEntity | null) => { // function for walking trough one grid tile
        while (walker) {
          const distance = subtract(entity.position, walker.position)
          if (Math.abs(distance.x) <= entity.radius + walker.radius && Math.abs(distance.y) <= entity.radius + walker.radius) {
            pairs.push([entity, walker])
          }
          walker = walker.node?.next || null
        }
      }
      walk(entity.node.next)  // walk through current grid square
      if (entity.node.gridX < 9) walk(grid[entity.node.gridX + 1][entity.node.gridY]) // if exists, walk through next grid square horizontally
      if (entity.node.gridY < 9) walk(grid[entity.node.gridX][entity.node.gridY + 1]) // if exists, walk through next grid square vertically
      if (entity.node.gridX < 9 && entity.node.gridY < 9) walk(grid[entity.node.gridX + 1][entity.node.gridY + 1]) // if exists, walk through next grid square diagonally
    }
  }
  return pairs
}

function narrowPhase(pairs: basicEntity[][]) {

  pairs.map(
    (pair) => {
      const e1 = pair[0]
      const e2 = pair[1]
      const length = Math.sqrt((e1.position.x - e2.position.x) ** 2 + (e1.position.y - e2.position.y) ** 2)
      if (length < e1.radius + e2.radius) {
        CollisionResponse([e1, e2])
      }
    }
  )
  //}
  //}
}



function CollisionResponse(pair: basicEntity[]) {

  const unitN = unitVector(subtract(pair[0].position, pair[1].position))
  const unitT: vector2D = { x: unitN.y, y: -unitN.x }

  const unitN1: vector2D = { x: -unitN.x, y: -unitN.y }
  const unitT1: vector2D = { x: -unitT.x, y: -unitT.y }

  const dpN = dotProduct(pair[0].velocity, unitN)
  const dpT = dotProduct(pair[0].velocity, unitT)

  const dpN1 = dotProduct(pair[1].velocity, unitN1)
  const dpT1 = dotProduct(pair[1].velocity, unitT1)

  // shift position
  pair[0].position.x = pair[1].position.x + (pair[0].radius + pair[1].radius) * unitN.x
  pair[0].position.y = pair[1].position.y + (pair[0].radius + pair[1].radius) * unitN.y

  // adjust velocity
  pair[0].velocity.x = (dpN1 * unitN1.x) + (dpT * unitT.x)
  pair[0].velocity.y = (dpN1 * unitN1.y) + (dpT * unitT.y)

  pair[1].velocity.x = (dpN * unitN.x) + (dpT1 * unitT1.x)
  pair[1].velocity.y = (dpN * unitN.y) + (dpT1 * unitT1.y)

}


function drawGrid(delta: number, ctx: CanvasRenderingContext2D) {
  ctx.font = "20px sans-serif";
  ctx.fillText(`${Math.round(1000 / delta)} fps ${mouseX}, ${mouseY}`, 10, 20);
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'lightGrey'
  for (let a = -2; a < 12; a++) {
    ctx.moveTo(a * TILE_SIZE - (viewport_offset_x % TILE_SIZE), 0);
    ctx.lineTo(a * TILE_SIZE - (viewport_offset_x % TILE_SIZE), VIEWPORT_WIDTH);
    //ctx.stroke();
  }
  for (let a = -2; a < 12; a++) {
    ctx.moveTo(0, a * TILE_SIZE - (viewport_offset_y % TILE_SIZE));
    ctx.lineTo(VIEWPORT_HEIGHT, a * TILE_SIZE - (viewport_offset_y % TILE_SIZE));
  }
  ctx.stroke();
  //ctx.restore()

  ctx.beginPath()
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'blue'
  ctx.strokeRect(0 - (viewport_offset_x), 0 - (viewport_offset_y), TILE_SIZE * GRID_WIDTH, TILE_SIZE * GRID_HEIGHT);
  ctx.stroke();

}

function drawEntities(ctx: CanvasRenderingContext2D) {

  let startX = clamp(Math.floor(viewport_offset_x / TILE_SIZE) - 1, 0, GRID_WIDTH)
  let startY = clamp(Math.floor(viewport_offset_y / TILE_SIZE) - 1, 0, GRID_HEIGHT)
  let endX = clamp(startX + 12, 0, GRID_WIDTH)
  let endY = clamp(startY + 12, 0, GRID_HEIGHT)

  for (let a = startX; a < endX; a++) {
    for (let b = startY; b < endY; b++) {
      let walker = grid[a][b]
      if (walker) {
        do {

          ctx.beginPath();
          ctx.arc(-viewport_offset_x + walker.position.x, -viewport_offset_y + walker.position.y, walker.radius, 0, 2 * Math.PI);
          ctx.fill();
          walker = walker.node?.next as any

        } while (walker)
      }
    }
  }


}

init();