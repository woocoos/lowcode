import * as React from 'react';
import { Component, Fragment } from 'react';
import { common, SettingField } from '@alilc/lowcode-engine';
import { Button, Message } from '@alifd/next';
import { IPublicTypeSetterType, IPublicTypeFieldConfig, IPublicTypeSetterConfig, IPublicModelSettingTarget } from '@alilc/lowcode-types';
import CustomIcon from '../../components/custom-icon';
import Sortable from './sortable';
import './style.less';
const { editorCabin, skeletonCabin } = common;
const { Title } = editorCabin;
const { createSettingFieldView, PopupContext } = skeletonCabin;

interface ArraySetterState {
  items: SettingField[];
  oldValue: String;
}

interface ArraySetterProps {
  value: any[];
  field: SettingField;
  itemSetter?: IPublicTypeSetterType;
  columns?: IPublicTypeFieldConfig[];
  multiValue?: boolean;
  hideDescription?: boolean;
  onChange?: Function;
  extraProps?: { renderFooter?: (options: ArraySetterProps & { onAdd: (val?: {}) => any }) => any }
}

export class ListSetter extends Component<ArraySetterProps, ArraySetterState> {
  state: ArraySetterState = {
    items: [],
    oldValue: ""
  };

  private scrollToLast = false;

  constructor(props: ArraySetterProps) {
    super(props);
    this.state = { items: [], oldValue: '' }
  }

  setStateItems() {
    const { value, field, onChange } = this.props;
    const items: SettingField[] = [];
    const valueLength = value && Array.isArray(value) ? value.length : 0;

    for (let i = 0; i < valueLength; i++) {
      const item = field.createField({
        name: i,
        setter: this.props.itemSetter,
        forceInline: 1,
        extraProps: {
          defaultValue: value[i],
          setValue: this.onItemChange,
        },
      });
      items.push(item);
    }
    onChange?.(value);

    this.setState({ items, oldValue: JSON.stringify(value) })
  }

  /**
   * onItemChange 用于 ArraySetter 的单个 index 下的数据发生变化，
   * 因此 target.path 的数据格式必定为 [propName1, propName2, arrayIndex, key?]。
   *
   * @param target
   * @param value
   */
  onItemChange = (target: IPublicModelSettingTarget) => {
    const targetPath: Array<string | number> = target?.path;
    if (!targetPath || targetPath.length < 2) {
      console.warn(
        `[ArraySetter] onItemChange 接收的 target.path <${targetPath || 'undefined'
        }> 格式非法需为 [propName, arrayIndex, key?]`,
      );
      return;
    }
    const { field, value: fieldValue } = this.props;
    const { items } = this.state;
    const { path } = field;
    if (path[0] !== targetPath[0]) {
      console.warn(
        `[ArraySetter] field.path[0] !== target.path[0] <${path[0]} !== ${targetPath[0]}>`,
      );
      return;
    }
    try {
      const index = +targetPath[targetPath.length - 2];
      if (typeof index === 'number' && !isNaN(index)) {
        fieldValue[index] = items[index].getValue();
        field?.extraProps?.setValue?.call(field, field, fieldValue);
      }
    } catch (e) {
      console.warn('[ArraySetter] extraProps.setValue failed :', e);
    }
  };

  onSort(sortedIds: Array<string | number>) {
    const { onChange, value: oldValues } = this.props;
    const { items } = this.state;
    const values: any[] = [];
    const newItems: SettingField[] = [];
    sortedIds.map((id, index) => {
      const item = items[+id];
      item.setKey(index);
      values[index] = oldValues[id as any];
      newItems[index] = item;
      return id;
    });
    onChange?.(values);
    this.setState({ items: newItems });
  }

  onAdd(newValue?: { [key: string]: any }) {
    const { items = [] } = this.state;
    const { itemSetter, field, onChange, value = [] } = this.props;
    const values = value || [];
    const initialValue = (itemSetter as any)?.initialValue;
    const defaultValue = newValue ? newValue : (typeof initialValue === 'function' ? initialValue(field) : initialValue);
    const item = field.createField({
      name: items.length,
      setter: itemSetter,
      forceInline: 1,
      extraProps: {
        defaultValue,
        setValue: this.onItemChange,
      },
    });
    items.push(item);
    values.push(defaultValue);
    this.scrollToLast = true;
    onChange?.(values);
    this.setState({ items });
  }

  onRemove(removed: SettingField) {
    const { onChange, value } = this.props;
    const { items } = this.state;
    const values = value || [];
    let i = items.indexOf(removed);
    items.splice(i, 1);
    values.splice(i, 1);
    const l = items.length;
    while (i < l) {
      items[i].setKey(i);
      i++;
    }
    removed.remove();
    const pureValues = values.map((item: any) => typeof (item) === 'object' ? Object.assign({}, item) : item);
    onChange?.(pureValues);
    this.setState({ items });
  }

  componentDidMount(): void {
    this.setStateItems()
  }

