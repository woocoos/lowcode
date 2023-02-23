import type { IPublicModelPluginContext } from '@alilc/lowcode-types';
import { Button } from 'antd';
import {
  saveSchema, getUrlParams
} from '../../services/mockService';

// 保存功能示例
const PreviewSamplePlugin = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { skeleton, config } = ctx;
      const doPreview = async () => {
        await saveSchema();
        window.open(`./preview.html?path=${getUrlParams().path}`);
      };
      skeleton.add({
        name: 'previewSample',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right',
        },
        content: (
          <Button type="primary" onClick={() => doPreview()}>
            预览
          </Button>
        ),
      });
    },
  };
}
PreviewSamplePlugin.pluginName = 'PreviewSamplePlugin';
PreviewSamplePlugin.meta = {
  dependencies: ['EditorInitPlugin'],
};
export default PreviewSamplePlugin;