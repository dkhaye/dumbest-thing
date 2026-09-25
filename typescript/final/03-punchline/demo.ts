type Point = { x: number }
function getX(p: Point) { return p.x }
const p = { x: 1, y: 2 }
console.log(getX(p))
