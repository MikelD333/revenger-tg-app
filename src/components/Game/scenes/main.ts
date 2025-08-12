import Phaser from 'phaser'
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js'
import { animations, flashlightBoxes } from './constants'

export class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private joystick!: any
  private movementBounds!: Phaser.Geom.Rectangle
  private cursorKeys?: {left: any, right: any, up: any, down: any}

  constructor() {
    super({ key: 'MainScene' })
  }

  preload() {
    this.load.image('player', 'assets/player.png')
    this.load.spritesheet('hero', 'assets/hero_spritesheet.png', { frameWidth: 56, frameHeight: 86, spacing: 2, margin: 2 })
    this.load.image('dojo', 'assets/revenger-dojo.png')
  }

  addFlashLightBoxes() {
    const obstacles = this.physics.add.staticGroup()

    flashlightBoxes.map(({ x, y, width, height }) => {
      const box = this.add.rectangle(x, y, width, height)
      this.physics.add.existing(box, true)
      obstacles.add(box)

      return box
    })

    this.physics.add.collider(this.player, obstacles)
  }

  addBounds() {
    this.movementBounds = new Phaser.Geom.Rectangle(29 + 16, 240, 935, 466)

    this.addFlashLightBoxes()
  }

  createBackgroundAndPlayer() {
    const background = this.add.image(0, 0, 'dojo')
    background.setOrigin(0, 0)
    background.setScrollFactor(1)

    this.cameras.main.setBounds(0, 0, background.width, background.height)
    this.physics.world.setBounds(0, 0, background.width, background.height)

    this.player = this.physics.add.sprite(background.width / 2, background.height / 2, 'hero')
    this.player.setCollideWorldBounds(true)
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08)
  }

  initJoystickPlugin() {
    const plugin = this.plugins.get('rexVirtualJoystick') as VirtualJoystickPlugin | null

    if (!plugin) return
  
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const screenHeight = this.scale.height
  
      if (pointer.y > screenHeight * 2 / 3) {
        if (this.joystick) this.joystick.destroy()

        const base = this.add.circle(0, 0, 50, 0x888888)
        base.setAlpha(0.4)
        const thumb = this.add.circle(0, 0, 25, 0xcccccc)
        thumb.setAlpha(0.4)
  
        this.joystick = plugin.add(this, {
          x: pointer.x,
          y: pointer.y,
          radius: 50,
          base,
          thumb,
          dir: '8dir',
          forceMin: 16,
          enable: true
        })

        this.cursorKeys = this.joystick.createCursorKeys()
      }
    })

  
    this.input.on('pointerup', () => {
      if (this.joystick) {
        this.joystick.destroy()
        this.joystick = null
        this.player.anims.play('idle')
        this.cursorKeys = undefined
        this.player.setVelocity(0)
      }
    })  
  }

  create() {
    this.createBackgroundAndPlayer()

    this.addBounds()

    this.initJoystickPlugin()

    animations.map(({ end, name, sprite, start }) =>
      this.anims.create({
        key: name,
        frames: this.anims.generateFrameNumbers(sprite, { start, end }),
        frameRate: 10,
        repeat: -1
      }))

    // this.anims.create({ key: 'walk-right', frames: this.anims.generateFrameNumbers('hero', { start: 8, end: 15 }), frameRate: 10, repeat: -1 })
    // this.anims.create({ key: 'walk-left', frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 7 }), frameRate: 10, repeat: -1 })
    // this.anims.create({ key: 'idle', frames: this.anims.generateFrameNumbers('hero', { start: 16, end: 21 }), frameRate: 10, repeat: -1 })
  }

  update() {
    const speed = 200
    if (this.joystick) {

      const bounds = this.movementBounds
      this.player.x = Phaser.Math.Clamp(this.player.x, bounds.x, bounds.x + bounds.width)
      this.player.y = Phaser.Math.Clamp(this.player.y, bounds.y, bounds.y + bounds.height)

      this.player.setVelocity(0)

      if (!this.cursorKeys) return
  
      if (this.cursorKeys.left.isDown) {
        this.player.setVelocityX(-speed)
        this.player.anims.play('walk-left', true)
      }
      
      if (this.cursorKeys.right.isDown) {
        this.player.setVelocityX(speed)
        this.player.anims.play('walk-right', true)        
      }
  
      if (this.cursorKeys.up.isDown) {
        this.player.setVelocityY(-speed)
        // this.player.anims.play('walk-right', true)
      }
      
      if (this.cursorKeys.down.isDown) {
        this.player.setVelocityY(speed)
        // this.player.anims.play('walk-left', true)
      }
    }
  }
}
