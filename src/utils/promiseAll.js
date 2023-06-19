const promiseAll = async (callback, array, i = 0) => {
  if (array.length === 0) {
    return;
  }

  const canContinue = await callback(array[i], i);
  if (canContinue !== false && array[i + 1]) {
    await promiseAll(callback, array, i + 1);
  }
};

export default promiseAll;
