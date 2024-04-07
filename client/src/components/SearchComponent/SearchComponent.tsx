/* eslint-disable @typescript-eslint/no-explicit-any */
import Select from 'react-select';
import { ImSearch } from 'react-icons/im';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../UI/Button/Button';
import style from './SearchComponent.module.scss';

const SearchComponent = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const [typeClasses, setTypeClasses] = useState('');
    const [level, setLevel] = useState('');
    const [gender, setGender] = useState('');
    const [priceRange, setPriceRange] = useState('');

    const handleSubmit = () => {
    
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('typeClasses', typeClasses);
        urlParams.set('level', level);
        urlParams.set('priceRange', priceRange);
        urlParams.set('gender', gender);
        urlParams.set('priceRange', priceRange);

        const searchQuery = urlParams.toString();
        navigate(`/offers?${searchQuery}`);
    };

    const typeOptions = [
        { value: 'stacjonarne', label: 'stacjonarne' },
        { value: 'zdalne', label: 'zdalne' },
    ];
    const levelOptions = [
        { value: 'szkoła podstawowa', label: 'szkoła podstawowa' },
        { value: 'szkoła średnia', label: 'szkoła średnia' },
        { value: 'studia', label: 'studia' },
        { value: 'inny', label: 'inny' },
    ];
    const priceOptions = [
        { value: '0 - 49 PLN', label: '0 - 49 PLN' },
        { value: '50 - 99 PLN', label: '50 - 99 PLN' },
        { value: '100 - 149 PLN', label: '100 - 149 PLN' },
        { value: '>150 PLN', label: '>150 PLN' },
    ];
    const genderOptions = [
        { value: 'kobieta', label: 'kobieta' },
        { value: 'mężczyzna', label: 'mężczyzna' },
    ];

    const customStyles = {
        option: (defaultStyles: any, state: { isSelected: any }) => ({
            ...defaultStyles,
            //   color: state.isSelected ? "red" : "#0E0D0D",
            cursor: 'pointer',
        }),

        control: (defaultStyles: any) => ({
            ...defaultStyles,
            backgroundColor: '#F9F8FD',
            border: '1px solid #DCDCDC',
            borderRadius: '10px',
            fontSize: '14px',
            padding: '8px 20px',
            boxShadow: 'none',
            cursor: 'pointer',
            '&:hover': {
                borderColor: '#DCDCDC',
            },
        }),

        placeholder: (defaultStyles: any) => {
            return {
                ...defaultStyles,
                color: '#0E0D0D',
                fontWeight: '400',
            };
        },
        dropdownIndicator: (defaultStyles: any) => {
            return {
                ...defaultStyles,
                color: '#0E0D0D',
                transform: 'scale(1.5)',
            };
        },
        indicatorSeparator: (defaultStyles: any) => {
            return {
                ...defaultStyles,
                display: 'none',
            };
        },
        container: (defaultStyles: any) => {
            return {
                ...defaultStyles,
                width: '100%',
            };
        },
    };


    return (
        <>
            <h2 className={style.search__heading}>Filtry</h2>
            <div className={style.search__filters}>
                <Select
                    onChange={(choice) => {
                        setTypeClasses(choice.value);
                    }}
                    options={typeOptions}
                    styles={customStyles}
                    placeholder="Wybierz typ zajęć..."
                />
                <Select
                    onChange={(choice) => {
                        setLevel(choice.value);
                    }}
                    options={levelOptions}
                    styles={customStyles}
                    placeholder="Wybierz poziom nauczania..."
                />
                <Select
                    onChange={(choice) => {
                        setPriceRange(choice.value);
                    }}
                    options={priceOptions}
                    styles={customStyles}
                    placeholder="Cena za godzinę..."
                />
                <Select
                    onChange={(choice) => {
                        setGender(choice.value);
                    }}
                    options={genderOptions}
                    styles={customStyles}
                    placeholder="Płeć korepetytora..."
                />
                <Button className={style.search__btn} onClick={handleSubmit}>
                    <ImSearch size={25} />
                </Button>
            </div>
        </>
    );
};

export default SearchComponent;
