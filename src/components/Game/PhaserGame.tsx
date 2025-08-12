import React, { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { config } from './config'

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