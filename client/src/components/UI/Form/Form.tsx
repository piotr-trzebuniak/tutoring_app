/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import { FC, createElement, ReactNode } from "react";
import styles from './Form.module.scss'
import Button from "../Button/Button";

export type ClassNameType = string;
export type ChildrenType = ReactNode;

export interface IFormProps {
  defaultValues?: any;
  children?: ChildrenType;
  buttonLabel?: string;
  onSubmit?: any;
  handleSubmit?: any;
  register?: any;
  className?: ClassNameType;
}

const Form: FC<IFormProps> = ({
  defaultValues,
  buttonLabel = "Submit",
  children,
  onSubmit,
  handleSubmit,
  register,
  ...rest
}) => {
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} {...rest}>
        {Array.isArray(children)
          ? children.map((child) => {
              return child.props.name
                ? createElement(child.type, {
                    ...{
                      ...child.props,
                      register,
                      key: child.props.name
                    }
                  })
                : child;
            })
          : children}
      <Button className={styles.form__button} type="submit">{buttonLabel}</Button>
    </form>
  );
};

export default Form;
