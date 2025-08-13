export interface PlayerCreateProps {
  anims: Phaser.Animations.AnimationManager
  cameras: Phaser.Cameras.Scene2D.CameraManager
  physics: Phaser.Physics.Arcade.ArcadePhysics
  startX: number
  startY: number
}

export enum PLAYER_ANIMATION_NAMES {
  IDLE = 'idle',
  WALK_LEFT = 'walk-left',
  WALK_RIGHT = 'walk-right',
  ATTACK_RIGHT = 'attack-right',
  ATTACK_LEFT = 'attack-left'
}

export type TPlayerAnimation = {
  end: number
  name: PLAYER_ANIMATION_NAMES
  sprite: string
  start: number
  repeat?: number
}