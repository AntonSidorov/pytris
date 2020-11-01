import numpy as np
from misc import Orientation, inBounds
from enum import Enum


class ShapeType(Enum):
    # UNKNOWN = 0
    I = 1
    J = 2
    L = 3
    O = 4
    T = 5
    Z = 6
    S = 7


class Shape(object):
    state: np.ndarray = None
    states = []
    type: ShapeType

    def __init__(self, x: int, y: int, index: int = 0):
        self.states = self.rotations(self.state)
        self.x = x
        self.y = y
        self.index = index

    def __str__(self):
        return "<Shape> \n{{ type: {}, x: {}, y: {}, index: {}, current:\n{}\n}}".format(
            self.type.name, self.x, self.y, self.index, self.current()
        )

    @staticmethod
    def rotations(state: np.ndarray):
        return [state, np.rot90(state, 3), np.rot90(state, 2), np.rot90(state, 1)]

    def rotate(self, clockwise=True):
        self.index = (self.index + len(self.states) + (1 if clockwise else -1)) % len(self.states)

    def size(self):
        return 4 if (self.type == ShapeType.I or self.type == ShapeType.O) else 3

    def current(self):
        return self.states[self.index]

    # Returns a view into self matrix - so that it can be put onto the numpy array properly
    def currentView(self):
        sX, sY, fX, fY = self.boundaries()

        if sY + self.y < 0:
            sY = 0 - self.y
        if fY + self.y < 0:
            fY = 0 - self.y

        return self.current()[sY:fY, sX:fX]

    # TODO: optimise through dynamic programming
    def firstNonEmpty(self, orientation: Orientation):
        size = self.size()
        non_empty = 0
        axis = orientation.axis()
        indices = orientation.iter(size)
        # print([x for x in indices])
        for i in indices:
            arr = np.take(self.current(), i, axis)
            if not np.all(arr == 0):
                return i

    # TODO: optimise through dynamic programming
    def positiveFNE(self, orientation: Orientation):
        size = self.size()
        return self.firstNonEmpty(orientation) + size + 1

    def isInBounds(self):
        size = self.size()
        left = self.firstNonEmpty(Orientation.LEFT) + self.x
        right = size + self.firstNonEmpty(Orientation.RIGHT) + self.x
        bottom = size + self.firstNonEmpty(Orientation.BOTTOM) + self.y
        print(left, right, bottom, self.x, self.y, size)
        return inBounds(right, bottom, left)

    def boundaries(self):
        sX = self.firstNonEmpty(Orientation.LEFT)
        sY = self.firstNonEmpty(Orientation.TOP)
        fX = self.positiveFNE(Orientation.RIGHT)
        fY = self.positiveFNE(Orientation.BOTTOM)
        return np.array((sX, sY, fX, fY), dtype=np.int)

    def occupiedRanges(self):
        coords = self.boundaries() + np.array((self.x, self.y, self.x, self.y))
        coords[coords < 0] = 0
        return coords

    def toOccupied(self, occupied: np.ndarray):
        sX, sY, fX, fY = self.occupiedRanges()
        if np.all(self.currentView() == 0):
            print("no!")
        if occupied[sY:fY, sX:fX].shape != self.currentView().shape:
            print("No!")
        occupied[sY:fY, sX:fX] += self.currentView()

    def willOverlap(self, occupied: np.ndarray):
        sX, sY, fX, fY = self.occupiedRanges()
        print(self.occupiedRanges())
        print(self.currentView())
        if occupied[sY:fY, sX:fX].shape != self.currentView().shape and sY > 0:
            print("No!")
        result = occupied[sY:fY, sX:fX] + self.currentView()
        return result.shape[0] > 0 and np.any(result > 1)

    def willBeValid(self, occupied: np.ndarray):
        return self.isInBounds() and not self.willOverlap(occupied)

    def tryMove(self, occupied: np.ndarray, newX=None, newY=None, newIndex=None):
        if newX is None:
            newX = self.x
        if newY is None:
            newY = self.y
        if newIndex is None:
            newIndex = self.index
        oldX, oldY, oldIndex = self.x, self.y, self.index
        self.x, self.y, self.index = newX, newY, newIndex
        if self.willBeValid(occupied):
            return True
        self.x, self.y, self.index = oldX, oldY, oldIndex
        return False

    def toLog(self):
        return self.type.name + str(self.x)

    @staticmethod
    def spawn(type: ShapeType):
        return shapeTypeMap[type]


class IShape(Shape):
    state = np.zeros((4, 4), dtype=np.int)
    state[2, :] = 1
    type = ShapeType.I


class JShape(Shape):
    state = np.zeros((3, 3), dtype=np.int)
    state[0, 0] = 1
    state[1, :] = 1
    type = ShapeType.J


class LShape(Shape):
    state = np.zeros((3, 3), dtype=np.int)
    state[0, 2] = 1
    state[1, :] = 1
    type = ShapeType.L


class OShape(Shape):
    state = np.zeros((4, 4), dtype=np.int)
    state[1:3, 1:3] = 1
    type = ShapeType.O


class TShape(Shape):
    state = np.zeros((3, 3), dtype=np.int)
    state[0, 1] = 1
    state[1, :] = 1
    type = ShapeType.T


class ZShape(Shape):
    state = np.zeros((3, 3), dtype=np.int)
    state[0, :2] = 1
    state[1, 1:] = 1
    type = ShapeType.Z


class SShape(Shape):
    state = np.zeros((3, 3), dtype=np.int)
    state[0, 1:] = 1
    state[1, :2] = 1
    type = ShapeType.S


shapeTypeMap = {
    ShapeType.I: IShape,
    ShapeType.J: JShape,
    ShapeType.L: LShape,
    ShapeType.O: OShape,
    ShapeType.T: TShape,
    ShapeType.Z: ZShape,
    ShapeType.S: SShape,
}
