export const TIMER = 5;
export const REGEX_SHAPE = /([ITOZSJL])(\d*)/;
export const REGEX_MOVE = /[NDMPRCH]/;
export const REGEX_SHAPE_OR_MOVE_LIST = /([ITOZSJL]\d*)|([NDMPRCH])/g;

export const shapes = ['I', 'T', 'O', 'Z', 'S', 'J', 'L'] as const;
export type Shape = typeof shapes[number];

export const moves = ['N', 'D', 'M', 'P', 'R', 'C', 'H'] as const;
export type Move = typeof moves[number];

export const orientations = ['Top', 'Right', 'Bottom', 'Left'] as const;
export type Orientation = typeof orientations[number];

export interface ShapeState {
  type: Shape;
  index: number;
  left: number;
  top: number;
}

export const rotations: { [key in Shape]: number[][][] } = {
  I: [
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
    ],
  ],
  J: [
    [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [1, 1, 0],
    ],
  ],
  L: [
    [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0],
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0],
    ],
  ],
  O: [
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ],
  ],
  T: [
    [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
  Z: [
    [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 0, 0],
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0],
    ],
  ],
  S: [
    [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    [
      [0, 1, 0],
      [0, 1, 1],
      [0, 0, 1],
    ],
    [
      [0, 0, 0],
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0],
    ],
  ],
};

const choose: <T>(arr: T[] | readonly T[]) => T = (arr) =>
  arr[~~(Math.random() * arr.length)];
export const random = {
  choose,
  // Low - inclusive, high - exclusive
  between: (low: number, high: number) => low + (high - low) * Math.random(),
  // Low - inclusive, high - exclusive
  betweenInt: (low: number, high: number) => ~~random.between(low, high),
};

export const inBounds = (right: number, bottom: number, left: number) => {
  if (left < 0) return false;
  if (right > 9) return false;
  if (bottom > 19) return false;
  return true;
};

export const shape = {
  next: (): ShapeState => {
    const type = random.choose(shapes);
    const left = random.betweenInt(
      -shape.firstNonEmpty({ type, index: 0 }, 'Left'),
      9 - shape.size(type) + shape.firstNonEmpty({ type, index: 0 }, 'Right')
    );
    return shape.spawn(type, left);
  },

  spawn: (type: Shape, left = 0): ShapeState => ({
    type,
    index: 0,
    left,
    top: 1 - shape.size(type),
  }),
  rotate: ({ type, index, ...rest }: ShapeState, clockwise = true) => ({
    type,
    index:
      (index + rotations[type].length + (clockwise ? 1 : -1)) %
      rotations[type].length,
    ...rest,
  }),
  toSpawn: ({ type, left }: ShapeState) => `${type}${left}`,
  clone: (s?: ShapeState) => (s ? { ...s } : undefined),
  size: (type: Shape) => (type === 'O' || type === 'I' ? 4 : 3),
  flat: ({ type, index }: Pick<ShapeState, 'type' | 'index'>) =>
    rotations[type][index].reduce((acc, v) => [...acc, ...v], []),
  side: (
    s: Pick<ShapeState, 'type' | 'index'>,
    o: Orientation,
    from = 0
  ): number[] => {
    const { type, index } = s;
    const size = shape.size(type);
    if (o === 'Right' || o === 'Bottom')
      return shape.side(s, o === 'Right' ? 'Left' : 'Top', size - from - 1);

    if (o === 'Top') return rotations[type][index][from];
    const flat = shape.flat(s);
    return flat.filter((_, i) => i % size === from);
  },
  // Returns the index of the first non-empty line from that orientation
  firstNonEmpty: (s: Pick<ShapeState, 'type' | 'index'>, o: Orientation) =>
    Array.from({ length: shape.size(s.type) })
      .fill(0)
      .map((_, i) => shape.side(s, o, i).reduce((acc, v) => acc + v, 0))
      .findIndex((v) => v > 0),
  isInBounds: (s: ShapeState) => {
    // Board size: 10 x 20
    const size = shape.size(s.type);
    const left = shape.firstNonEmpty(s, 'Left') + s.left;
    const right = size - shape.firstNonEmpty(s, 'Right') - 1 + s.left;
    const bottom = size - shape.firstNonEmpty(s, 'Bottom') - 1 + s.top;
    return inBounds(right, bottom, left);
  },
  toOccupied: (s: ShapeState, occupied: number[]) => {
    const matrix = rotations[s.type][s.index];
    const next = [...occupied];
    matrix.forEach((row, col) => {
      row.forEach((v, i) => {
        if (inBounds(s.left + i, s.top + col, s.left + i) && s.top + col >= 0)
          next[(s.top + col) * 10 + (s.left + i)] += v;
      });
    });
    return next;
  },
  isOverlapping: (s: ShapeState, occupied: number[]) => {
    const next = shape.toOccupied(s, occupied);
    return !!next.find((v) => v > 1);
  },
  isInValidPosition: (s: ShapeState, occupied: number[]) =>
    shape.isInBounds(s) && !shape.isOverlapping(s, occupied),
};

export interface GameState {
  timer: number;
  // Can use: https://editor.p5js.org/AntonSidorov/sketches/plMj_fAVj to preview
  occupied: number[];
  rendered: number[];
  current?: ShapeState;
  next?: ShapeState;
  score: number;
  dead: boolean;
}

export const isValidAfterMove = (state: GameState): boolean => {
  return false;
};

