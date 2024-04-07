/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/require-default-props */
import { FC, InputHTMLAttributes } from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import styles from './Textarea.module.scss';

interface TextareaProps extends InputHTMLAttributes<HTMLInputElement> {
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

const Textarea: FC<TextareaProps> = ({
    register,
    name,
    error,
    label,
    ...rest
}) => {


    return (

        <div className={styles.container}>
            {/* {label && <label htmlFor={name}>{label}</label>} */}
            <textarea
                className={error?.toString().trim() === 'Pole nie może być puste!' ? `${styles.textarea} ${styles['textarea--error-field']}` : `${styles.textarea}`}
                aria-invalid={error ? 'true' : 'false'}
                {...register(name)}
                {...rest}
            />
            {error && <p role="alert" className={styles.textarea__error}>{error.toString()}</p>}
        </div>
    );
};

export default Textarea;
