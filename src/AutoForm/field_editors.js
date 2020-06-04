
import React, { useMemo, useCallback } from 'react';
import { Form, Input, Select, Radio, Switch, Checkbox, Tooltip, Cascader } from 'antd';
import { Formik, Field, withFormik, useField } from 'formik';
import classnames from 'classnames';
import styles from './field_editors.less';

const emptyFun = () => { };

/*
  form的css 注意事项
  1. className (FormItem)
  2. editorStyle (输入框)
  3. wrapperStyle (多个FormItem排列外层样式)
*/

// 通常有touched.name&&errors.name的判断
// 这是因为formik在做表单校验的时候，会将全字段都检查一遍
// 不管用户有没有操作，但是对于用户来说
// 通常不希望在还没有操作的字段显示一行错误信息
// 所以需要touched字段查看该字段是否已经操作过，操作过并且有错误，才显示
// 还有一种情况， 必填项没有操作的时候，也要给提示

// <Field />会自动把表单中的输入字段「加入」到Formik系统中。它使用name属性匹配Formik中的状态

const GroupOnBlur = (onBlur, form, fn, name, event) => {
  const { values, errors } = form;
  fn && fn(event);
  name && form.setMyTouched(name, true);
  onBlur && onBlur(values, errors);
}

const FormItemWrap = props => {
  const {
    children, name, label, required, editorStyle,
    className, labelStyle, layout, form: { errors, myTouched, touched },
  } = props;
  
  const hasError = errors[name] && (myTouched[name] || touched[name]);
  return (
    <li className={classnames(styles.editor, styles[layout], className)}>
      {label && (
        <div className={classnames('label', labelStyle)}>
          <label htmlFor={name} className={classnames('labelWord', { 'required': required })}>{label}</label>
          <span className='labelColon'></span>
        </div>
      )}
      <span className={classnames(
        editorStyle,
        { 'errorEditor': !hasError },
        label ? 'normalEditor' : 'fullEditor',
      )}>
        {children}
        {hasError && <div className="errorMsg">{errors[name]}</div>}
      </span>
    </li>
  )
};

// By combining a vanilla <label> plus Formik's <Field> and <ErrorMessage>,
// we can abstract a generic "Fieldset" component for most of our inputs.
const ErrorField = (params) => {
  return (
    <FormItemWrap {...params} >
      <div className="errorTip">Error Can't find editor {params.name}</div>
    </FormItemWrap>
  )
};

// By combining a vanilla <label> plus Formik's <Field> and <ErrorMessage>,
// we can abstract a generic "Fieldset" component for most of our inputs.
const Fieldset = (params) => {
  const { onBlur, placeholder, ...rest } = params;
  return (
    <Field name={rest.name}>
      {({ field, form }) => {
        return (
          <FormItemWrap form={form} {...rest}
            children={
              <input
                {...field}
                placeholder={placeholder}
                onChange={(e) => {
                  form.setMyTouched(rest.name, true);
                  form.setFieldValue(rest.name, e.target.value);
                }}
                onBlur={GroupOnBlur.bind(this, onBlur, form, field.onBlur, '')}
              />
            }
          />
        )
      }}
    </Field>
  )
};

// TextArea autoSize 自适应内容高度，可设置为 true|false 或对象：{ minRows: 2, maxRows: 6 }
const TextareaEditor = (params) => {
  const { onBlur, placeholder, autoSize = false, ...rest } = params;
  return (
    <Field name={rest.name}>
      {({ field, form }) => {
        return (
          <FormItemWrap form={form} {...rest}
            children={
              <Input.TextArea
                {...field}
                autoSize={autoSize}
                placeholder={placeholder}
                onBlur={GroupOnBlur.bind(this, onBlur, form, field.onBlur, '')}
                onChange={(e) => {
                  form.setMyTouched(rest.name, true)
                  form.setFieldValue(rest.name, e.target.value);
                }}
                className={classnames('textarea', { 'hideFlow': autoSize === true })}
              />}
          />
        )
      }}
    </Field>
  )
};

const SwitchEditor = (params) => {
  const { config = {}, ...rest } = params;
  return (
    <Field name={rest.name}>
      {({ field, form }) => {
        return (
          <FormItemWrap form={form} {...rest}>
            <Switch
              {...config}
              defaultChecked={!!field.value}
              checked={!!field.value}
              onChange={(v) => { form.setFieldValue(rest.name, v) }}
            />
          </FormItemWrap>
        )
      }}
    </Field>
  )
};

const CheckBoxEditor = (params) => {
  const { text, config = {}, type, options, ...rest } = params;
  return (
    <Field name={rest.name}>
      {({ field, form }) => {
        return (
          <FormItemWrap form={form}  {...rest}>
            {type === 'checkbox' ? (
              <Checkbox
                {...config}
                {...field}
                checked={!!field.value}
                defaultChecked={!!field.value}
                onChange={(e) => { form.setFieldValue(rest.name, e.target.checked) }}
              >
                {text}
              </Checkbox>
            ) : (
                <Checkbox.Group
                  {...config}
                  {...field}
                  value={field.value}
                  defaultValue={field.value}
                  onChange={(e) => {
                    form.setFieldValue(rest.name, e);
                    form.setMyTouched(rest.name, true);
                  }}
                >
                  {options && options.map(n => (
                    <Checkbox key={n.value} value={n.value}>{n.label}</Checkbox>
                  ))}
                </Checkbox.Group>
              )}
          </FormItemWrap>
        )
      }}
    </Field>
  )
};

