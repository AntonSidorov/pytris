import {
  shape,
  Shape,
  ShapeState,
  GameState,
  makeMove,
  Runner,
} from './machine';

const makeShapeMaker = (type: Shape) => (override?: Partial<ShapeState>) => ({
  ...shape.spawn(type),
  ...override,
});

const ns = (num: number, n: number): number[] => Array(num).fill(n);
const zeros = (num: number) => ns(num, 0);
const ones = (num: number) => ns(num, 1);
const sequence = (...nums: number[][]) =>
  nums.reduce((acc, v) => [...acc, ...v], []);

describe('I', () => {
  const s = makeShapeMaker('I');
  describe('side', () => {
    describe('no rotation', () => {
      test('left', () => expect(shape.side(s(), 'Left')).toEqual([0, 0, 1, 0]));
      test('top', () => expect(shape.side(s(), 'Top')).toEqual([0, 0, 0, 0]));
      test('right', () =>
        expect(shape.side(s(), 'Right')).toEqual([0, 0, 1, 0]));
      test('bottom 0', () =>
        expect(shape.side(s(), 'Bottom')).toEqual([0, 0, 0, 0]));
      test('bottom 1', () =>
        expect(shape.side(s(), 'Bottom', 1)).toEqual([1, 1, 1, 1]));
    });
  });

  describe('nonEmpty', () => {
    describe('no rotation', () => {
      test('left', () => expect(shape.firstNonEmpty(s(), 'Left')).toBe(0));
      test('top', () => expect(shape.firstNonEmpty(s(), 'Top')).toBe(2));
      test('right', () => expect(shape.firstNonEmpty(s(), 'Right')).toBe(0));
      test('bottom', () => expect(shape.firstNonEmpty(s(), 'Bottom')).toBe(1));
    });
  });

  describe('isInBounds', () => {
    test('default = true', () => expect(shape.isInBounds(s())).toBe(true));
    describe('left bound', () => {
      describe('rotatio0', () => {
        test('middle okay', () =>
          expect(shape.isInBounds(s({ left: 3 }))).toBe(true));
        test('borderline okay', () =>
          expect(shape.isInBounds(s({ left: 0 }))).toBe(true));
        test('borderline out', () =>
          expect(shape.isInBounds(s({ left: -1 }))).toBe(false));
        test('far out', () =>
          expect(shape.isInBounds(s({ left: -6 }))).toBe(false));
      });
      describe('rotatio1', () => {
        test('middle okay', () =>
          expect(shape.isInBounds(s({ index: 1, left: 3 }))).toBe(true));
        test('borderline okay', () =>
          expect(shape.isInBounds(s({ index: 1, left: -1 }))).toBe(true));
        test('borderline out', () =>
          expect(shape.isInBounds(s({ index: 1, left: -2 }))).toBe(false));
        test('far out', () =>
          expect(shape.isInBounds(s({ index: 1, left: -6 }))).toBe(false));
      });
    });
    describe('right bound', () => {
      describe('rotatio2', () => {
        test('middle okay', () =>
          expect(shape.isInBounds(s({ index: 2, left: 3 }))).toBe(true));
        test('borderline okay', () =>
          expect(shape.isInBounds(s({ index: 2, left: 6 }))).toBe(true));
        test('borderline out', () =>
          expect(shape.isInBounds(s({ index: 2, left: 7 }))).toBe(false));
        test('far out', () =>
          expect(shape.isInBounds(s({ index: 2, left: 10 }))).toBe(false));
      });
      describe('rotatio1', () => {
        test('middle okay', () =>
          expect(shape.isInBounds(s({ index: 1, left: 3 }))).toBe(true));
        test('borderline okay', () =>
          expect(shape.isInBounds(s({ index: 1, left: 8 }))).toBe(true));
        test('borderline out', () =>
          expect(shape.isInBounds(s({ index: 1, left: 9 }))).toBe(false));
        test('far out', () =>
          expect(shape.isInBounds(s({ index: 1, left: 10 }))).toBe(false));
      });
    });
    describe('top bound', () => {
      describe('no errors whetoo high', () => {
        test('rotatio0', () =>
          expect(shape.isInBounds(s({ top: -5 }))).toBe(true));
        test('rotatio1', () =>
          expect(shape.isInBounds(s({ index: 1, top: -4 }))).toBe(true));
      });
    });
    describe('bottom bound', () => {
      describe('rotatio0', () => {
        test('middle okay', () =>
          expect(shape.isInBounds(s({ top: 10 }))).toBe(true));
        test('borderline okay', () =>
          expect(shape.isInBounds(s({ top: 17 }))).toBe(true));
        test('borderline out', () =>
          expect(shape.isInBounds(s({ top: 18 }))).toBe(false));
        test('far out', () =>
          expect(shape.isInBounds(s({ top: 20 }))).toBe(false));
      });
      describe('rotatio1', () => {
        test('middle okay', () =>
          expect(shape.isInBounds(s({ index: 1, top: 10 }))).toBe(true));
        test('borderline okay', () =>
          expect(shape.isInBounds(s({ index: 1, top: 16 }))).toBe(true));
        test('borderline out', () =>
          expect(shape.isInBounds(s({ index: 1, top: 17 }))).toBe(false));
        test('far out', () =>
          expect(shape.isInBounds(s({ index: 1, top: 20 }))).toBe(false));
      });
    });
  });
});

