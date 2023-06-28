import Mock from "mockjs";

type DataPoint = number[];

interface InParams {
  duration: number;
  granularity: number;
  update: (data: DataPoint[]) => void;
  min?: number;
  max?: number;
  deltaMin?: number;
  deltaMax?: number;
}

class ThroughputData {
  private duration!: number;
  private granularity!: number;
  private min: number = 400;
  private max: number = 800;
  private deltaMin: number = 4;
  private deltaMax: number = 8;
  private total: number = 0;
  public data: DataPoint[] = [];
  public update: (data: DataPoint[]) => void;
  private timer: NodeJS.Timeout | null = null

  public constructor(params: InParams) {
    this.update = params.update;
    this.initParams(params)
  }

  public init() {
    this.destroy();
    const data = this.getHistory();
    this.data = data;
    this.update(data);
    this.timer = setInterval(() => {
      this.data.push(this.getDataPointItem())
      this.data.shift();
      this.update(this.data);
    }
      , this.granularity)
  }

  public initParams({
    duration,
    granularity,
  }: {
    duration?: number;
    granularity?: number;
  }) {
    this.duration = duration || this.duration;
    this.granularity = granularity || this.granularity;
    this.total = parseInt(this.duration / this.granularity + "", 10);
    this.init();
  }

  public destroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  private formatNumber(num: number | string): number {
    return Number(Number(num).toFixed(2));
  }

  private getDeltaValue = (min: number, max: number): number =>
    Mock.Random.float(min, max, 2, 2);

  private getDataPointItem = () => {
    const deltaValue =
      this.getDeltaValue(this.deltaMin, this.deltaMax) *
      (Math.random() > 0.5 ? 1 : -1);
    const getLastData = (data: DataPoint[]) => {
      const lastData = this.data[data.length - 1];
      return Number(lastData[1]);
    };
    const lastValue = getLastData(this.data);
    // 当最后一个值 + deltaValue > max 或者 < min 时，说明加多了，或者是减少了，需要改变deltaValue的正负值，以保证最后一个值在min和max之间
    if (
      lastValue + deltaValue > this.max ||
      lastValue + deltaValue < this.min
    ) {
      return [Date.now(), lastValue - deltaValue];
    } else {
      return [Date.now(), lastValue + deltaValue];
    }
  };


  private loopCount: number = 0;

  private getLoopCount(): number {
    if (this.loopCount <= 0) {
      this.loopCount = Mock.Random.integer(10, 25);
    }
    return this.loopCount;
  }

  public getHistory(): DataPoint[] {
    const data: DataPoint[] = [];
    // 获取当前时间的时间戳
    const nowTime = new Date().getTime() - 0;
    let startTime = nowTime - this.duration;

    let current = 0;
    // 设定初始值
    let startValue = this.getDeltaValue(this.min, this.max);
    // 为了达到图形走势更逼真（好看），采用的图形走势为 平仄平仄平仄 这种思路
    // 初始权重 在 3-7 之间随机选择一个整数
    let weight = Mock.Random.integer(3, 7);
    while (current < this.total) {
      // 将数据分成长短不一的几等份，但是误差不要太大，太大不好看了
      // 于是这里采取的是 10-25之间的数据为一组
      // 即假如有100 条数据 那么会出现这样的分组 [20,15,13,21,14,17]
      this.getLoopCount();
      // 初始权重会决定 初始是先走增势图 还是减势图
      weight =
        weight > 5 ? Mock.Random.integer(3, 5) : Mock.Random.integer(5, 7);
      while (this.loopCount > 0 && current < this.total) {
        // delta 为每次变化的增量
        const deltaValue =
          this.getDeltaValue(this.deltaMin, this.deltaMax);
        // 变化系数
        let k = 0;
        // 控制数据在 min-max之间
        if (startValue > this.max - this.deltaMax) {
          k = -Mock.Random.integer(3, 5);
        } else if (startValue < this.min + this.deltaMax) {
          k = Mock.Random.integer(3, 5);
        } else {
          // 这里再从1-10间随机一个数值，来取决于在当前这个分组范围内，走势的变化值，即斜率k
          // 比如在上面的初始权重为 7 那么在1-10内再随机一个整数，则在某个分组 如20，在这20个数据里，整个图的走势应该是负的
          // 反之如果权重是3  那么在该范围内，大概率的走势是为正的
          k = Mock.Random.integer(1, 10);
          k = k === weight ? (Mock.Random.boolean() ? 1 : -1) : k - weight;
        }
        startValue += (k > 0 ? 1 : -1) * deltaValue;

        data.push([startTime, this.formatNumber(startValue)]);

        startTime += this.granularity;
        this.loopCount--;
        current++;
      }
    }

    return data;
  }
}

export default ThroughputData;
