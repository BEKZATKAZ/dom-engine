export type ObjectPoolParams<T> = {
  initialSize?: number;
  createFunc: () => T;
  returnFunc?: (instance: T) => void;
  requestFunc?: (instance: T) => void;
  destroyFunc?: (instance: T) => void;
};

export class ObjectPool<T> {
  constructor(private readonly params: ObjectPoolParams<T>) {
    for (let i = 0; i < (params.initialSize || 0); i++) {
      this.pooled.push(this.params.createFunc());
    }
  }

  private readonly pooled: T[] = [];

  public request(): T {
    const instance = this.pooled.pop() || this.params.createFunc();
    this.params.requestFunc?.(instance);
    return instance;
  }

  public return(instance: T) {
    this.params.returnFunc?.(instance);
    this.pooled.push(instance);
  }

  public close() {
    if (!this.params.destroyFunc) {
      this.pooled.length = 0;
      return;
    }

    for (const instance of this.pooled) {
      try { this.params.destroyFunc(instance); }
      catch (err) { console.error(err); }
    }

    this.pooled.length = 0;
  }
};
