export const customStyles = {
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
        marginTop: '1em',
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