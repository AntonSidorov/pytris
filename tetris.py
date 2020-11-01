import pygame
from pygame.locals import *
from pytris import Tetris, Move
import numpy as np
import sys

# This file implements a python UI for the python version of the code.
CELL_SIZE = 40
WIDTH = CELL_SIZE * 10
HEIGHT = CELL_SIZE * 20
pygame.init()
surface = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Betris")
FPS = pygame.time.Clock()
game = Tetris()
i = 0
while True:
    pygame.display.update()
    for event in pygame.event.get():
        if event.type == QUIT:
            print(game.log)
            pygame.quit()
            sys.exit()

    pressed_keys = pygame.key.get_pressed()
    move = Move.N
    if pressed_keys[K_a]:
        move = Move.M
    elif pressed_keys[K_d]:
        move = Move.P
    elif pressed_keys[K_e]:
        move = Move.R
    elif pressed_keys[K_q]:
        move = Move.C
    elif pressed_keys[K_s]:
        move = Move.D
    elif pressed_keys[K_x]:
        move = Move.H

    if i % 6 < 1:
        game.move(move)

    surface.fill((0, 0, 0))
    for (y, x), v in np.ndenumerate(game.rendered):
        if v:
            pygame.draw.rect(surface, (255, 255, 255), (x * 40, y * 40, 40, 40))
    FPS.tick(60)
    i = (i + 1) % 6
