import { material } from '@alilc/lowcode-engine';
import { IPublicModelNode } from '@alilc/lowcode-types';

const CustomMaterialAction = () => {
    material.addBuiltinComponentAction({
        name: 'myIconName',
        content: {
            icon: () => 'Ⅰ',
            title: '数据帮助加载',
            action(node: IPublicModelNode) {
                // 异步加载数据后设置到表格列
                const columns = [
                    { title: 'ID', dataIndex: 'id', valueType: 'text' },
                    { title: '名称1', dataIndex: 'nickname', valueType: 'text' },
                    { title: '名称1', dataIndex: 'nickname', valueType: 'text' },
                    { title: '名称1', dataIndex: 'nickname', valueType: 'text' },
                    { title: '名称1', dataIndex: 'nickname', valueType: 'text' },
                    { title: '名称1', dataIndex: 'nickname', valueType: 'text' },
                    { title: '名称1', dataIndex: 'nickname', valueType: 'text' },
                    { title: '名称1', dataIndex: 'nickname', valueType: 'text' },
                    { title: '名称1', dataIndex: 'nickname', valueType: 'text' },
                    { title: '头像', dataIndex: 'avatar', valueType: 'avatar' },
                ]
                node.setPropValue('columns', columns)
            }
        },
        important: true,
        condition: (currentNode: IPublicModelNode) => {
            return ['ProTable'].includes(currentNode.componentName);
        },
    });
}

export default CustomMaterialAction;
