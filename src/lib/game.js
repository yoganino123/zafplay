export const GAME_SECONDS = 60

export const LEVELS = [
  { id: 1, name: 'Mudah', emoji: '🌱', max: 10, desc: 'angka sampai 10' },
  { id: 2, name: 'Sedang', emoji: '🔥', max: 20, desc: 'angka sampai 20' },
  { id: 3, name: 'Sulit', emoji: '🚀', max: 50, desc: 'angka sampai 50' },
]

export const AVATARS = ['🦁', '🐼', '🐸', '🐰', '🐵', '🦄', '🐯', '🐶']

const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a

export function genQuestion(levelId, prev) {
  const { max } = LEVELS.find((l) => l.id === levelId) || LEVELS[0]
  for (let tries = 0; tries < 20; tries++) {
    let a, b, op, ans
    if (Math.random() < 0.5) {
      op = '+'
      a = rnd(1, max - 1)
      b = rnd(1, max - a)
      ans = a + b
    } else {
      op = '-'
      a = rnd(2, max)
      b = rnd(1, a)
      ans = a - b
    }
    if (!prev || prev.a !== a || prev.b !== b || prev.op !== op) return { a, b, op, ans }
  }
  return { a: 1, b: 1, op: '+', ans: 2 }
}
