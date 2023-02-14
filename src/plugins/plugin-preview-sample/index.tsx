import { ILowCodePluginContext } from '@alilc/lowcode-engine';
import { Button } from '@alifd/next';
import {
  saveSchema, getUrlParams
} from '../../services/mockService';

// 保存功能示例
const PreviewSamplePlugin = (ctx: ILowCodePluginContext) => {
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