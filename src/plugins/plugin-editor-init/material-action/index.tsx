import { material } from '@alilc/lowcode-engine';
import type { IPublicModelNode } from '@alilc/lowcode-types';
import { Modal, Select } from 'antd';

const columns = {
    User: [
        { title: 'ID', dataIndex: 'id', valueType: 'text' },
        { title: '昵称', dataIndex: 'name', valueType: 'text' },
        { title: '头像', dataIndex: 'avatar', valueType: 'avatar' },
        { title: '联系信息', dataIndex: 'email', valueType: 'text' },
    ],
    App: [
        { title: 'ID', dataIndex: 'id', valueType: 'text' },
        { title: '名称', dataIndex: 'name', valueType: 'text' },
        { title: '编码', dataIndex: 'code', valueType: 'text' },
    ],
    Org: [
        { title: 'ID', dataIndex: 'id', valueType: 'text' },
        { title: '名称', dataIndex: 'name', valueType: 'text' },
        { title: '编码', dataIndex: 'code', valueType: 'text' },
        { title: '本位币', dataIndex: 'currency', valueType: 'text' },
        { title: '时区', dataIndex: 'tz', valueType: 'text' },
    ]
}

const ColumnsModalContent = (model: { value: any; }) => {
    const options: { value: any, label: string }[] = Object.keys(columns).map(key => ({ value: key, label: key }))
    return (
        <Select
            showSearch
            placeholder="请选择"
            onChange={(value) => {
                model.value = value
            }}
            options={options}
            style={{ width: '100%' }}
        />
    )

}

const CustomMaterialAction = () => {
    material.addBuiltinComponentAction({
        name: 'myIconName',
        content: {
            icon: () => 'D',
            title: '数据帮助加载',
            action(node: IPublicModelNode) {
                const model = {
                    value: null
                }
                Modal.confirm({
                    title: "初始化表格列数据",
                    icon: (<></>),
                    content: ColumnsModalContent(model),
                    onOk: (close) => {
                        if (model.value && columns[model.value]) {
                            node.setPropValue('columns', columns[model.value])
                        }
                        close();
                    }
                })
            }
        },
        important: true,
        condition: (currentNode: IPublicModelNode) => {
            return ['ProTable'].includes(currentNode.componentName);
        },
    });
}

export default CustomMaterialAction;
