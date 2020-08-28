import React from 'react';
import ReactDOM from 'react-dom';
import { DatePicker } from 'antd';

import { AutoForm, FormItem } from './AutoForm';

ReactDOM.render(
    <AutoForm
        // layout='inline'
        data={{ name: "text", email: "", id: '', data: '' }}
        config={
            [
                {
                    name: 'name',
                    label: '测试',
                    type: 'text',
                    placeholder: '姓名'
                },
                {
                    name: 'email',
                    label: '测试',
                    type: 'text',
                    placeholder: '邮箱'
                },
                {
                    name: 'id',
                    label: '测试',
                    type: 'text',
                    placeholder: 'id'
                },
            ]
        }
        onSubmit={() => { console.log('---') }}
    />,
    document.getElementById('app')
)