describe('T', () => {
  const s = makeShapeMaker('T');
  describe('side', () => {
    describe('no rotation', () => {
      test('left', () => expect(shape.side(s(), 'Left')).toEqual([0, 1, 0]));
      test('top 0', () => expect(shape.side(s(), 'Top')).toEqual([0, 1, 0]));
      test('top 1', () => expect(shape.side(s(), 'Top', 1)).toEqual([1, 1, 1]));
      test('right', () => expect(shape.side(s(), 'Right')).toEqual([0, 1, 0]));
      test('bottom', () =>
        expect(shape.side(s(), 'Bottom')).toEqual([0, 0, 0]));
    });
    describe('right rotation', () => {
      test('left', () =>
        expect(shape.side(s({ index: 1 }), 'Left')).toEqual([0, 0, 0]));
      test('top', () =>
        expect(shape.side(s({ index: 1 }), 'Top')).toEqual([0, 1, 0]));
      test('right 0', () =>
        expect(shape.side(s({ index: 1 }), 'Right')).toEqual([0, 1, 0]));
      test('right 1', () =>
        expect(shape.side(s({ index: 1 }), 'Right', 1)).toEqual([1, 1, 1]));
      test('left = right', () =>
        expect(shape.side(s({ index: 1 }), 'Right', 1)).toEqual(
          shape.side(s({ index: 1 }), 'Left', 1)
        ));
      test('bottom', () =>
        expect(shape.side(s({ index: 1 }), 'Bottom')).toEqual([0, 1, 0]));
    });
  });

  describe('nonEmpty', () => {
    describe('no rotation', () => {
      test('left', () => expect(shape.firstNonEmpty(s(), 'Left')).toBe(0));
      test('top', () => expect(shape.firstNonEmpty(s(), 'Top')).toBe(0));
      test('right', () => expect(shape.firstNonEmpty(s(), 'Right')).toBe(0));
      test('bottom', () => expect(shape.firstNonEmpty(s(), 'Bottom')).toBe(1));
    });
    describe('rotatio2', () => {
      test('left', () =>
        expect(shape.firstNonEmpty(s({ index: 2 }), 'Left')).toBe(0));
      test('top', () =>
        expect(shape.firstNonEmpty(s({ index: 2 }), 'Top')).toBe(1));
      test('right', () =>
        expect(shape.firstNonEmpty(s({ index: 2 }), 'Right')).toBe(0));
      test('bottom', () =>
        expect(shape.firstNonEmpty(s({ index: 2 }), 'Bottom')).toBe(0));
    });
  });

  describe('isInBounds', () => {
    test('default = true', () => expect(shape.isInBounds(s())).toBe(true));
    describe('left bound', () => {
      describe('rotatio0', () => {
        test('middle okay', () =>
          expect(shape.isInBounds(s({ left: 3 }))).toBe(true));
        test('borderline okay', () =>
          expect(shape.isInBounds(s({ left: 0 }))).toBe(true));
        test('borderline out', () =>
          expect(shape.isInBounds(s({ left: -1 }))).toBe(false));
        test('far out', () =>
          expect(shape.isInBounds(s({ left: -6 }))).toBe(false));
      });
      describe('rotatio1', () => {
        test('middle okay', () =>
          expect(shape.isInBounds(s({ index: 1, left: 3 }))).toBe(true));
        test('borderline okay', () =>
          expect(shape.isInBounds(s({ index: 1, left: -1 }))).toBe(true));
        test('borderline out', () =>
          expect(shape.isInBounds(s({ index: 1, left: -2 }))).toBe(false));
        test('far out', () =>
          expect(shape.isInBounds(s({ index: 1, left: -6 }))).toBe(false));
      });
    });
    describe('right bound', () => {
      describe('rotatio2', () => {
        test('middle okay', () =>
          expect(shape.isInBounds(s({ index: 2, left: 3 }))).toBe(true));
        test('borderline okay', () =>
          expect(shape.isInBounds(s({ index: 2, left: 7 }))).toBe(true));
        test('borderline out', () =>
          expect(shape.isInBounds(s({ index: 2, left: 8 }))).toBe(false));
        test('far out', () =>
          expect(shape.isInBounds(s({ index: 2, left: 10 }))).toBe(false));
      });
      describe('rotatio3', () => {
        test('middle okay', () =>
          expect(shape.isInBounds(s({ index: 3, left: 3 }))).toBe(true));
        test('borderline okay', () =>
          expect(shape.isInBounds(s({ index: 3, left: 8 }))).toBe(true));
        test('borderline out', () =>
          expect(shape.isInBounds(s({ index: 3, left: 9 }))).toBe(false));
        test('far out', () =>
          expect(shape.isInBounds(s({ index: 3, left: 10 }))).toBe(false));
      });
    });
    describe('top bound', () => {
      describe('no errors whetoo high', () => {
        test('rotatio0', () =>
          expect(shape.isInBounds(s({ top: -5 }))).toBe(true));
        test('rotatio3', () =>
          expect(shape.isInBounds(s({ index: 3, top: -4 }))).toBe(true));
      });
    });
    describe('bottom bound', () => {
      describe('rotatio0', () => {
        test('middle okay', () =>
          expect(shape.isInBounds(s({ top: 10 }))).toBe(true));
        test('borderline okay', () =>
          expect(shape.isInBounds(s({ top: 18 }))).toBe(true));
        test('borderline out', () =>
          expect(shape.isInBounds(s({ top: 19 }))).toBe(false));
        test('far out', () =>
          expect(shape.isInBounds(s({ top: 20 }))).toBe(false));
      });
      describe('rotatio3', () => {
        test('middle okay', () =>
          expect(shape.isInBounds(s({ index: 3, top: 10 }))).toBe(true));
        test('borderline okay', () =>
          expect(shape.isInBounds(s({ index: 3, top: 17 }))).toBe(true));
        test('borderline out', () =>
          expect(shape.isInBounds(s({ index: 3, top: 18 }))).toBe(false));
        test('far out', () =>
          expect(shape.isInBounds(s({ index: 3, top: 20 }))).toBe(false));
      });
    });
  });
});

