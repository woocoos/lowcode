import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import { isInIcestark, getMountNode, registerAppEnter, registerAppLeave, getBasename } from '@ice/stark-app';
import { init } from '@alilc/lowcode-engine';
import lowcodeEnginePlugins from './plugins';
import { createFetchHandler } from '@alilc/lowcode-datasource-fetch-handler'
import 'antd/dist/antd.css'
import './global.less';

const App = () => {

  const start = async () => {
    
    await lowcodeEnginePlugins()

    /**
     * options 配置参考
     * https://github.com/alibaba/lowcode-engine/blob/main/packages/types/src/shell/type/engine-options.ts
     */
    init(document.getElementById('lce-container')!, {
      // locale: 'zh-CN',
      enableCondition: true,
      enableCanvasLock: true,
      // 默认绑定变量
      supportVariableGlobally: true,
      // simulatorUrl 在当 engine-core.js 同一个父路径下时是不需要配置的！！！
      requestHandlersMap: {
        fetch: createFetchHandler()
      },
    });
  }

  useEffect(() => {
    start()
  }, [])

  return (<div id="lce-container"></div>)
}

// 使用微前端引入
if (isInIcestark()) {
  const mountNode = getMountNode();
  registerAppEnter((props) => {
    ReactDOM.render(<App {...props.customProps} />, mountNode);
  });
  // make sure the unmount event is triggered
  registerAppLeave(() => {
    ReactDOM.unmountComponentAtNode(mountNode);
  });
} else {
  ReactDOM.render(<App />, document.getElementById('lce-app'));
}