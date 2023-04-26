type UnaryFn<T, R> = (arg: T) => R;

const pipe =
  <T, R>(...fns: Array<UnaryFn<any, any>>): UnaryFn<T, R> =>
  (arg: T): R =>
    fns.reduce<any>((args, fn) => fn(args), arg) as R;

export default pipe;