describe('Z', () => {
  const s = makeShapeMaker('Z');

  describe('isInBounds', () => {
    test('default = true', () => expect(shape.isInBounds(s())).toBe(true));
    describe('left bound', () => {
      describe('rotatio0', () => {
        test('middle okay', () =>
          expect(shape.isInBounds(s({ left: 3 }))).toBe(true));
        test('borderline okay', () =>
          expect(shape.isInBounds(s({ left: 0 }))).toBe(true));
        test('borderline out', () =>
          expect(shape.isInBounds(s({ left: -1 }))).toBe(false));
        test('far out', () =>
          expect(shape.isInBounds(s({ left: -6 }))).toBe(false));
      });
      describe('rotatio1', () => {
        test('middle okay', () =>
          expect(shape.isInBounds(s({ index: 1, left: 3 }))).toBe(true));
        test('borderline okay', () =>
          expect(shape.isInBounds(s({ index: 1, left: -1 }))).toBe(true));
        test('borderline out', () =>
          expect(shape.isInBounds(s({ index: 1, left: -2 }))).toBe(false));
        test('far out', () =>
          expect(shape.isInBounds(s({ index: 1, left: -6 }))).toBe(false));
      });
    });
    describe('right bound', () => {
      describe('rotatio2', () => {
        test('middle okay', () =>
          expect(shape.isInBounds(s({ index: 2, left: 3 }))).toBe(true));
        test('borderline okay', () =>
          expect(shape.isInBounds(s({ index: 2, left: 7 }))).toBe(true));
        test('borderline out', () =>
          expect(shape.isInBounds(s({ index: 2, left: 8 }))).toBe(false));
        test('far out', () =>
          expect(shape.isInBounds(s({ index: 2, left: 10 }))).toBe(false));
      });
      describe('rotatio3', () => {
        test('middle okay', () =>
          expect(shape.isInBounds(s({ index: 3, left: 3 }))).toBe(true));
        test('borderline okay', () =>
          expect(shape.isInBounds(s({ index: 3, left: 8 }))).toBe(true));
        test('borderline out', () =>
          expect(shape.isInBounds(s({ index: 3, left: 9 }))).toBe(false));
        test('far out', () =>
          expect(shape.isInBounds(s({ index: 3, left: 10 }))).toBe(false));
      });
    });
    describe('top bound', () => {
      describe('no errors whetoo high', () => {
        test('rotatio0', () =>
          expect(shape.isInBounds(s({ top: -5 }))).toBe(true));
        test('rotatio3', () =>
          expect(shape.isInBounds(s({ index: 3, top: -4 }))).toBe(true));
      });
    });
    describe('bottom bound', () => {
      describe('rotatio0', () => {
        test('middle okay', () =>
          expect(shape.isInBounds(s({ top: 10 }))).toBe(true));
        test('borderline okay', () =>
          expect(shape.isInBounds(s({ top: 18 }))).toBe(true));
        test('borderline out', () =>
          expect(shape.isInBounds(s({ top: 19 }))).toBe(false));
        test('far out', () =>
          expect(shape.isInBounds(s({ top: 20 }))).toBe(false));
      });
      describe('rotatio3', () => {
        test('middle okay', () =>
          expect(shape.isInBounds(s({ index: 3, top: 10 }))).toBe(true));
        test('borderline okay', () =>
          expect(shape.isInBounds(s({ index: 3, top: 17 }))).toBe(true));
        test('borderline out', () =>
          expect(shape.isInBounds(s({ index: 3, top: 18 }))).toBe(false));
        test('far out', () =>
          expect(shape.isInBounds(s({ index: 3, top: 20 }))).toBe(false));
      });
    });
  });
});

