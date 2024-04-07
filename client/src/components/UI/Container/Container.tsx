/* eslint-disable react/require-default-props */
import React from 'react'
import styles from './Containter.module.scss'

type Props = {
    children: React.ReactNode,
    className?: string,
}

const Container: React.FC<Props> = ({children, className = ''}) => {
    const classNames = `${styles.container} ${className}`

    return <div className={classNames}>{children}</div>;
}

export default Container