  componentDidUpdate(prevProps: Readonly<ArraySetterProps>, prevState: Readonly<ArraySetterState>, snapshot?: any): void {
    if (JSON.stringify(prevProps.value) !== this.state.oldValue) {
      this.setStateItems()
    }
  }

  componentWillUnmount() {
    this.state.items.forEach((field) => {
      field.purge();
    });
  }

  render() {
    const { hideDescription, extraProps = {} } = this.props;
    const { renderFooter } = extraProps;
    let columns: any = null;
    const { items } = this.state;
    const { scrollToLast } = this;
    this.scrollToLast = false;
    if (this.props.columns) {
      columns = this.props.columns.map((column) => (
        <Title key={column.name} title={column.title || (column.name as string)} />
      ));
    }

    const lastIndex = items.length - 1;

    const content =
      items.length > 0 ? (
        <div className="lc-setter-list-scroll-body">
          <Sortable itemClassName="lc-setter-list-card" onSort={this.onSort.bind(this)}>
            {items.map((field, index) => (
              <ArrayItem
                key={index}
                scrollIntoView={scrollToLast && index === lastIndex}
                field={field}
                onRemove={this.onRemove.bind(this, field)}
              />
            ))}
          </Sortable>
        </div>
      ) : (
        <div className="lc-setter-list-notice">
          {this.props.multiValue ? (
            <Message type="warning">当前选择了多个节点，且值不一致，修改会覆盖所有值</Message>
          ) : (
            <Message type="notice" size="medium" shape="inline">
              暂时还没有添加内容
            </Message>
          )}
        </div>
      );

    return (
      <div className="lc-setter-list lc-block-setter">
        {!hideDescription && columns && items.length > 0 ? (
          <div className="lc-setter-list-columns">{columns}</div>
        ) : null}
        {content}
        <div className="lc-setter-list-add">
          {
            !renderFooter ? (
              <Button text type="primary" onClick={() => {
                this.onAdd()
              }}>
                <span>添加一项 +</span>
              </Button>
            ) : renderFooter({ ...this.props, onAdd: this.onAdd.bind(this), })
          }
        </div>
      </div>
    );
  }
}
class ArrayItem extends Component<{
  field: SettingField;
  onRemove: () => void;
  scrollIntoView: boolean;
}> {
  private shell?: HTMLDivElement | null;

  componentDidMount() {
    if (this.props.scrollIntoView && this.shell) {
      this.shell.parentElement!.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  render() {
    const { onRemove, field } = this.props;
    return (
      <div
        className="lc-listitem"
        ref={(ref) => {
          this.shell = ref;
        }}
      >
        <div className="lc-listitem-body">{createSettingFieldView(field, field.parent)}</div>
        <div className="lc-listitem-actions">
          <Button size="small" ghost="light" onClick={onRemove} className="lc-listitem-action">
            <CustomIcon type="icon-ic_delete" />
          </Button>
          <Button draggable size="small" ghost="light" className="lc-listitem-handler">
            <CustomIcon type="icon-ic_drag" />
          </Button>
        </div>
      </div>
    );
  }
}

class TableSetter extends ListSetter {
  // todo:
  // forceInline = 1
  // has more actions
}

export default class ArraySetter extends Component<{
  value: any[];
  field: SettingField;
  itemSetter?: IPublicTypeSetterType;
  mode?: 'popup' | 'list';
  forceInline?: boolean;
  multiValue?: boolean;
}> {
  static contextType = PopupContext;
  private pipe: any;

  render() {
    const { mode, forceInline, ...props } = this.props;
    const { field, itemSetter } = props;
    let columns: IPublicTypeFieldConfig[] | undefined;
    if ((itemSetter as IPublicTypeSetterConfig)?.componentName === 'ObjectSetter') {
      const items: IPublicTypeFieldConfig[] = (itemSetter as any).props?.config?.items;
      if (items && Array.isArray(items)) {
        columns = items.filter(
          (item) => item.isRequired || item.important || (item.setter as any)?.isRequired,
        );
        if (columns.length > 4) {
          columns = columns.slice(0, 4);
        }
      }
    }

    // 新旧长度不一致时会出现undefined需要排除
    if (Array.isArray(props.value)) {
      props.value = props.value.filter(item => item);
    }

    if (mode === 'popup' || forceInline) {
      const title = (
        <Fragment>
          编辑：
          <Title title={field.title} />
        </Fragment>
      );
      if (!this.pipe) {
        let width = 360;
        if (columns) {
          if (columns.length === 3) {
            width = 480;
          } else if (columns.length > 3) {
            width = 600;
          }
        }
        this.pipe = this.context.create({ width });
      }

      this.pipe.send(<TableSetter key={field.id} {...props} columns={columns} />, title);
      return (
        <Button
          type={forceInline ? 'normal' : 'primary'}
          onClick={(e) => {
            this.pipe.show((e as any).target, field.id);
          }}
        >
          <CustomIcon type="icon-bianji" size="small" />
          {forceInline ? title : '编辑数组'}
        </Button>
      );
    } else {
      return <ListSetter  {...props} columns={columns?.slice(0, 4)} />;
    }
  }
}
