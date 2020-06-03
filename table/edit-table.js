import React, { useEffect, useState } from 'react';
import { component, connect, FormCreate, withRouter } from 'acore';
import { Form, Input, DatePicker, TimePicker, Select, Cascader, InputNumber, Button, Icon } from 'antd';
import styles from './edit-table.less';
/**
 *  Created by BoGao on 2019-05-20;
 *
 *  Edit Table Design.
 */

// ------------ DOC Section ----------------------------------------
const DocSection = false
if (DocSection) {
  const configs = {

  }


  console.log(configs)
}
// ------------ END DOC Section ----------------------------------------

/**
 *
 * @param {Object} config - editor config, include field name and type.
 * @param {Object} data - data
 */
const EditTable = (props) => {
  console.log("DEBUGING: >>>>>>>>>>> render EditTable.")

  const { config, data } = props;
  // if (!data){
  //   return
  // }

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  const { getFieldDecorator } = props.form;

  // TODO move form to upper component.
  return (
    <div className={styles.EditTable}>
      Table Editor

      <Form {...formItemLayout} onSubmit={handleSubmit}>

        {/* TEMP submit button */}


        {config && config.fields && config.fields.map((cfg) => {
          const editor = editors[cfg.type]
          if (!editor) {
            return ErrorBlock_NoEditorFormItem
          }

          const formItemParams = cfghelper.getFormItemParams(cfg) // Form.Item params
          const formComponentParams = cfg.editorparam
          const fieldname = cfg.fieldname || cfg.key;
          const value = cfghelper.getValue(cfg, data);
          const renderer = cfg.render || editor.render;
          {/* console.log(">>>>>>>>>>>>>>>>>>>>>>>>", value) */}
          return (
            <Form.Item {...formItemParams}>
              {getFieldDecorator(fieldname, {
                initialValue: value,
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                renderer && typeof renderer === "function"
                  ? renderer(formComponentParams)
                  : renderer
              )}

              {/* {!renderer && standardRenderEditor(formComponentParams, value, children)} */}
            </Form.Item>
          )

        })}



        <Form.Item label="Warning" validateStatus="warning">
          <Input placeholder="Warning" id="warning" />
        </Form.Item>

        <Form.Item
          label="Validating"
          hasFeedback
          validateStatus="validating"
          help="The information is being validated..."
        >
          <Input placeholder="I'm the content is being validated" id="validating" />
        </Form.Item>

        <Form.Item label="Success" hasFeedback validateStatus="success">
          <Input placeholder="I'm the content" id="success" />
        </Form.Item>

        <Form.Item label="Warning" hasFeedback validateStatus="warning">
          <Input placeholder="Warning" id="warning2" />
        </Form.Item>

        <Form.Item
          label="Fail"
          hasFeedback
          validateStatus="error"
          help="Should be combination of numbers & alphabets"
        >
          <Input placeholder="unavailable choice" id="error2" />
        </Form.Item>

        <Form.Item label="Success" hasFeedback validateStatus="success">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Warning" hasFeedback validateStatus="warning">
          <TimePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Error" hasFeedback validateStatus="error">
          <Select defaultValue="1">
            <Select.Option value="1">Option 1</Select.Option>
            <Select.Option value="2">Option 2</Select.Option>
            <Select.Option value="3">Option 3</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Validating"
          hasFeedback
          validateStatus="validating"
          help="The information is being validated..."
        >
          <Cascader defaultValue={['1']} options={[]} />
        </Form.Item>

        <Form.Item label="inline" style={{ marginBottom: 0 }}>
          <Form.Item
            validateStatus="error"
            help="Please select the correct date"
            style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}
          >
            <DatePicker />
          </Form.Item>
          <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
          <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
            <DatePicker />
          </Form.Item>
        </Form.Item>

        <Form.Item label="Success" hasFeedback validateStatus="success">
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>

      </Form>

      <hr />

      <hr />
    </div>
  )
}

export default component(connect(), FormCreate())(EditTable)

// resources

const ErrorBlock_NoEditorFormItem = (
  <Form.Item
    label="XXXXXX"
    validateStatus="error"
    help="没有找到对应的编辑器"
  >
    <Input placeholder="你摊上事了，这是一个巨大的错误" id="error" disabled />
  </Form.Item>
)

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

// config helper
const cfghelper = {

  getFormItemParams: (fieldcfg) => {
    const formItemParams = {
      key: fieldcfg.key,
      label: fieldcfg.label || fieldcfg.key,
    }
    if (fieldcfg.help) {
      formItemParams.help = fieldcfg.help;
    }
    return formItemParams;
  },

  getValue: (fieldcfg, data) => {
    if (!data) {
      return "";
    }
    if (fieldcfg.value) {
      if (typeof fieldcfg.value === "string") {
        // TODO support a.b.c format.
        return data[fieldcfg.value]
      } else if (typeof fieldcfg.value === "function") {
        return fieldcfg.value(data);
      }
    }
    console.error("Must have value method to get fields.")
    return "ERROR VALUE"
  },
}


// edit table editors
const editors = {
  string: {
    EditorComponent: Input,
    render: (formComponentParams) => (
      <Input {...formComponentParams} />
    ),
    ViewComponent: Input,
  }
}
