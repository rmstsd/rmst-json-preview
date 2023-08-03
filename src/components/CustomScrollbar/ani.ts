export class Ani {
  constructor({ initialValue }) {
    this.currValue = initialValue
  }

  currValue = 0
  private per = 40
  private timer: number

  public getCurr() {
    return this.currValue
  }

  public start(endValue: number, cb: (curr: number) => void) {
    cancelAnimationFrame(this.timer)

    const animate = () => {
      if (endValue === this.currValue) {
        return
      }

      if (endValue > this.currValue) {
        this.currValue += this.per
        if (this.currValue > endValue) {
          this.currValue = endValue
        }
      } else {
        this.currValue -= this.per
        if (this.currValue < endValue) {
          this.currValue = endValue
        }
      }

      cb(this.currValue)

      this.timer = requestAnimationFrame(animate)
    }

    this.timer = requestAnimationFrame(animate)
  }

  public stop() {
    cancelAnimationFrame(this.timer)
  }
}
