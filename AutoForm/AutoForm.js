import React, { useMemo, useCallback, Fragment, useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Formik, Form } from 'formik';
import moment from 'moment';
import { classnames } from 'utils';
import { Button } from 'antd';
import { createValidateFun, FormItem } from './index';
import styles from './AutoForm.less';

//
// 1. layout 表单布局 'horizontal'|'vertical'|'inline'
//
const FormInner = forwardRef((payload, ref) => {
  const { layout = 'horizontal', config, data, onSubmit, footerConfig = {}, formikprops, editorStyle } = payload;
  const { values, errors, setValues, resetForm, setFieldValue, setMyTouched } = formikprops;
  const { align: submitAlign = (config.every(n => !n.label) ? 'left' : ''), showReset = false } = footerConfig;

  useImperativeHandle(ref, () => ({
    reset: () => resetForm(),
    setValues: (v) => setValues(v),
    setFieldValue: (n, v) => setFieldValue(n, v),
  }))

  useEffect(() => {
    setValues(data);
  }, [data]);

  const InfiniteConfig = useCallback(configs => configs && configs.map((cfg, index) => {
    const { render, children, ...params } = cfg;
    params.formikprops = formikprops;
    params.layout = layout;

    if (editorStyle) { params.editorStyle = editorStyle }

    // special
    const callback = {};
    if (params.type === 'date') {
      const formatValue = values[params.name] ? moment(values[params.name]) : null;
      callback.defaultValue = formatValue;
      callback.value = formatValue;
      callback.onChange = (v) => {
        setFieldValue(params.name, v ? moment(v) : null)
        setMyTouched(params.name, true)
      }
    }

    // nested
    if (children && children.length > 0) {
      return (
        <ul key={index}
          className={classnames('formInner', params.wrapperStyle)}>
          {InfiniteConfig(children)}
        </ul>
      );
    }

    // render func
    if (render && typeof render === 'function') {
      return <Fragment key={index}>{render(params, callback)}</Fragment>
    }

    // normal
    return <Fragment key={index}><FormItem {...params} /></Fragment>
  }), [values, errors]);

  const content = InfiniteConfig(config);

  return (
    <Form className={classnames(styles.autoForm, styles[`form-${layout}`])}>
      <ul className='formInner'>{content}</ul>
      {onSubmit && (
        <div className='btnwrap'>
          <Button
            htmlType="submit" type="primary"
            className={classnames('subBtn', `${submitAlign}SubBtn`
            )}>
            submit
          </Button>
          {showReset && (
            <Button htmlType="reset">
              reset
            </Button>
          )}
        </div>
      )}
    </Form>
  )
}
)

const AutoForm = forwardRef((props, ref) => {
  const innerRef = useRef();
  const { config, data, onSubmit, ...rest } = props;
  const [myTouch, setMyTouch] = useState({});

  const setMyTouched = (k, v) => {
    setMyTouch({ ...myTouch, [k]: v });
  }

  useImperativeHandle(ref, () => ({
    reset: () => innerRef.current.reset(),
    setValues: (v) => innerRef.current.setValues(v),
    setFieldValue: (n, v) => innerRef.current.setFieldValue(n, v),
  }));

  const params = useMemo(() => ({
    onSubmit,
    initialValues: data || {},
    validate: createValidateFun(config),
  }), [config, data, myTouch])

  if (!config) { return 'config is null!' }

  return (
    <Formik {...params}>
      {(inner) => {
        inner.myTouched = myTouch;
        inner.setMyTouched = setMyTouched;
        return (
          <FormInner
            {...rest}
            data={data}
            ref={innerRef}
            config={config}
            formikprops={inner}
            onSubmit={onSubmit}
          />
        )
      }}
    </Formik>
  );
})

export default (AutoForm);
