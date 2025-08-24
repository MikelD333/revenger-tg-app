export enum ANIMATION_NAMES {
  IDLE = 'idle',
  WALK_LEFT = 'walk-left',
  WALK_RIGHT = 'walk-right'
}

export type TCursorKeys = {
  left: Phaser.Input.Keyboard.Key
  right: Phaser.Input.Keyboard.Key
  up: Phaser.Input.Keyboard.Key
  down: Phaser.Input.Keyboard.Key
}

export type TTarget = {
  x: number
  y: number
}