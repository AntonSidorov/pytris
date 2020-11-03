import numpy as np
from .shape import ShapeType, Shape, shapeTypeMap
from .misc import Orientation, Move
import sys

TIMER = 5

class Tetris():
  current: Shape
  next: Shape

  def spawn(self):
    stype = np.random.choice(list(ShapeType))
    shape = shapeTypeMap[stype](0,0)
    sX, sY, fX, fY = shape.boundaries()
    shape.y = -fY
    # 11 because randInt upper bound is exclusive
    shape.x = np.random.randint(-sX, 11 - fX)
    return shape
  def __init__(self):
    self.current = self.spawn()
    self.next = self.spawn()
    self.log = self.current.toLog() + self.next.toLog()
    self.occupied = np.zeros((20,10), dtype=np.int)
    self.rendered = np.zeros((20,10), dtype=np.int)
    self.dead = False
    self.score = 0
    self.timer = TIMER

  def moveMP(self, move: Move):
    assert(move is Move.P or move is move.M)
    v = 1 if move is Move.P else -1
    self.current.x += v
    if(not self.current.willBeValid(self.occupied)):
      self.current.x -= v
    
  def moveRC(self, move: Move):
    assert(move is Move.R or move is move.C)
    clockwise = move is Move.R
    self.current.rotate(clockwise)
    if(not self.current.willBeValid(self.occupied)):
      self.current.x += 1
      if(not self.current.willBeValid(self.occupied)):
        self.current.x -= 2
        if(not self.current.willBeValid(self.occupied)):
          self.current.x += 1
          self.current.rotate(not clockwise)

  def moveH(self, move: Move):
    assert(move is Move.H)  
    self.timer = TIMER
    while(True):
      if(not self.current.willBeValid(self.occupied)):
        break
      self.current.y += 1
  
  def clearLines(self):
    scores = [0, 40, 100, 300, 1200]
    
    cleared = np.all(self.occupied == 1, axis=1)
    clearedNum = np.sum(cleared)
    assert(clearedNum < len(scores))
    if(not clearedNum):
      return
    self.score += scores[clearedNum]
    
    remaining = self.occupied[np.any(self.occupied == 0, axis=1)]
    self.occupied = np.pad(remaining, ((clearedNum,0), (0,0)), constant_values=0)

  def move(self, move: Move):
    assert(not self.dead)
    self.log += move.name
    self.timer -= 1
    map = {
      Move.M: self.moveMP,
      Move.P: self.moveMP,
      Move.R: self.moveRC,
      Move.C: self.moveRC,
      Move.H: self.moveH
    }
    if(map.get(move)):
      map[move](move)
    
    if(self.timer < 1 or move is Move.D):
      self.timer = 5
      self.current.y += 1
    # If the piece is out of bounds - move it back up.
    if(not self.current.willBeValid(self.occupied)):
      # I have no idea how i did this lol
      self.current.y -= 1
      self.timer = 5
      self.dead = self.current.y + self.current.firstNonEmpty(Orientation.TOP) < 0
      self.current.toOccupied(self.occupied)
      self.rendered = np.copy(self.rendered)
      self.current = self.next
      self.next = self.spawn()
      self.log += self.next.toLog()
      self.clearLines()
    self.rendered = np.copy(self.occupied)
    self.current.toOccupied(self.rendered)