describe('toOccupied', () => {
  const s = makeShapeMaker('I');
  const occupied = zeros(20 * 10);
  test('test 1', () => {
    const next = shape.toOccupied(s({ index: 1, top: 1 }), occupied);
    expect(next).toEqual(
      sequence(
        zeros(10),
        [0, 1, 0, 0, ...zeros(6)],
        [0, 1, 0, 0, ...zeros(6)],
        [0, 1, 0, 0, ...zeros(6)],
        [0, 1, 0, 0, ...zeros(6)],
        zeros(15 * 10)
      )
    );
    const superNext = shape.toOccupied(s({ index: 0, left: 1, top: 0 }), next);
    expect(superNext).toEqual(
      sequence(
        zeros(10),
        [0, 1, 0, 0, ...zeros(6)],
        [0, 2, 1, 1, 1, ...zeros(5)],
        [0, 1, 0, 0, ...zeros(6)],
        [0, 1, 0, 0, ...zeros(6)],
        zeros(15 * 10)
      )
    );
  });
});

describe('isOverlapping', () => {
  const s = makeShapeMaker('I');
  test('overlap = true', () => {
    const overlap = shape.isOverlapping(
      s({ index: 0, left: 1, top: 0 }),
      shape.toOccupied(s({ index: 1, top: 1 }), zeros(20 * 10))
    );
    expect(overlap).toBe(true);
  });
  test('overlap = false', () => {
    const overlap = shape.isOverlapping(
      s({ index: 0, left: 1, top: 0 }),
      shape.toOccupied(s({ index: 1, top: 4 }), zeros(20 * 10))
    );
    expect(overlap).toBe(false);
  });
});

