import React, { useEffect, useRef } from 'react'
import Phaser from 'phaser'

class MainScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys

  constructor() {
    super('MainScene')
  }

  preload() {
    this.load.image('player', 'assets/player.png')
    // Загрузка других ассетов
  }

  create() {
    this.player = this.physics.add.sprite(400, 300, 'player')

    if (!this.input.keyboard) {
      throw new Error('Keyboard input not available')
    }

    this.cursors = this.input.keyboard.createCursorKeys()
  }

  update() {
    if (!this.player || !this.cursors) return

    const speed = 200
    this.player.setVelocity(0, 0)

    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-speed)
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(speed)
    }

    if (this.cursors.up?.isDown) {
      this.player.setVelocityY(-speed)
    } else if (this.cursors.down?.isDown) {
      this.player.setVelocityY(speed)
    }
  }
}

const PhaserGame: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null)

  useEffect(() => {
    if (gameRef.current) return

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: MainScene,
      parent: 'phaser-container',
    }

    gameRef.current = new Phaser.Game(config)

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  return <div id="phaser-container" style={{ width: '100%', height: '100%' }} />
}

export default PhaserGame