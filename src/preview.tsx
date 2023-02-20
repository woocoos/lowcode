import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { Spin } from 'antd';
import { buildComponents, AssetLoader, AssetBundle, AssetItem } from '@alilc/lowcode-utils';
import ReactRenderer from '@alilc/lowcode-react-renderer';
import { injectComponents } from '@alilc/lowcode-plugin-inject';
import { createFetchHandler } from '@alilc/lowcode-datasource-fetch-handler'
import { isInIcestark, getMountNode, registerAppEnter, registerAppLeave, getBasename } from '@ice/stark-app';
import { getProjectSchemaFromLocalStorage, getPackagesFromLocalStorage } from './services/mockService';
import './preview.less'

const SamplePreview = (props: {}) => {

  const path = isInIcestark() ? location.pathname.replace(getBasename(), '') : ''
  const [data, setData] = useState<{
    schema: any
    components: any
  }>({
    schema: null,
    components: null,
  });

  async function init() {
    const packages = await getPackagesFromLocalStorage();
    const projectSchema = await getProjectSchemaFromLocalStorage(path);
    const { componentsMap: componentsMapArray, componentsTree } = projectSchema;
    const componentsMap: any = {};
    componentsMapArray?.forEach((component: any) => {
      componentsMap[component.componentName] = component;
    });
    const schema = componentsTree[0];

    const libraryMap: any = {};
    const libraryAsset: string | any[] | AssetBundle | AssetItem | null | undefined = [];
    packages.forEach(({ package: _package, library, urls, renderUrls }) => {
      libraryMap[_package] = library;
      if (renderUrls) {
        libraryAsset.push(renderUrls);
      } else if (urls) {
        libraryAsset.push(urls);
      }
    });

    // const vendors = [assetBundle(libraryAsset, AssetLevel.Library)];

    // TODO asset may cause pollution
    const assetLoader = new AssetLoader();
    await assetLoader.load(libraryAsset);
    const components = await injectComponents(buildComponents(libraryMap, componentsMap, {} as any));

    setData({
      schema,
      components,
    });
  }



  const { schema, components } = data;

  if (!schema || !components) {
    init();
    return <Spin />;
  }

  return (
    <div className="lowcode-preview">
      <ReactRenderer
        className="lowcode-content"
        schema={schema}
        components={components}
        appHelper={{
          requestHandlersMap: {
            fetch: createFetchHandler()
          }
        }}
      />
    </div>
  );
};


// 使用微前端引入
if (isInIcestark()) {
  const mountNode = getMountNode();
  registerAppEnter((props) => {
    ReactDOM.render(<SamplePreview {...props.customProps} />, mountNode);
  });
  // make sure the unmount event is triggered
  registerAppLeave(() => {
    ReactDOM.unmountComponentAtNode(mountNode);
  });
} else {
  ReactDOM.render(<SamplePreview />, document.getElementById('ice-container'));
}