import { init, plugins } from '@alilc/lowcode-engine';
import { createFetchHandler } from '@alilc/lowcode-datasource-fetch-handler'
import EditorInitPlugin from './plugins/plugin-editor-init';
import UndoRedoPlugin from '@alilc/lowcode-plugin-undo-redo';
import ZhEnPlugin from '@alilc/lowcode-plugin-zh-en';
import DataSourcePanePlugin from '@alilc/lowcode-plugin-datasource-pane';
import SchemaPlugin from '@alilc/lowcode-plugin-schema';
import CodeEditorPlugin from "@alilc/lowcode-plugin-code-editor";
import ManualPlugin from "@alilc/lowcode-plugin-manual";
import InjectPlugin from '@alilc/lowcode-plugin-inject';
import SimulatorResizerPlugin from '@alilc/lowcode-plugin-simulator-select';
import ComponentPanelPlugin from './plugins/plugin-component-panel';
import DefaultSettersRegistryPlugin from './plugins/plugin-default-setters-registry';
import SaveSamplePlugin from './plugins/plugin-save-sample';
import PreviewSamplePlugin from './plugins/plugin-preview-sample';
import CustomSetterSamplePlugin from './plugins/plugin-custom-setter-sample';
import SetRefPropPlugin from '@alilc/lowcode-plugin-set-ref-prop';
import LogoSamplePlugin from './plugins/plugin-logo-sample';
import { PluginFormily } from '@seada/antd-plugins'
import 'antd/dist/antd.css'
import './global.less';
import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import { isInIcestark, getMountNode, registerAppEnter, registerAppLeave, getBasename } from '@ice/stark-app';


async function registerPlugins() {
  await plugins.register(InjectPlugin);

  await plugins.register(EditorInitPlugin, {
    scenarioName: 'adminx-ui',
    displayName: 'adminx-ui',
  });

  // 设置内置 setter 和事件绑定、插件绑定面板
  await plugins.register(DefaultSettersRegistryPlugin);

  await plugins.register(LogoSamplePlugin);

  await plugins.register(ComponentPanelPlugin);

  await plugins.register(SchemaPlugin);

  await plugins.register(ManualPlugin);
  // 注册回退/前进
  await plugins.register(UndoRedoPlugin);

  // 注册中英文切换
  await plugins.register(ZhEnPlugin);

  await plugins.register(SetRefPropPlugin);

  await plugins.register(SimulatorResizerPlugin);

  await plugins.register(PluginFormily)

  // 插件参数声明 & 传递，参考：https://lowcode-engine.cn/site/docs/api/plugins#设置插件参数版本示例
  await plugins.register(DataSourcePanePlugin, {
    importPlugins: [],
    dataSourceTypes: [
      {
        type: 'fetch',
      },
      {
        type: 'jsonp',
      }
    ]
  });

  await plugins.register(CodeEditorPlugin);

  await plugins.register(SaveSamplePlugin);

  await plugins.register(PreviewSamplePlugin);

  await plugins.register(CustomSetterSamplePlugin);
};

function App() {

  const start = async () => {

    await registerPlugins();

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
      // 这里因为用的是 alifd cdn，在不同 npm 包，engine-core.js 和 react-simulator-renderer.js 是不同路径
      // simulatorUrl: [
      //   'https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@latest/dist/css/react-simulator-renderer.css',
      //   'https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@latest/dist/js/react-simulator-renderer.js'
      // ],
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