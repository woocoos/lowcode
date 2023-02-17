import { material, project } from '@alilc/lowcode-engine';
import { filterPackages } from '@alilc/lowcode-plugin-inject'
import { message, Modal } from 'antd';
import { TransformStage } from '@alilc/lowcode-types';
import assets from './assets.json';
import schema from './schema.json';
import { save, get } from './indexedDB';

export const getUrlParams = function () {
  const params = {
    path: '/'
  }
  if (location.search) {
    const urlParams = new URLSearchParams(location.search.slice(1));
    params.path = urlParams.get('path') || '/'
  }
  return params
}


export const saveSchema = async (path?: string) => {
  await setProjectSchemaToLocalStorage(path);
  message.success('成功保存到本地');
};

export const resetSchema = async (path?: string) => {
  try {
    await new Promise<void>((resolve, reject) => {
      Modal.confirm({
        content: '确定要重置吗？您所有的修改都将消失！',
        onOk: () => {
          resolve();
        },
        onCancel: () => {
          reject()
        },
      })
    })
  } catch (err) {
    return;
  }

  let defaultSchema = {
    componentsTree: [{ componentName: 'Page', fileName: 'sample' }],
    componentsMap: material.componentsMap,
    version: '1.0.0',
    i18n: {},
  };

  project.getCurrentDocument()?.importSchema(defaultSchema as any);
  project.simulatorHost?.rerender();
  // 重置先不保存
  // await setProjectSchemaToLocalStorage(path);
  message.success('成功重置页面');
}


export const getProjectSchemaFromLocalStorage = async (path?: string) => {
  const data = await get(path || getUrlParams().path)
  return data?.schema || assets.default
}

const setProjectSchemaToLocalStorage = async (path?: string) => {
  const schema = project.exportSchema(TransformStage.Save)
  save({
    path: path || getUrlParams().path,
    schema: JSON.parse(JSON.stringify(schema)),
  })
}

export const getPackagesFromLocalStorage = async () => {
  return await filterPackages(assets.packages);
}

export const getPageSchema = async (path?: string) => {
  const pageSchema = await getProjectSchemaFromLocalStorage(path);

  if (pageSchema) {
    return pageSchema?.componentsTree?.[0];
  }

  return schema;
};
