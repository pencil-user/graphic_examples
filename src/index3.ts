type Graph = Record<string, Record<string, number>>
type Row = { vertex: string, cost: number }
type Table = Record<string, Row>

const mapObj = <T>(obj: Record<string, T>, fn: (record: T, key: string) => any) => {
  return Object.keys(obj).map((k) => fn(obj[k], k))
}

const graph: Graph = {
  a: { b: 5, c: 2 },
  b: { a: 5, c: 7, d: 8 },
  c: { a: 2, b: 7, d: 4, e: 8 },
  d: { b: 8, c: 4, e: 6, f: 4 },
  e: { c: 8, d: 6, f: 3 },
  f: { e: 3, d: 4 },
};

const printTable = (table: Table) => {
  return mapObj(table, (vertex, key) => {
    let { vertex: from, cost } = vertex;
    return `${key}: ${cost} via ${from}`;
  })
    .join("\n");
};

const tracePath = (table: Table, start: string, end: string): string[] => {
  let path = [];
  let next = end;
  while (true) {
    path.unshift(next);
    if (next === start) {
      break;
    }
    next = table[next].vertex;
  }
  return path;
};

const formatGraph = (graph: Graph): Record<string, Row[]> => {
  const tmp: Record<string, Row[]> = {};
  mapObj(graph, (obj, k) => {
    const arr: Row[] = [];
    mapObj(obj, (cost, key) => arr.push({ vertex: key, cost: cost }));
    tmp[k] = arr;
  });
  console.log('FORMAT GRAPH', tmp)
  return tmp;
};

const dijkstra = (graph: Graph, start: string, end: string) => {
  console.log('GRAPH', graph)
  let map = formatGraph(graph);

  let visited: string[] = [];
  let unvisited: string[] = [start];
  let shortestDistances: Record<string, Row> = { [start]: { vertex: start, cost: 0 } };

  let vertex: string | undefined;
  while ((vertex = unvisited.shift())) {
    // Explore unvisited neighbors
    let neighbors = map[vertex].filter((n) => !visited.includes(n.vertex));

    // Add neighbors to the unvisited list
    unvisited.push(...neighbors.map((n) => n.vertex));

    let costToVertex = shortestDistances[vertex].cost;

    neighbors.map(({ vertex: to, cost }) => {
      let currCostToNeighbor =
        shortestDistances[to] && shortestDistances[to].cost;
      let newCostToNeighbor = costToVertex + cost;
      if (
        currCostToNeighbor == undefined ||
        newCostToNeighbor < currCostToNeighbor
      ) {
        // Update the table
        shortestDistances[to] = { vertex: vertex!, cost: newCostToNeighbor };
      }

      visited.push(vertex!);
    })
  }

  console.log("Table of costs:");
  console.log(printTable(shortestDistances));

  const path = tracePath(shortestDistances, start, end);

  console.log(
    "Shortest path is: ",
    path.join(" -> "),
    " with weight ",
    shortestDistances[end].cost
  );
};

dijkstra(graph, "a", "f");