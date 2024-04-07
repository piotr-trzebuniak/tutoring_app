/* eslint-disable react/require-default-props */
import React from 'react'
import styles from './Card.module.scss'

type Props = {
    children: React.ReactNode,
    className?: string,
}

const Card: React.FC<Props> = ({children, className = ''}) => {
    const classNames = `${styles.card} ${className}`

    return <div className={classNames}>{children}</div>;
}

export default Card