describe('makeMove', () => {
  describe('Spawning should not cause items to fall', () => {});

  describe('Spawning + hard lock tests', () => {
    test('Simple drop 1', () => {
      const r = new Runner();
      expect(r.move('T H'.split(' ')).occupied).toEqual(
        // prettier-ignore
        sequence(
        zeros(18 * 10),
        [0, 1, 0], zeros(7),
        [1, 1, 1], zeros(7),
      )
      );
    });
    test('Simple drop 2', () => {
      const r = new Runner();
      expect(r.move('T H'.split(' ')).occupied).toEqual(
        sequence(zeros(18 * 10), [0, 1, 0], zeros(7), [1, 1, 1], zeros(7))
      );
      expect(r.move('I H'.split(' ')).occupied).toEqual(
        sequence(
          zeros(17 * 10),
          [1, 1, 1, 1],
          zeros(6),
          [0, 1, 0],
          zeros(7),
          [1, 1, 1],
          zeros(7)
        )
      );
    });
    test('Simple drop 3', () => {
      const r = new Runner();
      r.move('T H I2 R H'.split(' '));
      expect(r.state.occupied).toEqual(
        // prettier-ignore
        sequence(
        zeros(16 * 10),
        [0, 0, 0, 1], zeros(6),
        [0, 0, 0, 1], zeros(6),
        [0, 1, 0, 1], zeros(6),
        [1, 1, 1, 1], zeros(6),
      )
      );
    });
    test('test 4', () => {
      const r = new Runner();
      r.move('T H T H T H T H T H T H T H T H T H T H T N'.split(' '));
      expect(true).toBeTruthy();
    });
    test('test 5', () => {
      const r = new Runner();
      r.move('I H I4 H L7 R H'.split(' '));
      expect(r.state.score).toBe(40);
    });
  });
});

describe('gameStates', () => {
  describe('Game over tests', () => {
    test('Part 1', () => {
      const r = new Runner();
      r.move('T0 H I4 H'.split(' '));
      expect(r.state.dead).toBe(false);
    });
    test('Part 2', () => {
      const r = new Runner();
      r.move('I9 O8 N'.split(' '));
      expect(r.state.dead).toBe(true);
    });
    describe('Bullshit deaths', () => {
      test('Will not die', () => {
        const r = new Runner();
        r.move(
          'Z0 J2 O5 N Z1 N N N N N N N N N N H S2 N N N N N N H L3 N N N N N N N N H J1 N N N N N H I2 N N N N H J5 N'.split(
            ' '
          )
        );
        expect(r.state.rendered.find((v) => v > 1)).toBe(undefined);
        expect(r.state.dead).toBe(false);
      });
      test('Will not die obviously', () => {
        const r = new Runner();
        r.move('O5 Z1 H S2 H L3 H J1 I2 H J5 N'.split(' '));
        expect(r.state.dead).toBe(false);
      });
    });
  });
});

describe('line clearing tests', () => {
  const t = (sequence: string, result: number[]) => {
    const r = new Runner();
    r.move(sequence.split(' '));
    expect(r.state.dead).toBe(false);
    console.log(JSON.stringify(r.state.rendered));
    console.log(JSON.stringify(result));
    expect(r.state.rendered).toEqual(result);
  };
  t('I H I4 H Z7 H', sequence(zeros(19 * 10), zeros(7), [1, 1, 0]));
  t(
    'I H I4 H T H T3 H Z5 H Z1 H L7 C H L R R H I9 R H',
    sequence(
      zeros(17 * 10),
      [...ones(3), ...zeros(7)],
      [...ones(3), ...zeros(6), 1],
      [0, ...ones(9)]
    )
  );
});
