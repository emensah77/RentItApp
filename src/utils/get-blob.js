const getBlob = async filePath => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
      resolve(xhr.response);
    };

    xhr.onerror = async function (e) {
      const res = await fetch(filePath).catch(err =>
        console.error('An error occured while fetching the data', err),
      );
      if (res && res.ok) {
        return resolve(await res?.blob());
      }
      reject(new Error(`XMLHttpRequest failed. ${e.message}`));
    };

    xhr.responseType = 'blob';
    xhr.open('GET', filePath, true);
    xhr.send(null);
  });
};

export default getBlob;
