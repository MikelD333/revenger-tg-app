import { v4 as uuidv4 } from 'uuid'
import { TEnemyProps } from './types'
import { TTarget } from '@/components/Game/scenes/types'

export class Enemy {
  private _sprite!: Phaser.Physics.Arcade.Sprite
  private _currentAnimKey: string | null = null
  private _id!: string

  constructor({ scene, sprite, x, y }: TEnemyProps) {
    this._sprite = scene.physics.add.sprite(x, y, sprite)
    this._sprite.setCollideWorldBounds(true)
    this._id = uuidv4()

    this._createAnimations(scene, sprite)
  }

  get id() {
    return this._id
  }

  update(target: TTarget) {
    const dx = target.x - this._sprite.x
    const dy = target.y - this._sprite.y
    const angle = Math.atan2(dy, dx)
    const speed = 60

    this._sprite.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed)

    this._playAnimation(dx, dy)
  }

  getBounds() {
    return this._sprite.getBounds()
  }

  hurt() {}

  die(target: TTarget, callback: () => void) {
    const dx = target.x - this._sprite.x
    const dy = target.y - this._sprite.y

    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)
  
    let newAnimKey = ''
  
    if (absDx > absDy) {
      newAnimKey = dx < 0 ? 'bandit-die-left' : 'bandit-die-right'
    }
  
    if (this._currentAnimKey !== newAnimKey) {
      this._sprite.anims.play(newAnimKey, true)
      this._currentAnimKey = newAnimKey

      this._sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, callback)
    }
  }

  private _createAnimations(scene: Phaser.Scene, spriteName: string) {
    scene.anims.create({
      key: 'bandit-walk-left',
      frames: scene.anims.generateFrameNames(spriteName, { prefix: 'walk-left-', start: 1, end: 10 }),
      frameRate: 8,
      repeat: -1 
    })

    scene.anims.create({
      key: 'bandit-walk-right',
      frames: scene.anims.generateFrameNames(spriteName, { prefix: 'walk-right-', start: 1, end: 10 }),
      frameRate: 8,
      repeat: -1
    })

    scene.anims.create({
      key: 'bandit-hurt-left',
      frames: scene.anims.generateFrameNames(spriteName, { prefix: 'hurt-left-', start: 1, end: 3 }),
      frameRate: 8,
      repeat: -1
    })

    scene.anims.create({
      key: 'bandit-hurt-right',
      frames: scene.anims.generateFrameNames(spriteName, { prefix: 'hurt-right-', start: 1, end: 3 }),
      frameRate: 8,
      repeat: -1
    })

    scene.anims.create({
      key: 'bandit-die-right',
      frames: scene.anims.generateFrameNames(spriteName, { prefix: 'die-right-', start: 1, end: 3 }),
      frameRate: 8,
      repeat: -1
    })

    scene.anims.create({
      key: 'bandit-die-left',
      frames: scene.anims.generateFrameNames(spriteName, { prefix: 'die-left-', start: 1, end: 3 }),
      frameRate: 8,
      repeat: -1
    })
  }

  private _playAnimation(dx: number, dy: number) {
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)
  
    let newAnimKey = ''
  
    if (absDx > absDy) {
      newAnimKey = dx < 0 ? 'bandit-walk-left' : 'bandit-walk-right'
    }
  
    if (this._currentAnimKey !== newAnimKey) {
      this._sprite.anims.play(newAnimKey, true)
      this._currentAnimKey = newAnimKey
    }
  }
}