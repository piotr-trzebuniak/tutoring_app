/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { toast } from 'react-toastify';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import Button from '../../../components/UI/Button/Button';
import styles from './MyOffer.module.scss';
import { useAppSelector } from '../../../redux/hooks';
import {
    educationOptions,
    genderOptions,
    levelOptions,
    subjectOptions,
    typeOptions,
} from '../Options';
import { app } from '../../../firebase';
import Loader from '../../../components/Loader/Loader';

const MyOffer = () => {
    const { currentUser } = useAppSelector((state) => state.user);
    const [offerStatus, setOfferStatus] = useState('');
    const [offerData, setOfferData] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showOffersError, setShowOffersError] = useState(false);

    const [image, setImage] = useState(undefined);
    const [imagePercent, setImagePercent] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [imageSrc, setImageSrc] = useState(currentUser.profilePicture);

    const [userOffers, setUserOffers] = useState([]);

    const fileRef = useRef(null);

    const navigate = useNavigate();

    const [inputsStatus, setInputsStatus] = useState({
        input1: false,
        input2: false,
        input3: false,
        input4: false,
        input5: false,
        input6: false,
        input7: false,
        input8: false,
        input9: false,
    });
    const [isEmptyInput, setIsEmptyInput] = useState(true);

    const checkErrors = () => {
        let check = Object.values(inputsStatus).includes(false);
        setIsEmptyInput(check);
    };

    const handleChange = async () => {
        checkErrors();
        checkErrors();

        if (!isEmptyInput) {
            try {
                setLoading(true);
                setError(false);
                const res = await fetch('/api/offer/add-offer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...offerData,
                        userId: currentUser._id,
                        teacherName: currentUser.name,
                        email: currentUser.email,
                        imageUrl: imageSrc,
                    }),
                });
                const resData = await res.json();
                setLoading(false);
                if (resData.success === false) {
                    setError(true);
                    toast.error('Coś poszło nie tak...');
                    return;
                }
                navigate(`/offer-details/${resData._id}`);
            } catch (error) {
                setLoading(false);
                setError(true);
                toast.error('Coś poszło nie tak...');
            }
            toast.success('Ogłoszenie zostało dodane...');
        } else {
            toast.error('Uzupełnij wszystkie pola...');
        }

    };

    const customStyles = {
        option: (defaultStyles: any, state: { isSelected: any }) => ({
            ...defaultStyles,
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



    const handleFileUpload = async (image) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + image.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImagePercent(Math.round(progress));
            },
            (error) => {
                setImageError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setImageSrc(downloadURL)
                );
            }
        );
    };
    useEffect(() => {
        if (image) {
            handleFileUpload(image);
        }
    }, [image]);

    const handleShowOffers = async () => {
        try {
            setShowOffersError(false);
            const res = await fetch(`/api/user/offers/${currentUser._id}`);
            const data = await res.json();
            if (data.success === false) {
                setShowOffersError(true);
                return;
            }
            setUserOffers(data);
            setOfferStatus('browse');
        } catch (error) {
            setShowOffersError(true);
        }
    };

    const handleOfferDelete = async (offerId) => {
        try {
            const res = await fetch(`/api/offer/delete/${offerId}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (data.success === false) {
                console.log(data.message);
                return;
            }

            setUserOffers((prev) =>
                prev.filter((offer) => offer._id !== offerId)
            );
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <>
            {loading && <Loader />}
            {offerStatus === '' && (
                <div className={styles.myOffer}>
                    <h2 className="heading">Moje ogłoszenia</h2>
                    <div className={styles.myOffer__btns}>
                        <Button
                            className={styles.myOffer__addBtn}
                            onClick={() => setOfferStatus('adding')}
                        >
                            Dodaj nowe ogłoszenie
                        </Button>
                        <Button
                            className={styles.myOffer__addBtn2}
                            onClick={handleShowOffers}
                        >
                            Pokaż listę ogłoszeń
                        </Button>
                    </div>
                </div>
            )}
            {showOffersError && <p>Błąd wczytywania ofert!</p>}
            {offerStatus === 'adding' && (
                <div className={styles.myOffer}>
                    <h2 className="heading">Dodaj ogłoszenie!</h2>
                    <div>
                        <p className={styles.myOffer__label}>Typ zajęć</p>
                        <Select
                            id="input1"
                            onChange={(choice) => {
                                const arr = choice.map((el) => {
                                    return el.value;
                                });
                                setOfferData({
                                    ...offerData,
                                    typeClasses: arr,
                                });

                                arr.length > 0
                                    ? setInputsStatus({
                                          ...inputsStatus,
                                          input1: true,
                                      })
                                    : setInputsStatus({
                                          ...inputsStatus,
                                          input1: false,
                                      });

                                checkErrors();
                            }}
                            options={typeOptions}
                            styles={customStyles}
                            placeholder="Wybierz typ zajęć..."
                            isMulti
                        />
                        <p className={styles.myOffer__label}>
                            Poziom nauczania
                        </p>
                        <Select
                            onChange={(choice) => {
                                const arr = choice.map((el) => {
                                    return el.value;
                                });
                                setOfferData({ ...offerData, level: arr });
                                arr.length > 0
                                    ? setInputsStatus({
                                          ...inputsStatus,
                                          input2: true,
                                      })
                                    : setInputsStatus({
                                          ...inputsStatus,
                                          input2: false,
                                      });
                                checkErrors();
                            }}
                            options={levelOptions}
                            styles={customStyles}
                            placeholder="Wybierz poziom nauczania..."
                            isMulti
                        />
                        <p className={styles.myOffer__label}>Przedmiot</p>
                        <Select
                            onChange={(choice) => {
                                setOfferData({
                                    ...offerData,
                                    subject: choice.value,
                                });
                                choice.value
                                    ? setInputsStatus({
                                          ...inputsStatus,
                                          input3: true,
                                      })
                                    : setInputsStatus({
                                          ...inputsStatus,
                                          input3: false,
                                      });
                                checkErrors();
                            }}
                            options={subjectOptions}
                            styles={customStyles}
                            placeholder="Wybierz przedmiot..."
                        />
                        <p className={styles.myOffer__label}>
                            Płeć korepetytora
                        </p>
                        <Select
                            onChange={(choice) => {
                                setOfferData({
                                    ...offerData,
                                    gender: choice.value,
                                });
                                choice.value
                                    ? setInputsStatus({
                                          ...inputsStatus,
                                          input4: true,
                                      })
                                    : setInputsStatus({
                                          ...inputsStatus,
                                          input4: false,
                                      });
                                checkErrors();
                            }}
                            options={genderOptions}
                            styles={customStyles}
                            placeholder="Wybierz płeć korepetytora..."
                        />
                        <p className={styles.myOffer__label}>Wykształcenie</p>
                        <Select
                            onChange={(choice) => {
                                setOfferData({
                                    ...offerData,
                                    education: choice.value,
                                });
                                choice.value
                                    ? setInputsStatus({
                                          ...inputsStatus,
                                          input5: true,
                                      })
                                    : setInputsStatus({
                                          ...inputsStatus,
                                          input5: false,
                                      });
                                checkErrors();
                            }}
                            options={educationOptions}
                            styles={customStyles}
                            placeholder="Wybierz wykształcenie..."
                        />
                        <p className={styles.myOffer__label}>Lokalizacja</p>
                        <input
                            onChange={(e) => {
                                setOfferData({
                                    ...offerData,
                                    location: e.target.value,
                                });
                                e.target.value === ''
                                    ? setInputsStatus({
                                          ...inputsStatus,
                                          input6: false,
                                      })
                                    : setInputsStatus({
                                          ...inputsStatus,
                                          input6: true,
                                      });
                                checkErrors();
                            }}
                            type="text"
                            className={styles.myOffer__input}
                            placeholder="Wpisz lokalizacje..."
                        />
                        <p className={styles.myOffer__label}>Cena za godzinę</p>
                        <input
                            onChange={(e) => {

                                if (+e.target.value <= 49) {
                                    setOfferData({
                                        ...offerData,
                                        priceRange: '0 - 49 PLN',
                                        price: e.target.value,
                                    });
                                } else if (
                                    +e.target.value >= 50 &&
                                    +e.target.value <= 99
                                ) {
                                    setOfferData({
                                        ...offerData,
                                        priceRange: '50 - 99 PLN',
                                        price: e.target.value,
                                    });
                                } else if (
                                    +e.target.value >= 100 &&
                                    +e.target.value <= 149
                                ) {
                                    setOfferData({
                                        ...offerData,
                                        priceRange: '100 - 149 PLN',
                                        price: e.target.value,
                                    });
                                } else if (+e.target.value > 150) {
                                    setOfferData({
                                        ...offerData,
                                        priceRange: '>150 PLN',
                                        price: e.target.value,
                                    });
                                }

                                e.target.value === ''
                                    ? setInputsStatus({
                                          ...inputsStatus,
                                          input7: false,
                                      })
                                    : setInputsStatus({
                                          ...inputsStatus,
                                          input7: true,
                                      });
                                checkErrors();
                            }}
                            type="number"
                            className={styles.myOffer__input}
                            placeholder="Wpisz stawkę godzinową..."
                            step="11"
                            min="1"
                            max="1000"
                        />
                        <p className={styles.myOffer__label}>
                            Telefon kontaktowy
                        </p>
                        <input
                            onChange={(e) => {
                                setOfferData({
                                    ...offerData,
                                    phoneNumber: e.target.value,
                                });
                                e.target.value === ''
                                    ? setInputsStatus({
                                          ...inputsStatus,
                                          input8: false,
                                      })
                                    : setInputsStatus({
                                          ...inputsStatus,
                                          input8: true,
                                      });
                                checkErrors();
                            }}
                            type="phone"
                            className={styles.myOffer__input}
                            placeholder="Wpisz telefon kontaktowy..."
                        />
                        <p className={styles.myOffer__label}>Zdjęcie</p>
                        <div>
                            <input
                                type="file"
                                ref={fileRef}
                                hidden
                                accept="image/*"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                            <img
                                src={imageSrc || currentUser.profilePicture}
                                alt="avatar"
                                className={styles.myOffer__avatar}
                                onClick={() => fileRef.current.click()}
                            />
                            <p className={styles.myOffer__avatarInfo}>
                                {imageError ? (
                                    <span>
                                        Błąd ładowania obrazu (Rozmiar pliku nie
                                        może przekraczać 2 MB)
                                    </span>
                                ) : imagePercent > 0 && imagePercent < 100 ? (
                                    <span>{`Uploading: ${imagePercent} %`}</span>
                                ) : imagePercent === 100 ? (
                                    <span>
                                        Ładowanie obrazu zakończone sukcesem!
                                    </span>
                                ) : (
                                    ''
                                )}
                            </p>
                        </div>
                        <p className={styles.myOffer__label}>
                            Treść ogłoszenia
                        </p>
                        <textarea
                            className={styles.myOffer__textarea}
                            onChange={(e) => {
                                checkErrors();
                                setOfferData({
                                    ...offerData,
                                    description: e.target.value,
                                });
                                e.target.value === ''
                                    ? setInputsStatus({
                                          ...inputsStatus,
                                          input9: false,
                                      })
                                    : setInputsStatus({
                                          ...inputsStatus,
                                          input9: true,
                                      });
                            }}
                        />
                        <Button
                            className={styles.myOffer__publishBtn}
                            onClick={handleChange}
                        >
                            Opublikuj ogłoszenie
                        </Button>
                    </div>
                </div>
            )}

            {userOffers.length <= 0 && offerStatus === 'browse' && (
                <div className={styles.myOffer}>
                    <h2 className={styles.myOffer__heading}>Nie posiadasz żadnych ogłoszeń!</h2>
                </div>
            )}
            {userOffers && userOffers.length > 0 && (
                <div className={styles.myOffer}>
                    <h2 className="heading">Twoje ogłoszenia</h2>
                    {userOffers.map((offer) => (
                        <div className={styles.myOffer__offer} key={offer._id}>
                            <img src={offer.imageUrl} alt="avatar" />
                            <div className={styles['myOffer__offer-info']}>
                                <p>
                                    <b>Przedmiot:</b> {offer.subject}
                                </p>
                                <p>
                                    <b>Cena:</b> {`${offer.price}zł/h`}
                                </p>
                                <p>
                                    <b>Lokalizacja:</b> {offer.location}
                                </p>
                            </div>
                            <div className={styles['myOffer__offer-btns']}>
                                <Link to={`/update-offer/${offer._id}`}>
                                    <Button>Edytuj</Button>
                                </Link>
                                <Button
                                    onClick={() => handleOfferDelete(offer._id)}
                                    className={
                                        styles['myOffer__offer-btns--red']
                                    }
                                >
                                    Usuń
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default MyOffer;
