import numpy as np

l_str = "====================\n"


def rotations(state: np.ndarray):
    return [state, np.rot90(state, 3), np.rot90(state, 2), np.rot90(state, 1)]


class Shape(object):
    state: np.ndarray = None
    states = []

    def __init__(self, x: int, y: int, index: int = 0):
        self.states = rotations(self.state)
        self.x = x
        self.y = y
        self.index = index

    def __str__(self):
        out = "Shape rotations:\n" + l_str
        for k, v in enumerate(self.states):
            out = out + "[" + ",".join(map(str, v.flatten().tolist())) + "]\n"
        out = out + l_str
        return out


class IShape(Shape):
    state = np.zeros((4, 4), dtype=np.int)
    state[2, :] = 1


class JShape(Shape):
    state = np.zeros((3, 3), dtype=np.int)
    state[2, 0] = 1
    state[:, 1] = 1


class LShape(Shape):
    state = np.zeros((3, 3), dtype=np.int)
    state[2, 2] = 1
    state[:, 1] = 1


class OShape(Shape):
    state = np.zeros((4, 4), dtype=np.int)
    state[1:3, 1:3] = 1


class TShape(Shape):
    state = np.zeros((3, 3), dtype=np.int)
    state[0, 1] = 1
    state[1, :] = 1


class ZShape(Shape):
    state = np.zeros((3, 3), dtype=np.int)
    state[0, :2] = 1
    state[1, 1:] = 1


class SShape(Shape):
    state = np.zeros((3, 3), dtype=np.int)
    state[0, 1:] = 1
    state[1, :2] = 1
