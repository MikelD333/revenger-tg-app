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
  }

  create() {
    this.player = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'player')

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
