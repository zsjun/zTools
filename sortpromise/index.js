// function generatePromiseFunc(index) {
//   return function () {
//     return new Promise((resolve, reject) => {
//       const img
//     });
//   };
// }

// const list = [];

const arr = [
  "https://www.gstatic.com/images/branding/googlelogo/1x/googlelogo_dark_color_188x64dp.png",
  "https://www.gstatic.com/images/icons/material/system/2x/photo_camera_grey600_24dp.png",
  "https://ssl.gstatic.com/ui/v1/zippy/arrow_down.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSl0jubnLjXYANPdwVob_4Xlfm2fpiM4gRjQA_jDjQP0n9NZjwW&usqp=CAU",
  // "5.png",
  // "6.png",
  // "7.png",
  // "8.png",
  // "9.png",
  // "10.png",
  // "11.png",
  // "12.png",
  // "13.png",
  // "14.png",
  // "15.png",
  // "16.png",
  // "17.png",
  // "18.png",
  // "19.png",
  // "20.png",
  // "21.png",
  // "22.png",
  // "23.png",
  // "24.png",
  // "25.png",
  // "26.png",
  // "27.png",
  // "28.png",
  // "29.png",
  // "30.png",
];
function getPromiseArr(arr) {
  let promiseArr = [];
  for (let i = 0; i < arr.length; i++) {
    promiseArr[i] = (url) => {
      return new Promise((rosolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = function () {
          let time1 = -1;
          clearTimeout(time1);
          // 图片加载成功
          console.log(`${url}加载成功`);
          time1 = setTimeout(() => {
            rosolve();
          }, 5000);
        };
        // 在装载图像的过程中发生错误时调用的事件句柄。
        img.onerror = function () {
          reject();
        };
      });
    };
  }
  return promiseArr;
}
// console.log(getPromiseArr(arr));
const list = getPromiseArr(arr);
Promise.prototype.stop = () => {
  return new Promise(function () {});
};
const sortDownload = (arr, list) => {
  for (let i = 0; i < arr.length; i++) {
    return new Promise((resolve, reject) => {
      const promise1 = (index, promiseArr) => {
        // 如果执行完了，则退出
        if (index >= promiseArr.length) {
          resolve();
        } else {
          promiseArr[index](arr[index])
            .then((data) => {
              promise1(index + 1, promiseArr);
            })
            .catch((e) => {
              throw e;
            })
            .stop();
        }
      };
      promise1(0, list);
    });
  }
};
sortDownload(arr, list);
