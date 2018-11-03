/** 延迟执行定时任务 */
export default class Timer {
  constructor(time) {
    this.timeoutId = null;
    this.time = time || 1000; // 默认延迟1000毫秒
  }

  /** 清除延迟任务 */
  clear = () => {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  };

  /** 设置延迟任务，会先清除当前任务 */
  delay = (func, time) => {
    this.clear();

    const milliseconds = time || this.time;
    this.timeoutId = setTimeout(func, milliseconds);
  };
}
