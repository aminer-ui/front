# Description 
    Enter the configuration automatic production form
## How to use?
    import { AutoForm } from 'aminer-ui';

    const formConfig = [
        {
            name: 'name',
            type: 'text',
            label: 'name',
        },
        {
            name: 'email',
            type: 'text',
            label: 'email',
        },
    ]

    <AutoForm
        data={{ name: "text", email: "" }}
        config={formConfig}
        onSubmit={onSubmit}
    />

    Please contact me for more questions, email: aminerfront@gmail.com


    