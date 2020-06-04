import React, { useEffect, useState } from 'react';
import { Input as AntdInput } from 'antd';

// basic universal form control.
const FormControl = (props) => {
  return (
    <AntdInput {...props} />
  )
}

const Input = (props) => {
  return (
    <AntdInput {...props} />
  )
}

const FormTextarea = FormControl

export { Input, FormControl, FormTextarea }
