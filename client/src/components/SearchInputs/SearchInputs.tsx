/* eslint-disable react/require-default-props */
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ImSearch } from 'react-icons/im';
import { GoLocation } from 'react-icons/go';
import classNames from 'classnames';
import styles from './SearchInputs.module.scss';
import Button from '../UI/Button/Button';


type Props = {
    className?: string
}


const SearchInputs: React.FC<Props> = ({className = ''}) => {

    const containerClassNames = `${styles.search} ${className}`
    const locationInputClasses = `${styles.search__input} ${classNames(styles['search__input--location'])}`

    const navigate = useNavigate();

    const location = useLocation()
    const [searchSubject, setSearchSubject] = useState('')
    const [searchLocation, setSearchLocation] = useState('')


    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchSubjectFromUrl = urlParams.get('searchSubject');
        if (searchSubjectFromUrl) {
            setSearchSubject(searchSubjectFromUrl);
        }
        const searchLocationFromUrl = urlParams.get('searchLocation');
        if (searchLocationFromUrl) {
            setSearchLocation(searchLocationFromUrl);
        }
    
      
    }, [location.search])


    const handleSubmit = (e: any) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);

        urlParams.set('searchSubject', searchSubject);
        urlParams.set('searchLocation', searchLocation);

        const searchQuery = urlParams.toString();
        navigate(`/offers?${searchQuery}`);
      };


    return (
        <div className={containerClassNames}>
            <form className={styles.search__form} onSubmit={handleSubmit}>
                <div className={styles.search__input}>
                    <ImSearch
                        className={classNames(styles['search__input-icon'])}
                        size={30}
                    />
                    <input placeholder="Wpisz nazwę przedmiotu..." onChange={(e) => setSearchSubject(e.target.value)} value={searchSubject} />
                </div>
                <div className={locationInputClasses}>
                    <GoLocation
                        className={classNames(styles['search__input-icon'])}
                        size={30}
                    />
                    <input placeholder="Wpisz lokalizację..."  onChange={(e) => setSearchLocation(e.target.value)} value={searchLocation} />
                </div>
                <Button
                    className={classNames(styles['search__form-btn'])} type='submit'
                >
                    <ImSearch size={25} />
                </Button>
            </form>
        </div>
    );
};

export default SearchInputs;
