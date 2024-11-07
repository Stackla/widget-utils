import { generateRandomPartitions } from "./masonry.extension"

const SCREEN_SIZE = 1000
const MARGIN = 5

describe("generateRandomPartitions", () => {
  it("should generate random partitions", () => {
    const partitions = generateRandomPartitions(SCREEN_SIZE, MARGIN)
    expect(partitions.length).toBeGreaterThan(0)
  })

  it("should generate partitions that sum up to the screen size", () => {
    const partitions = generateRandomPartitions(SCREEN_SIZE, MARGIN)
    const sum = partitions.reduce((acc, curr) => acc + curr, 0)
    expect(sum).toBeLessThanOrEqual(SCREEN_SIZE)
  })

  it("should generate partitions that are less than or equal to the screen size", () => {
    const partitions = generateRandomPartitions(SCREEN_SIZE, MARGIN)
    const isLessThanScreenSize = partitions.every(partition => partition <= SCREEN_SIZE)
    expect(isLessThanScreenSize).toBe(true)
  })

  it("should generate partitions that are greater or equal to 100", () => {
    const partitions = generateRandomPartitions(SCREEN_SIZE, MARGIN)
    const isGreaterThan150 = partitions.every(partition => partition >= 100)
    expect(isGreaterThan150).toBe(true)
  })
})