export const parse = {
  shape: (a: string): [Shape, number] | undefined => {
    const result = REGEX_SHAPE.exec(a);
    if (!result) return undefined;
    return [result[1] as Shape, +result[2]];
  },
  move: (a: string): Move | undefined => {
    const result = REGEX_MOVE.exec(a);
    return result ? (result[0] as Move) : undefined;
  },
};

export const checkClears = ({ occupied, score, ...rest }: GameState) => {
  // check each line ascending -
  // scores: 40, 100, 300, 1200
  occupied = [...occupied];
  const scoreMap = [0, 40, 100, 300, 1200];
  const selectLine = (l: number) => occupied.filter((v, i) => ~~(i / 10) === l);
  const allFilled = (line: number[]) =>
    line.find((v) => v === 0) === undefined ? 1 : 0;
  const filledLines = Array(20)
    .fill(0)
    .map((_, i) => allFilled(selectLine(i)));
  const numFilled = filledLines.filter((v) => v === 1).length;
  if (numFilled >= scoreMap.length)
    throw new Error(
      `Cleared ${numFilled} lines in one go. This should be impossible`
    );

  if (numFilled) {
    const remainingLines = filledLines
      .map((v, i) => (v ? [] : occupied.slice(i * 10, (i + 1) * 10)))
      .reduce((acc, v) => [...acc, ...v], []);
    occupied = [...Array<number>(numFilled * 10).fill(0), ...remainingLines];
  }

  return {
    occupied,
    score: score + scoreMap[numFilled],
    ...rest,
    rendered: occupied,
  };
};

export const makeMove = (
  { timer, occupied, current, score, rendered, dead, next }: GameState,
  input: string
): GameState => {
  if (dead) return { timer, occupied, current, next, score, rendered, dead };

  current = shape.clone(current);

  const [spawn, move] = [parse.shape(input), parse.move(input)];
  if (!spawn && !move) throw new Error(`Incorrect move specified: ${input}`);

  if (spawn) {
    if (!current) {
      current = shape.spawn(...spawn);
      return { timer, occupied, current, next, score, rendered, dead };
    } else {
      next = shape.spawn(...spawn);
      return { timer, occupied, current, next, score, rendered, dead };
    }
  }
  if (!current) {
    current = next;
    next = undefined;
    if (!current)
      throw new Error('There is no current shape and none was provided');
  }

  timer -= 1;
  switch (move) {
    case 'M':
      current.left -= 1;
      if (!shape.isInValidPosition(current, occupied)) current.left += 1;
      break;
    case 'P':
      current.left += 1;
      if (!shape.isInValidPosition(current, occupied)) current.left -= 1;
      break;
    case 'R':
      current = shape.rotate(current, true);
      // Wall kick if rotation didn't work
      if (!shape.isInValidPosition(current, occupied)) {
        if (
          shape.isInValidPosition(
            { ...current, left: current.left - 1 },
            occupied
          )
        )
          current.left -= 1;
        else if (
          shape.isInValidPosition(
            { ...current, left: current.left + 1 },
            occupied
          )
        )
          current.left += 1;
        if (!shape.isInValidPosition(current, occupied))
          current = shape.rotate(current, false);
      }
      break;
    case 'C':
      current = shape.rotate(current, false);
      // Wall kick if rotation didn't work
      if (!shape.isInValidPosition(current, occupied)) {
        if (
          shape.isInValidPosition(
            { ...current, left: current.left - 1 },
            occupied
          )
        )
          current.left -= 1;
        else if (
          shape.isInValidPosition(
            { ...current, left: current.left + 1 },
            occupied
          )
        )
          current.left += 1;
        if (!shape.isInValidPosition(current, occupied))
          current = shape.rotate(current, true);
      }
      break;
    case 'H':
      timer = 5;
      while (true) {
        if (!shape.isInValidPosition(current, occupied)) break;
        current.top += 1;
      }
      break;
    default:
      break;
  }

  if (timer < 1 || move === 'D') {
    timer = 5;
    current.top += 1;
  }
  if (!shape.isInValidPosition(current, occupied)) {
    // Move the shape back up to where it should actually be - then check if game over
    current.top--;
    const dead = shape.firstNonEmpty(current, 'Top') + current.top < 0;
    occupied = shape.toOccupied(current, occupied);
    return checkClears({
      timer: 5,
      occupied,
      current: next,
      next: undefined,
      score,
      rendered: occupied,
      dead: dead,
    });
  }
  return {
    timer,
    occupied,
    current,
    next,
    score,
    rendered: shape.toOccupied(current, occupied),
    dead,
  };
};

export type GeneratorState = GameState & { move: string };
export function* viewMoves(
  moves: string
): Generator<GeneratorState, string, GeneratorState> {
  let state: GameState = gameState();
  for (const match of moves.matchAll(REGEX_SHAPE_OR_MOVE_LIST)) {
    state = makeMove(state, match[0]);
    yield { ...state, move: match[0] };
  }
  return moves;
}

export const gameState = () => ({
  occupied: Array(20 * 10).fill(0),
  timer: TIMER,
  score: 0,
  rendered: Array(20 * 10).fill(0),
  dead: false,
});

export class Runner {
  private _state: GameState = gameState();
  get state() {
    return Object.freeze(this._state);
  }

  move(a: string | string[]) {
    if (typeof a === 'string') return (this._state = makeMove(this.state, a));
    a.forEach((v) => this.move(v));
    return this.state;
  }
}
