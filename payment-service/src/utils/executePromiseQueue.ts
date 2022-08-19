export const executePromiseQueue = (promiseQueue: (() => Promise<any>)[]) => {
  return new Promise((resolve) => {
    const results = [];
    const promise = promiseQueue.reduce((prev, task) => {
      return prev.then((result) => {
        results.push(result);
        return task();
      });
    }, Promise.resolve());

    promise.then(() => {
      resolve(results);
    });
  });
};
