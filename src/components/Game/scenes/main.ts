import Phaser from 'phaser'
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js'
import { flashlightBoxes, movementBoundsData } from './constants'
import { Player } from './entities/player/player'
import VirtualJoyStick from 'phaser3-rex-plugins/plugins/virtualjoystick'
import { TCursorKeys } from './types'
import { EnemyManager } from './entities/enemy-manager'

export class MainScene extends Phaser.Scene {
  private _player!: Player
  private _enemyManager!: EnemyManager
  private movementBounds!: Phaser.Geom.Rectangle
  private joystick: VirtualJoyStick | null = null
  private cursorKeys: TCursorKeys | null = null


  constructor() {
    super({ key: 'MainScene' })
  }

  preload() {
    this.load.image('player', 'assets/player.png')
    this.load.image('dojo', 'assets/revenger-dojo.png')
    this.load.image('attack', 'assets/attack.png')

    this.load.spritesheet('hero', 'assets/hero_spritesheet.png', { frameWidth: 56, frameHeight: 86, spacing: 2, margin: 2 })

    this.load.atlas('bandit', 'assets/bandit-spritesheet.png', 'assets/bandit.json')
  }

  addFlashLightBoxes() {
    const obstacles = this.physics.add.staticGroup()
  
    flashlightBoxes.map(({ x, y, width, height }) => {
      const box = this.add.rectangle(x, y, width, height)
      this.physics.add.existing(box, true)
      obstacles.add(box)

      return box
    })

    this._player.addCollider(obstacles)
  }

  addBounds() {
    this.movementBounds = new Phaser.Geom.Rectangle(
      movementBoundsData.x,
      movementBoundsData.y,
      movementBoundsData.width,
      movementBoundsData.height
    )

    this.addFlashLightBoxes()
  }

  createBackgroundAndPlayer() {
    const background = this.add.image(0, 0, 'dojo')
    background.setOrigin(0, 0)
    background.setScrollFactor(1)

    this.cameras.main.setBounds(0, 0, background.width, background.height)
    this.physics.world.setBounds(0, 0, background.width, background.height)


    this._player = new Player({
      anims: this.anims,
      cameras: this.cameras,
      physics: this.physics,
      startX: background.width / 2,
      startY: background.width / 2
    })

    this._enemyManager = new EnemyManager(this, this._player)
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
        this._player.startAutoAttack()
        this.cursorKeys = null
      }
    })  
  }

  create() {
    this.createBackgroundAndPlayer()

    this.addBounds()

    this.initJoystickPlugin()
  }

  update() {
    if (!this.joystick || !this.cursorKeys) return

    this._player.update(this.movementBounds, this.cursorKeys)

    this._enemyManager.update()
  }
}
