import { Enemy } from './enemy/enemy'
import { Player } from './player/player'
import { movementBoundsData } from '../constants'

export class EnemyManager {
  private _scene: Phaser.Scene
  private _enemies: Enemy[] = []
  private _player: Player

  constructor(scene: Phaser.Scene, player: Player) {
    this._scene = scene
    this._player = player

    this._scene.time.addEvent({
      delay: 2000,
      callback: () => this._spawn(),
      loop: true
    })

    this._player.on('spawn-slash', this._onSlashSpawned)
  }

  update() {
    this._enemies.forEach(enemy => {
      enemy.update(this._player.getCoords())
    })
  }

  getAll(): Enemy[] {
    return this._enemies
  }

  private _checkOverlapWith(sprite: Phaser.GameObjects.GameObject, callback: (enemy: Enemy) => void) {
    this._enemies.forEach(enemy => {
      if (
        Phaser.Geom.Intersects.RectangleToRectangle(
          enemy.getBounds(),
          (sprite as Phaser.GameObjects.Image).getBounds()
        )
      ) {
        callback(enemy)
      }
    })
  }

  private _calculateSpawnCoords() {
    const view = this._scene.cameras.main.worldView
    const leftBorder = movementBoundsData.x
    const rightBorder = movementBoundsData.x + movementBoundsData.width
    const y = Phaser.Math.Between(movementBoundsData.y, movementBoundsData.y + movementBoundsData.height)

    if (view.right >= rightBorder) {
      return { x: Phaser.Math.Between(leftBorder, view.left), y }
    }

    if (view.left <= leftBorder) {
      return { x: Phaser.Math.Between(view.right, rightBorder), y }
    }

    const spaces = [
      { x: Phaser.Math.Between(leftBorder, view.left), y },
      { x: Phaser.Math.Between(view.right, rightBorder), y }
    ]

    return spaces[Math.round(Math.random())]
  }

  private _onSlashSpawned = (slash: Phaser.GameObjects.Image) => {
    this._checkOverlapWith(slash, (enemy) => {
      enemy.die(this._player.getCoords(), () => this._enemies.splice(this._enemies.findIndex((en) => en.id === enemy.id), 1))
    })
  }

  private _spawn() {
    const { x, y } = this._calculateSpawnCoords()
    const enemy = new Enemy({ scene: this._scene, sprite: 'bandit', target: this._player.getCoords(), x, y })
    this._enemies.push(enemy)
  }
}