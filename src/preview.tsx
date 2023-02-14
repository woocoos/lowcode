import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import { Loading } from '@alifd/next';
import { buildComponents, AssetLoader, AssetBundle, AssetItem } from '@alilc/lowcode-utils';
import ReactRenderer from '@alilc/lowcode-react-renderer';
import { injectComponents } from '@alilc/lowcode-plugin-inject';
import { createFetchHandler } from '@alilc/lowcode-datasource-fetch-handler'
import { isInIcestark, getMountNode, registerAppEnter, registerAppLeave } from '@ice/stark-app';
import { getProjectSchemaFromLocalStorage, getPackagesFromLocalStorage } from './services/mockService';
import './preview.less'

const SamplePreview = (props: {
}) => {
  const [data, setData] = useState({});

  async function init() {
    const packages = await getPackagesFromLocalStorage();
    const projectSchema = await getProjectSchemaFromLocalStorage();
    const { componentsMap: componentsMapArray, componentsTree } = projectSchema;
    const componentsMap: any = {};
    componentsMapArray?.forEach((component: any) => {
      componentsMap[component.componentName] = component;
    });
    const schema = componentsTree[0];

    const libraryMap = {};
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
    const components = await injectComponents(buildComponents(libraryMap, componentsMap));

    setData({
      schema,
      components,
    });
  }



  const { schema, components } = data;

  if (!schema || !components) {
    init();
    return <Loading fullScreen />;
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