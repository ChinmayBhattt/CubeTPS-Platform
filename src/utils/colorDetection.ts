import * as tf from '@tensorflow/tfjs'

interface ColorRange {
  min: [number, number, number]
  max: [number, number, number]
}

const COLOR_RANGES: Record<string, ColorRange> = {
  red: {
    min: [150, 0, 0],
    max: [255, 50, 50]
  },
  green: {
    min: [0, 150, 0],
    max: [50, 255, 50]
  },
  blue: {
    min: [0, 0, 150],
    max: [50, 50, 255]
  },
  white: {
    min: [200, 200, 200],
    max: [255, 255, 255]
  },
  yellow: {
    min: [200, 200, 0],
    max: [255, 255, 50]
  },
  orange: {
    min: [200, 100, 0],
    max: [255, 150, 50]
  }
}

export class ColorDetector {
  private model: tf.LayersModel | null = null

  async initialize() {
    // For now, we'll use a simple color range-based approach
    // In the future, we can load a pre-trained model here
    return Promise.resolve()
  }

  detectColors(imageData: ImageData): Record<string, number> {
    const colorCounts: Record<string, number> = {}
    const data = imageData.data

    // Initialize color counts
    Object.keys(COLOR_RANGES).forEach(color => {
      colorCounts[color] = 0
    })

    // Count pixels matching each color range
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      for (const [color, range] of Object.entries(COLOR_RANGES)) {
        if (
          r >= range.min[0] && r <= range.max[0] &&
          g >= range.min[1] && g <= range.max[1] &&
          b >= range.min[2] && b <= range.max[2]
        ) {
          colorCounts[color]++
          break
        }
      }
    }

    // Convert counts to percentages
    const totalPixels = (imageData.width * imageData.height)
    Object.keys(colorCounts).forEach(color => {
      colorCounts[color] = (colorCounts[color] / totalPixels) * 100
    })

    return colorCounts
  }

  isFaceSolved(faceColors: Record<string, number>): boolean {
    // A face is considered solved if one color dominates (>80%)
    return Object.values(faceColors).some(percentage => percentage > 80)
  }
} 