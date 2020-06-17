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

    return (
        <AutoForm
            data={{ name: "text", email: "" }}
            config={formConfig}
            onSubmit={onSubmit}
        />
    )

    see more, https://github.com/aminer-ui/front

    Please contact me for more questions, email: aminerfront@gmail.com


    