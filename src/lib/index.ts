export class Modifier {
  fn: (v: number) => number;

  constructor(fn: (v: number) => number) {
    this.fn = fn;
  }

  apply(v: number): number {
    return this.fn(v)
  }

  wrap(inner: Modifier): Modifier {
    return new Modifier((v) => this.apply(inner.apply(v)))
  }
}

interface Field {
  label: string
}

type NumberField = number & Field;
type BooleanField = boolean & Field;
type EnumLike = Record<string, string | number>;
type EnumSelectField<E extends EnumLike> = E & Field;
type EnumSetField<E extends EnumLike> = [E] & Field;
