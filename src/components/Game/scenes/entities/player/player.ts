import { TCursorKeys } from '../../types'
import { PLAYER_SPEED, playerAnimations } from './constants'
import { PLAYER_ANIMATION_NAMES, PlayerCreateProps } from './types'

export class Player {
  private _playerSprite!: Phaser.Physics.Arcade.Sprite
  private _physics!: Phaser.Physics.Arcade.ArcadePhysics
  private _cameras!: Phaser.Cameras.Scene2D.CameraManager
  private _anims!: Phaser.Animations.AnimationManager
  private _lastXDirection: 'left' | 'right' = 'left'

  constructor({ anims, cameras, physics, startX, startY }: PlayerCreateProps) {
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

  setIdle() {
    this._playerSprite.anims.play(PLAYER_ANIMATION_NAMES.IDLE)
    this._playerSprite.setVelocity(0)
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

  private _checkLastDirection() {
    if (this._lastXDirection === 'left') {
      this._playerSprite.anims.play(PLAYER_ANIMATION_NAMES.WALK_LEFT, true)
      return
    }

    this._playerSprite.anims.play(PLAYER_ANIMATION_NAMES.WALK_RIGHT, true)
  }

  private _createPlayerAnimations() {
    playerAnimations.map(({ end, name, sprite, start }) => 
      this._anims.create({
        key: name,
        frames: this._anims.generateFrameNumbers(sprite, { start, end }),
        frameRate: 10,
        repeat: -1
      }))

    this._playerSprite.anims.play(PLAYER_ANIMATION_NAMES.IDLE)
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
}