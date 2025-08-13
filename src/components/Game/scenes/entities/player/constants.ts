import { PLAYER_ANIMATION_NAMES, TPlayerAnimation } from './types'

export const playerAnimations: TPlayerAnimation[] = [
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
  },
  {
    end: 33,
    name: PLAYER_ANIMATION_NAMES.ATTACK_RIGHT,
    sprite: 'hero',
    start: 24,
    repeat: 0
  },
  {
    end: 43,
    name: PLAYER_ANIMATION_NAMES.ATTACK_LEFT,
    sprite: 'hero',
    start: 34,
    repeat: 0
  }
]

export const ATTACK_OFFSET_VALUE = 55

export const PLAYER_SPEED = 200
