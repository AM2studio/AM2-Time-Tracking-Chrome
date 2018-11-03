import React from 'react';

export default props => {
    const { label, name, parentClass, inputChangeEvent, propType, ...rest } = props;
    let { required } = props;
    let type = 'text';

    if (required) {
        required = <span className="form__required">* (required)</span>;
    }
    if (propType) {
        type = propType;
    }

    return (
        <div className={parentClass}>
            <label htmlFor={name}>
                {label}
                {required}
            </label>
            <input name={name} id={name} type={type} onChange={inputChangeEvent} {...rest} />
        </div>
    );
};
