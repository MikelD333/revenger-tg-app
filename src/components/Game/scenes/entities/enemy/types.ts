import { TTarget } from '@/components/Game/scenes/types'

export type TEnemyProps = {
  scene: Phaser.Scene
  target: TTarget
  x: number
  y: number
  sprite: string
}