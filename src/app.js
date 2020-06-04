import React from 'react';
import ReactDOM from 'react-dom';


import { AutoForm } from './AutoForm';

ReactDOM.render(
    <AutoForm data={{ name: "text" }} config={[{
        name: 'name',
        type: 'email',
        label: 'E-mail',
    }]} />,
    document.getElementById('app')
)