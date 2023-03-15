import { plugins } from '@alilc/lowcode-engine';
import SetRefPropPlugin from '@alilc/lowcode-plugin-set-ref-prop';
import UndoRedoPlugin from '@alilc/lowcode-plugin-undo-redo';
import ZhEnPlugin from '@alilc/lowcode-plugin-zh-en';
import DataSourcePanePlugin from '@alilc/lowcode-plugin-datasource-pane';
import SchemaPlugin from '@alilc/lowcode-plugin-schema';
import CodeEditorPlugin from "@alilc/lowcode-plugin-code-editor";
import InjectPlugin from '@alilc/lowcode-plugin-inject';
import SimulatorResizerPlugin from '@alilc/lowcode-plugin-simulator-select';
import { PluginFormily } from '@seada/antd-plugins'

import EditorInitPlugin from './plugin-editor-init';
import ComponentPanelPlugin from './plugin-component-panel';
import DefaultSettersRegistryPlugin from './plugin-default-setters-registry';
import SaveSamplePlugin from './plugin-save-sample';
import PreviewSamplePlugin from './plugin-preview-sample';
// import LogoSamplePlugin from './plugin-logo-sample';

export default async function () {
    await plugins.register(InjectPlugin);

    await plugins.register(EditorInitPlugin, {
        scenarioName: 'adminx-ui',
        displayName: 'adminx-ui',
    });


    // 设置内置 setter 和事件绑定、插件绑定面板
    await plugins.register(DefaultSettersRegistryPlugin);

    // logo
    // await plugins.register(LogoSamplePlugin);

    await plugins.register(ComponentPanelPlugin);

    // 查看Schema的面板
    await plugins.register(SchemaPlugin);

    // 注册回退/前进
    await plugins.register(UndoRedoPlugin);

    // 注册中英文切换
    await plugins.register(ZhEnPlugin);

    await plugins.register(SetRefPropPlugin);

    // 尺寸选择
    await plugins.register(SimulatorResizerPlugin);

    // await plugins.register(PluginFormily)

    // 数据源 插件参数声明 & 传递，参考：https://lowcode-engine.cn/site/docs/api/plugins#设置插件参数版本示例
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

    // 源码面板
    await plugins.register(CodeEditorPlugin);

    // 保存
    await plugins.register(SaveSamplePlugin);

    // 预览
    await plugins.register(PreviewSamplePlugin);
}