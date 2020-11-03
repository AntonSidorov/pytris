from enum import Enum

# A bunch of different classes/functions that don't really need their own file name
class Orientation(Enum):
    TOP = 0
    RIGHT = 1
    BOTTOM = 2
    LEFT = 3

    def vertical(self):
        return self.name == "TOP" or self.name == "BOTTOM"

    def horizontal(self):
        return not self.vertical()

    def axis(self):
        return 1 if self.horizontal() else 0

    def ascending(self):
        return self.name == "TOP" or self.name == "LEFT"

    def descending(self):
        return not self.ascending()

    def iter(self, size):
        return range(0, size, 1) if self.ascending() else range(-1, -1 - size, -1)


class Move(Enum):
    D = 0
    M = 1
    P = 2
    R = 3
    C = 4
    H = 5
#    N = 6


def inBounds(right: int, bottom: int, left: int):
    return left >= 0 and right <= 9 and bottom <= 19