// const DateEditor = (params) => {
//   const { children, ...rest } = params;
//   return <FormItemWrap {...rest}>{children}</FormItemWrap>
// }

const DateEditor = (params) => {
  const { children, ...rest } = params;
  return (
    <Field name={rest.name}>
      {({ field, form }) => {
        return (
          <FormItemWrap form={form} {...rest}>
            {children}
          </FormItemWrap>
        )
      }}
    </Field>
  )
}

const Show = (params) => {
  return (
    <Field name={params.name}>
      {({ field, form }) => {
        return (
          <FormItemWrap form={form} {...params}>
            {params.value}
          </FormItemWrap>
        )
      }}
    </Field>
  )
}

// FromTags 支持 输入数组（基于不带下拉框的多选Select, 回车，分号，逗号，顿号分隔词）
const SelectEditor = (props) => {
  const { config, placeholder, onBlur, ...rest } = props;
  const { mode, options, filterProp = 'value', allowClear = false, width = "100%" } = config || {};
  const { values } = rest.formikprops || {};

  const isValueExist = useCallback((v) => {
    if (typeof (v) === 'string') {
      return v.trim() ? v.trim() : '';
    } else if (typeof (v) === 'object' && v) {
      return v.map(n => n.trim());
    }
  }, []);

  const selectProps = useMemo(() => {
    const params = {
      allowClear, style: { width },
      optionFilterProp: filterProp,
      placeholder: placeholder || props.label,
      tokenSeparators: [';', '、', ',', '，', '；', ';'],
    };
    if (mode) {
      params.mode = mode;
      if (mode === 'inputTags') { // 无下拉框，允许输入
        params.dropdownStyle = { display: 'none' };
        params.mode = 'tags';
      } else if (mode === 'inputOne') { // 可输入，单选
        params.mode = 'tags';
      }
    };
    return params;
  }, []);

  if (values[rest.name] && values[rest.name] instanceof Array && !mode) {
    throw new Error(`value is array and type is error`);
  }

  return (
    <Field name={rest.name}>
      {({ field, form }) => {
        return (
          <FormItemWrap form={form} {...rest}
            children={
              <Select
                {...selectProps}
                value={isValueExist(field.value)}
                onBlur={v => GroupOnBlur(onBlur, form, field.onBlur, rest.name, { target: v })}
                onChange={v => {
                  mode === 'inputOne' && v.length > 1 && v.shift();
                  form.setFieldValue(rest.name, v);
                  form.setMyTouched(rest.name, true);
                }}>
                {options && options.map(({ value, name }) => {
                  return <Select.Option key={value} value={value} name={name}>{name}</Select.Option>
                })}
              </Select>
            } />
        )
      }}
    </Field>
  )
}

// RadioEditor 互斥的单选框
const RadioEditor = (props) => {
  const { options, config = {}, ...rest } = props; // button标识Radio.Button形式

  if (!rest.name || !options) {
    throw new Error(`name and options is must not empty`)
  }

  return (
    <Field name={rest.name}>
      {({ field, form }) => {
        return (
          <FormItemWrap {...rest} form={form} >
            <Radio.Group
              {...config}
              value={field.value}
              defaultValue={field.value}
              onChange={(e) => { form.setFieldValue(rest.name, e.target.value) }}
            >
              {options && options.map((n) => {
                return !config.button ? (<Radio key={n.value} value={n.value}>{n.label}</Radio>) :
                  (<Radio.Button key={n.value} value={n.value}>{n.label}</Radio.Button>)
              })}
            </Radio.Group>
          </FormItemWrap>
        )
      }}
    </Field>
  )
}

const CascaderEditor = (props) => {
  const { onBlur, options, config = {}, ...rest } = props; // button标识Radio.Button形式

  if (!options) {
    throw new Error(`options is must not empty`)
  }

  return (
    <Field name={rest.name}>
      {({ field, form }) => {
        return (
          <FormItemWrap {...rest} form={form} >
            <Cascader
              {...config}
              value={field.value}
              options={options}
              onBlur={v => GroupOnBlur(onBlur, form, field.onBlur, rest.name, { target: v })}
              defaultValue={field.value}
              onChange={(e) => {
                form.setFieldValue(rest.name, e);
                form.setMyTouched(rest.name, true);
              }}
            />
          </FormItemWrap>
        )
      }}
    </Field>
  )
}

export default {
  ErrorField,
  Fieldset,
  Show,
  SelectEditor,
  RadioEditor,
  SwitchEditor,
  TextareaEditor,
  CheckBoxEditor,
  DateEditor,
  CascaderEditor,
};

export { FormItemWrap }

{/* {errors[name] && (myTouched[name] || touched[name]) && (
          <Tooltip title={errors[name]} placement='right' visible={true}>
            <span></span>
          </Tooltip>
)} */}
