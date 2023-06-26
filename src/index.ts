import { tabs } from "./tabs";
//import { DoublyLinkedListNode } from "./utils";
import { basicEntity, gridNode } from "./utils";
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

  // init entities

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
}

function loop(ctx: CanvasRenderingContext2D) {
  const delta = Date.now() - lastRender;
  lastRender = Date.now()
  update(delta)
  border();
  collide()
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  drawGrid(delta, ctx)
  drawEntities(ctx);
  window.requestAnimationFrame(() => loop(ctx))
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


function collide() {
  for (let a = 0; a < entityList.length; a++) {
    for (let b = a + 1; b < entityList.length; b++) {

      const e1 = entityList[a]
      const e2 = entityList[b]
      const length = Math.sqrt((e1.position.x - e2.position.x) ** 2 + (e1.position.y - e2.position.y) ** 2)
      if (length < e1.radius + e2.radius) {
        CollisionResponse([e1, e2])
      }

    }
  }
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
    ctx.fill();
  })
}

init();