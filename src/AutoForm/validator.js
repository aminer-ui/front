// import * as Yup from 'yup';
// ---------------------------------------------------------------
// Vaidator
// ---------------------------------------------------------------

// textarea radio checkBox select switch ...
// 1 改名字 2 静态的结构体 省去switch 3  支持传message 没传就默认自带的
// 4 支持不传type 直接传 Yup 5 Formik defineSchema用 userMemo 单独提出去

const defaultTypeMsg = (type) => `type is ${type}`

// const types = {
//   text: () => Yup.string().trim(),
//   textarea: () => Yup.string().trim(),
//   show: () => Yup.string(),
//   switch: () => Yup.boolean(),
//   checkbox: () => Yup.boolean(),
//   checkboxGroup: () => Yup.array(),
//   radio: () => Yup.array(),
//   date: () => Yup.date(),
//   cascader: () => Yup.array(),
//   number: ({ typemsg, type }) => {
//     return Yup.string().trim()
//       .matches(/^[0-9]*$/, typemsg || defaultTypeMsg(type))
//   },
//   url: ({ typemsg, type }) => {
//     return Yup.string().trim()
//       .url(typemsg || defaultTypeMsg(type));
//   },
//   email: ({ typemsg, type }) => {
//     return Yup.string().trim()
//       .email(typemsg || defaultTypeMsg(type));
//   },
//   array: () => {
//     return Yup.array().of(Yup.string())
//   },
//   select: () => {
//     return Yup.array().of(Yup.string())
//   },
// }


// mobile /^1[3|4|5|7|8][0-9]\d{8}$/
// tel  /^\d{3}-\d{8}|\d{4}-\d{7}|\d{11}$/
// time date 时间 日期限制 比如开始时间大于结束时间等错误

// addRule 方法
// 1 用来读取规则校验的方法
// 2 注意!!校验方法如果有重复直接抛错
// 3 如果外层传了自己完整的yup校验， 直接return它
// 4 把一些公共的方法提出来在这里用, 比如是否必填,最大,最小，
// const addRule = (type, { yup, ...params }) => {
//   if (yup) {
//     return yup;
//   }
//   let fun = types[type]({ ...params, type });
//   const { required, min, max,
//     requiredmsg = 'is required', typemsg = `type is ${type}` } = params;
//   if (required) {
//     fun = fun.required(requiredmsg);
//   } else {
//     fun = fun.nullable();
//   }
//   if (min !== undefined) {
//     fun = fun.min(min, `min is ${min}`);
//   }
//   if (max !== undefined) {
//     fun = fun.max(max, `max is ${max}`);
//   }
//   return fun;
// }

// const defineSchema = (fields) => {
//   const shape = {};
//   if (fields && fields.length > 0) {
//     for (let i = 0; i < fields.length; i++) {
//       const { name, type, ...params } = fields[i];
//       if (!name) {
//         throw new Error(`name can't be empty`)
//       }
//       if (!type || !types[type]) {
//         // throw new Error(`type can't be empty`)
//       }
//       if (types[type]) {
//         shape[name] = addRule(type, params);
//       }
//     }
//     return Yup.object().shape(shape);
//   }
//   return null;
// }

// const InfiniteRules = (config, list = []) => {
//   config && config.map(cfg => {
//     const { rules, name, children } = cfg;
//     if (children && children.length) {
//       InfiniteRules(children, list);
//     } else {
//       let item = { name, type: cfg.type };
//       if (rules && rules.length) {
//         rules.map((n) => {
//           const { validate, required, type, message, ...rest } = n;
//           Object.assign(item, rest);
//           if (typeof required === 'boolean') {
//             item.required = required;
//             item.requiredmsg = message;
//           }
//           if (type) {
//             item.type = type;
//             item.typemsg = message;
//           }
//         })
//       }
//       list.push(item);
//     }
//   })
//   return list;
// }

// const createValidationSchema = (result) => {
//   return defineSchema(InfiniteRules(result));
// }

const typesRegExp = {
  phone: /^1[345678]\d{9}$/,
  email: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
  url: /^((https?|ftp|file):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
}

const createValidateFun = (config) => (values) => {
  const errors = {};
  config && config.map(({ name, label, rules }) => {
    if (rules && rules.length) {
      rules.map(({ validate, required, type, msg }) => {

        if (required === true && (!values[name] || values[name] && values[name].length === 0)) {
          errors[name] = msg || `请输入${label}`;
          return;
        }

        if (typeof validate === 'function') {
          errors[name] = validate();
          return;
        }

        if (Object.keys(typesRegExp).includes(type)) {
          if (!typesRegExp[type].test(values[name])) {
            errors[name] = `不合法的 ${type}`;
            return;
          }
        }

      })
    }
  })
  return errors;
}



export {
  // createValidationSchema,
  createValidateFun,
};
