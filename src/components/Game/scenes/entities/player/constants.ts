import { PLAYER_ANIMATION_NAMES } from './types'

export const playerAnimations = [
  {
    end: 7,
    name: PLAYER_ANIMATION_NAMES.WALK_LEFT,
    sprite: 'hero',
    start: 0,
  },
  {
    end: 15,
    name: PLAYER_ANIMATION_NAMES.WALK_RIGHT,
    sprite: 'hero',
    start: 8,
  },
  {
    end: 21,
    name: PLAYER_ANIMATION_NAMES.IDLE,
    sprite: 'hero',
    start: 16,
  }
]

export const PLAYER_SPEED = 200
