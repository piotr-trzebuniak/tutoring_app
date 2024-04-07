/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import { FC, InputHTMLAttributes } from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string;
    label?: string;
    error?:
        | string
        | FieldError
        | Merge<FieldError, FieldErrorsImpl<any>>
        | undefined;
    register?: any;
    className?: string;
}

const Input: FC<InputProps> = ({
    register,
    name,
    error,
    label,
    ...rest
}) => {


    return (

        <div className={styles.container}>
            {/* {label && <label htmlFor={name}>{label}</label>} */}
            <input
                className={error?.toString().trim() === 'Pole nie może być puste!' ? `${styles.input} ${styles['input--error-field']}` : `${styles.input}`}
                aria-invalid={error ? 'true' : 'false'}
                {...register(name)}
                {...rest}
            />
            {error && <p role="alert" className={styles.input__error}>{error.toString()}</p>}
        </div>
    );
};

export default Input;
