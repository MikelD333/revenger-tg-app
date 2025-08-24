import { Enemy } from '@/components/Game/scenes/entities/enemy/enemy'
import { type TEnemyProps } from '@/components/Game/scenes/entities/enemy/types'

export class Bandit extends Enemy {
  constructor(props: TEnemyProps) {
    super(props)
  }
}