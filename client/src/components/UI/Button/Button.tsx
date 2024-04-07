/* eslint-disable react/button-has-type */
/* eslint-disable react/require-default-props */
import React from 'react'
import styles from './Button.module.scss'

type Btn = {
    children?: React.ReactNode,
    onClick?: () => void;
    className?: string,
    type?: "button" | "reset" | "submit"
}

const Button: React.FC<Btn> = ({children, onClick, className, type = 'button'}) => {
    const classNames = `${styles.button} ${className}`
  return (
    <button type={type} onClick={onClick} className={classNames}>{children}</button>
  )
}

export default Button