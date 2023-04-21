export default async function delayPromise(ms: number) {
  return new Promise((resolve) =>
    // eslint-disable-next-line no-promise-executor-return
    setTimeout(() => {
      resolve(ms);
    }, ms)
  );
}
