import { tabs } from "./tabs";
//import { DoublyLinkedListNode } from "./utils";
import { basicEntity } from "./utils";
import { random, unitVector, add, subtract, dotProduct, vector2D, clamp } from "./utils";

const WIDTH = 900;
const HEIGHT = 900;
const entityList: basicEntity[] = []
let lastRender: number = Date.now()
const grid: (basicEntity | null)[][] = new Array()

//let ctx: CanvasRenderingContext2D | null;

function init() {
  tabs('index');
  const canvas = document.querySelector("#myCanvas") as HTMLCanvasElement
  let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  // init grid
  for (let a = 0; a < 10; a++) {
    grid[a] = new Array()
    for (let b = 0; b < 10; b++) {
      grid[a][b] = null
    }
  }

  // init entities
  for (let a = 0; a < 200; a++) {
    entityList.push({
      position: {
        x: random(50, 750),
        y: random(50, 750),
      },
      velocity: {
        x: random(-0.3, 0.3),
        y: random(-0.3, 0.3),
      },
      radius: random(10, 15)
    })
  }

  entityList.push({
    position: {
      x: 20,
      y: 20,
    },
    velocity: {
      x: 0.3,
      y: 0.1,
    },
    radius: 15
  })

  entityList.push({
    position: {
      x: 20,
      y: 220,
    },
    velocity: {
      x: 0.3,
      y: -0.1,
    },
    radius: 15
  })


  entityList.push({
    position: {
      x: 20,
      y: 320,
    },
    velocity: {
      x: 0,
      y: 0.3,
    },
    radius: 15
  })

  entityList.push({
    position: {
      x: 20,
      y: 520,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    radius: 15
  })

  entityList.push({
    position: {
      x: 320,
      y: 320,
    },
    velocity: {
      x: 0.3,
      y: 0,
    },
    radius: 15
  })

  entityList.push({
    position: {
      x: 720,
      y: 320,
    },
    velocity: {
      x: 0,
      y: 0,
    },
    radius: 15
  })

  console.log(entityList)

  window.requestAnimationFrame(() => loop(ctx))
  //gameLoop()
}

function loop(ctx: CanvasRenderingContext2D) {
  const delta = Date.now() - lastRender;
  lastRender = Date.now()
  update(delta)
  border();
  const pairs = broadPhase()
  narrowPhase(pairs)
  //console.log(pairs)
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  drawGrid(delta, ctx)
  drawEntities(ctx);
  window.requestAnimationFrame(() => loop(ctx))
  //setTimeout(loop, 200)
}

function update(delta: number) {
  entityList.map((entity) => {
    entity.position.x += entity.velocity.x * delta;
    entity.position.y += entity.velocity.y * delta
  })
}

function border() {
  entityList.map((entity) => {
    if (entity.position.x < entity.radius) {
      entity.position.x = entity.radius
      entity.velocity.x *= -1
    }
    if (entity.position.y < entity.radius) {
      entity.position.y = entity.radius
      entity.velocity.y *= -1
    }
    if (entity.position.x > WIDTH - entity.radius) {
      entity.position.x = WIDTH - entity.radius
      entity.velocity.x *= -1
    }
    if (entity.position.y > HEIGHT - entity.radius) {
      entity.position.y = HEIGHT - entity.radius
      entity.velocity.y *= -1
    }

  })
}

function broadPhase() {
  const pairs: basicEntity[][] = new Array()
  for (let a = 0; a < entityList.length; a++) {
    const entity = entityList[a]
    const gridX = clamp(Math.floor((entity.position.x / WIDTH) * 10), 0, 9)
    const gridY = clamp(Math.floor((entity.position.y / HEIGHT) * 10), 0, 9)
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
      const walk = (walker: basicEntity | null) => { // function for walking
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
  //  for (let a = 0; a < entityList.length; a++) {
  //    for (let b = a + 1; b < entityList.length; b++) {
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


/*
function CollisionResponse(pair: basicEntity[]) {

  function doOne(pair: basicEntity[]) {
    const unitV = unitVector(subtract(pair[0].position, pair[1].position))
    const unitVh: vector2D = { x: -unitV.x, y: unitV.y }
    const dp1 = dotProduct(pair[0].velocity, unitV)
    const dp2 = dotProduct(pair[0].velocity, unitVh)

    pair[0].position.x = pair[1].position.x + (pair[0].radius + pair[1].radius) * unitV.x
    pair[0].position.y = pair[1].position.y + (pair[0].radius + pair[1].radius) * unitV.y

    pair[0].velocity.x = -(dp1 * unitV.x) + (dp2 * unitV.y)
    pair[0].velocity.y = -(dp1 * unitV.y) - (dp2 * unitV.x)
  }

  doOne([pair[0], pair[1]])
  doOne([pair[1], pair[0]])

}
*/

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
/*
function drawMe(Xcenter: number, Ycenter: number, size: number) {
  var numberOfSides = 8
  ctx.beginPath();
  ctx.moveTo(Xcenter + size * Math.cos(0), Ycenter + size * Math.sin(0));
  for (var i = 1; i <= numberOfSides; i += 1) {
    ctx.lineTo(Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
  }
  ctx.fill()
  //ctx.stroke();
}
*/

function drawGrid(delta: number, ctx: CanvasRenderingContext2D) {
  ctx.font = "20px sans-serif";
  ctx.fillText(`${Math.round(1000 / delta)} fps`, 10, 20);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'lightGrey'
  for (let a = 0; a < 11; a++) {
    ctx.moveTo(a * 90, 0);
    ctx.lineTo(a * 90, WIDTH);
    ctx.stroke();
  }
  for (let a = 0; a < 11; a++) {
    ctx.moveTo(0, a * 90);
    ctx.lineTo(WIDTH, a * 90);
    ctx.stroke();
  }
}

function drawEntities(ctx: CanvasRenderingContext2D) {
  entityList.map((entity) => {
    ctx.beginPath();
    ctx.arc(entity.position.x, entity.position.y, entity.radius, 0, 2 * Math.PI);
    //ctx.stroke();
    ctx.fill();
    //drawMe(entity.position.x, entity.position.y, entity.radius)
  })
}

init();