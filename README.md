# lowcode
结合低代码引擎lowcode-engine实现UI处理。包含编辑引擎和展示运行页


## Installation
```
npm i
```

## Run
```
npm run start
```

## Build
```
npm run Build
```


## Deployment
使用nginx指向build中的下方两个页面
| 文件         | 说明                   | 参数  |
| ------------ | ---------------------- | ----- |
| index.html   | 低代码编辑页面         | path= |
| preview.html | 低代码编辑结果渲染页面 | path= |


## IndexedDB
由于当前站点使用的都是纯网页技术无法使用nodejs fs文件存储功能，因此改为使用浏览器[IndexedDB](#https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)存储

