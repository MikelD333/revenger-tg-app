import { TCursorKeys } from '../../types'
import { ATTACK_OFFSET_VALUE, PLAYER_SPEED, playerAnimations } from './constants'
import { PLAYER_ANIMATION_NAMES, PlayerCreateProps } from './types'
import { isNotNullOrUndef } from '@/helpers/isNotNullOrUndef';

export class Player extends Phaser.Events.EventEmitter {
  private _playerSprite!: Phaser.Physics.Arcade.Sprite
  private _physics!: Phaser.Physics.Arcade.ArcadePhysics
  private _cameras!: Phaser.Cameras.Scene2D.CameraManager
  private _anims!: Phaser.Animations.AnimationManager
  private _lastXDirection: 'left' | 'right' = 'left'
  private _autoattackTimer: Phaser.Time.TimerEvent | null = null

  constructor({ anims, cameras, physics, startX, startY }: PlayerCreateProps) {
    super()

    this._anims = anims
    this._cameras = cameras
    this._physics = physics

    this._playerSprite = this._physics.add.sprite(startX, startY, 'hero')
    this._playerSprite.setCollideWorldBounds(true)
    this._cameras.main.startFollow(this._playerSprite, true, 0.08, 0.08)

    this._createPlayerAnimations()
  }

  addCollider(obstacles: Phaser.Physics.Arcade.StaticGroup) {
    this._physics.add.collider(this._playerSprite, obstacles)
  }

  getCoords() {
    return { x: this._playerSprite.x, y: this._playerSprite.y }
  }

  setIdle() {
    this._playerSprite.anims.play(PLAYER_ANIMATION_NAMES.IDLE)
    this._playerSprite.setVelocity(0)
  }

  startAutoAttack() {
    this._playerSprite.setVelocity(0)
    this._attackAnimation()

    if (!!this._autoattackTimer) {
      this._autoattackTimer.remove()
    }

    this._autoattackTimer = this._playerSprite.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this._attackAnimation()
      },
      callbackScope: this,
      loop: true
    })
  }

  update(bounds: Phaser.Geom.Rectangle, cursorKeys: TCursorKeys) {
    this._initUpdate(bounds)

    if (cursorKeys.left.isDown) {
      this._moveLeft()
    }
    
    if (cursorKeys.right.isDown) {
      this._moveRight()
    }

    if (cursorKeys.up.isDown) {
      this._moveUp()
    }
    
    if (cursorKeys.down.isDown) {
      this._moveDown()
    }
  }

  private _attackAnimation() {
    const attackAnimation = this._lastXDirection === 'left'
    ? PLAYER_ANIMATION_NAMES.ATTACK_LEFT
    : PLAYER_ANIMATION_NAMES.ATTACK_RIGHT

    this._playerSprite.anims.play(attackAnimation, true)
  }

  private _checkLastDirection() {
    if (this._lastXDirection === 'left') {
      this._playerSprite.anims.play(PLAYER_ANIMATION_NAMES.WALK_LEFT, true)
      return
    }

    this._playerSprite.anims.play(PLAYER_ANIMATION_NAMES.WALK_RIGHT, true)
  }

  private _createPlayerAnimations() {
    playerAnimations.map(({ end, name, sprite, start, repeat }) => 
      this._anims.create({
        key: name,
        frames: this._anims.generateFrameNumbers(sprite, { start, end }),
        frameRate: 10,
        repeat: isNotNullOrUndef<number>(repeat) ? repeat : -1
      }))

    this._playerSprite.anims.play(PLAYER_ANIMATION_NAMES.IDLE)

    this._playerSprite.on(
      Phaser.Animations.Events.ANIMATION_UPDATE,
      (animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
        if (
          (animation.key === PLAYER_ANIMATION_NAMES.ATTACK_LEFT
          || animation.key === PLAYER_ANIMATION_NAMES.ATTACK_RIGHT)
          && frame.index === 5
        ) {
          this._spanwAttackSlash()
        }
      }
    )

    this._playerSprite.on(
      Phaser.Animations.Events.ANIMATION_COMPLETE,
      (animation: Phaser.Animations.Animation) => {
        if (
          animation.key === PLAYER_ANIMATION_NAMES.ATTACK_LEFT
          || animation.key === PLAYER_ANIMATION_NAMES.ATTACK_RIGHT
        ) {
          this._playerSprite.anims.play(PLAYER_ANIMATION_NAMES.IDLE)
        }
      }
    )
  }

  private _initUpdate(bounds: Phaser.Geom.Rectangle) {
    this._playerSprite.x = Phaser.Math.Clamp(this._playerSprite.x, bounds.x, bounds.x + bounds.width)
    this._playerSprite.y = Phaser.Math.Clamp(this._playerSprite.y, bounds.y, bounds.y + bounds.height)

    this._playerSprite.setVelocity(0)
  }

  private _moveDown() {
    this._playerSprite.setVelocityY(PLAYER_SPEED)

    this._checkLastDirection()
  }

  private _moveLeft() {
    this._playerSprite.setVelocityX(-PLAYER_SPEED)
    this._playerSprite.anims.play(PLAYER_ANIMATION_NAMES.WALK_LEFT, true)
    this._lastXDirection = 'left'
  }

  private _moveRight() {
    this._playerSprite.setVelocityX(PLAYER_SPEED)
    this._playerSprite.anims.play(PLAYER_ANIMATION_NAMES.WALK_RIGHT, true)
    this._lastXDirection = 'right'
  }

  private _moveUp() {
    this._playerSprite.setVelocityY(-PLAYER_SPEED)

    this._checkLastDirection()
  }

  private _spanwAttackSlash() {
    const offsetX = this._lastXDirection === 'left' ? -ATTACK_OFFSET_VALUE : ATTACK_OFFSET_VALUE
    const slash = this._playerSprite.scene.add.image(
      this._playerSprite.x + offsetX,
      this._playerSprite.y,
      'attack'
    )

    this._playerSprite.scene.physics.add.existing(slash)
  
    slash.setScale(1.2)
    slash.setAlpha(0.8)
  
    if (this._lastXDirection === 'left') {
      slash.setFlipX(true)
    }

    this.emit('spawn-slash', slash)
  
    this._playerSprite.scene.time.delayedCall(200, () => slash.destroy())  
  }
}