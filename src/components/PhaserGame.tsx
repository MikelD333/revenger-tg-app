import React, { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js'

const flashlightBoxes = [
  {
    x: 364,
    y: 242,
    width: 32,
    height: 69
  },
  {
    x: 660,
    y: 242,
    width: 32,
    height: 69
  },
  {
    x: 666,
    y: 707,
    width: 32,
    height: 38
  },
  {
    x: 359,
    y: 707,
    width: 32,
    height: 38
  }

]

class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private joystick!: any
  private movementBounds!: Phaser.Geom.Rectangle

  constructor() {
    super({ key: 'MainScene' })
  }

  preload() {
    this.load.image('player', 'assets/player.png')
    this.load.image('dojo', 'assets/revenger-dojo.png')
  }

  addFlashLightBoxes() {
    const obstacles = this.physics.add.staticGroup()

    const boxes = flashlightBoxes.map(({ x, y, width, height }) => {
      const box = this.add.rectangle(x, y, width, height)
      this.physics.add.existing(box, true)
      obstacles.add(box)

      return box
    })

    this.physics.add.collider(this.player, obstacles)

    boxes.forEach((box) =>
      this.add.graphics().lineStyle(1, 0xff0000).strokeRectShape(box.getBounds()))
  }

  addBounds() {
    this.movementBounds = new Phaser.Geom.Rectangle(29 + 16, 240, 935, 466)

    this.addFlashLightBoxes()
  }

  create() {
    const background = this.add.image(0, 0, 'dojo')
    background.setOrigin(0, 0)
    background.setScrollFactor(1)

    this.cameras.main.setBounds(0, 0, background.width, background.height)
    this.physics.world.setBounds(0, 0, background.width, background.height)

    this.player = this.physics.add.sprite(background.width / 2, background.height / 2, 'player')
    this.player.setCollideWorldBounds(true)

    this.addBounds()

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08)

    const joystickPlugin = this.plugins.get('rexVirtualJoystick') as VirtualJoystickPlugin | null

    if (!!joystickPlugin) {
      this.joystick = joystickPlugin.add(this, {
        x: 100,
        y: this.scale.height - 100,
        radius: 50,
        base: this.add.circle(0, 0, 50, 0x888888),
        thumb: this.add.circle(0, 0, 25, 0xcccccc),
        dir: '8dir',
        forceMin: 16,
        enable: true
      })  
    }
  }

  update() {
    const speed = 200
    if (this.joystick) {
      const cursorKeys = this.joystick.createCursorKeys()

      const bounds = this.movementBounds
      this.player.x = Phaser.Math.Clamp(this.player.x, bounds.x, bounds.x + bounds.width)
      this.player.y = Phaser.Math.Clamp(this.player.y, bounds.y, bounds.y + bounds.height)

      this.player.setVelocity(0)
  
      if (cursorKeys.left.isDown) {
        this.player.setVelocityX(-speed)
      } else if (cursorKeys.right.isDown) {
        this.player.setVelocityX(speed)
      }
  
      if (cursorKeys.up.isDown) {
        this.player.setVelocityY(-speed)
      } else if (cursorKeys.down.isDown) {
        this.player.setVelocityY(speed)
      }  
    }
  }
}

const PhaserGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (gameRef.current) return

    const resize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      if (gameRef.current) {
        gameRef.current.scale.resize(width, height)
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: MainScene,
      parent: 'phaser-container',
      plugins: {
        global: [
          {
            key: 'rexVirtualJoystick',
            plugin: VirtualJoystickPlugin,
            start: true
          }
        ]
      }      
    }

    gameRef.current = new Phaser.Game(config)
    window.addEventListener('resize', resize)

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <div id="phaser-container" style={{ width: '100vw', height: '100vh' }} />
}

export default PhaserGame