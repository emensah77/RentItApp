const getBlob = async filePath => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new Error('XMLHttpRequest failed.'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', filePath, true);
    xhr.send(null);
  });
};

export default getBlob;
