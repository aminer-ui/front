import React, { useMemo } from 'react';
import editors from './field_editors';

// outside
import { createValidateFun } from './validator';
import AutoForm from './AutoForm';

/**
 * 用来存储所有注册的编辑器。
 */
const fieldEditors = {};

/**
 * @param {*} field
 * @param {*} comp
 */
const registerEditor = (field, comp) => {
  if (!field) {
    throw new Error('Error when registerEditor, `field` can\'t be empty');
  }
  if (!comp) {
    throw new Error('Error when registerEditor, `comp` can\'t be empty');
  }
  if (fieldEditors[field]) {
    throw new Error(`Error when registerEditor, duplicate register component for '${field}'`);
  }
  fieldEditors[field] = comp;
}

/**
 * @param {*} field
 */
const findEditor = field => {
  const comp = fieldEditors[field];
  if (!comp) { return editors.ErrorField }
  return comp;
}


const getFieldValue = (cfg, values) => {
  const key = cfg.value || cfg.name;
  if (typeof key === 'string') {
    return values[key];
  }
  return key(values); // is func
}

const FormItem = config => {
  const { formikprops, rules = [], labelCol, wrapperCol, ...props } = config;
  const { values, errors, myTouched } = formikprops;
  const fieldValue = getFieldValue(props, values);

  const params = useMemo(() => ({
    formikprops,
    ...props,
    value: fieldValue,
    required: rules.some(n => n.required),
  }), [fieldValue, errors, myTouched]);

  const Editor = findEditor(props.type);

  return <Editor {...params} />;
}

// ---------------------------------------------------------------
// Init
// ---------------------------------------------------------------

// register editors.
registerEditor('text', editors.Fieldset)
registerEditor('email', editors.Fieldset)
registerEditor('url', editors.Fieldset)
registerEditor('phone', editors.Fieldset)
registerEditor('textarea', editors.TextareaEditor)
registerEditor('show', editors.Show)
registerEditor('select', editors.SelectEditor)
registerEditor('switch', editors.SwitchEditor)
registerEditor('checkbox', editors.CheckBoxEditor)
registerEditor('checkboxGroup', editors.CheckBoxEditor)
registerEditor('radio', editors.RadioEditor)
registerEditor('defined', editors.DefinedEditor)
registerEditor('cascader', editors.CascaderEditor)
// registerEditor('customer_type', exeditors.CustomerTypeEditor)
// registerEditor('imageuploader', fileuploader)
// registerEditor('number', editors.Fieldset) type 传 text, 通过rules传 

export {
  createValidateFun,
  AutoForm, FormItem
};