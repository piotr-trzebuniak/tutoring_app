/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useEffect, useRef, useState } from 'react';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
import Button from '../../../components/UI/Button/Button';
import styles from './Updateoffer.module.scss';
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
import { customStyles } from '../CustomStyles';

const UpdateOffer = () => {
    const { currentUser } = useAppSelector((state) => state.user);
    const [offerData, setOfferData] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const [image, setImage] = useState(undefined);
    const [imagePercent, setImagePercent] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [imageSrc, setImageSrc] = useState(currentUser.profilePicture);

    const fileRef = useRef(null);

    const navigate = useNavigate();
    const params = useParams();

    const [inputsStatus, setInputsStatus] = useState({
        input1: true,
        input2: true,
        input3: true,
        input4: true,
        input5: true,
        input6: true,
        input7: true,
        input8: true,
        input9: true,
    });
    const [isEmptyInput, setIsEmptyInput] = useState(true);

    const checkErrors = () => {
        let check = Object.values(inputsStatus).includes(false);
        setIsEmptyInput(check);
    };

    const handleChange = async () => {
        checkErrors();

        if (!isEmptyInput) {
            try {
                setLoading(true);
                setError(false);
                const res = await fetch(`/api/offer/update/${params.offerId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...offerData,
                        userId: currentUser._id,
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


    useEffect(() => {
        const fetchOffer = async () => {
            const offerId = params.offerId;
            const res = await fetch(`/api/offer/get/${offerId}`);
            const data = await res.json();
            if ((data.success === false)) {
                console.log(data.message);
                return;
            }
            // setOfferData(data);
            setImageSrc(data.imageUrl);

            // typeClasses transformation
            const arrTypeClasses = data.typeClasses || [];
            let arrWithTypeClassesTransform = [];
            if (arrTypeClasses) {
                arrTypeClasses.forEach((el: any) => {
                    arrWithTypeClassesTransform.push({ value: el, label: el });
                });
            }
            // level transformation
            const arrLevel = data.level || [];
            let arrWithLevelTransform = [];
            if (arrLevel) {
                arrLevel.forEach((el: any) => {
                    arrWithLevelTransform.push({ value: el, label: el });
                });
            }

            setOfferData({
                ...data,
                typeClassesTransform: arrWithTypeClassesTransform,
                levelTransform: arrWithLevelTransform,
            });
        };

        fetchOffer();
    }, []);

    return (
        <>
            {loading && <Loader />}

            <div className={styles.myOffer}>
                <h2 className="heading">Edytuj ogłoszenie!</h2>
                <div>
                    <p className={styles.myOffer__label}>Typ zajęć</p>
                    <Select
                        value={offerData.typeClassesTransform}
                        id="input1"
                        onChange={(choice) => {
                            const arr = choice.map((el) => {
                                return el.value;
                            });
                            const arr2 = choice.map((el) => {
                                return {label: el.value, value: el.value};
                            });
                            setOfferData({
                                ...offerData,
                                typeClasses: arr,
                                typeClassesTransform: arr2,
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
                    <p className={styles.myOffer__label}>Poziom nauczania</p>
                    <Select
                        value={offerData.levelTransform}
                        onChange={(choice) => {
                            const arr = choice.map((el) => {
                                return el.value;
                            });
                            const arr2 = choice.map((el) => {
                                return {label: el.value, value: el.value};
                            });
                            setOfferData({ ...offerData, level: arr, levelTransform: arr2});
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
                        value={{
                            value: offerData.subject,
                            label: offerData.subject,
                        }}
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
                    <p className={styles.myOffer__label}>Płeć korepetytora</p>
                    <Select
                        value={{
                            value: offerData.gender,
                            label: offerData.gender,
                        }}
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
                        value={{
                            value: offerData.education,
                            label: offerData.education,
                        }}
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
                        value={offerData.location}
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
                        value={offerData.price}
                        onChange={(e) => {

                            if(+e.target.value <= 49) {
                                setOfferData({
                                    ...offerData,
                                    priceRange: '0 - 49 PLN',
                                    price: e.target.value,
                                });
                            }
                            else if(+e.target.value >= 50 && +e.target.value <= 99) {
    
                                setOfferData({
                                    ...offerData,
                                    priceRange: '50 - 99 PLN',
                                    price: e.target.value,
                                });
                            }
                            else if(+e.target.value >= 100 && +e.target.value <= 149) {
                   
                                setOfferData({
                                    ...offerData,
                                    priceRange: '100 - 149 PLN',
                                    price: e.target.value,
                                });
                            }
                            else if(+e.target.value > 150) {
          
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
                    <p className={styles.myOffer__label}>Telefon kontaktowy</p>
                    <input
                        value={offerData.phoneNumber}
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
                            src={imageSrc || offerData.imageUrl}
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
                    <p className={styles.myOffer__label}>Treść ogłoszenia</p>
                    <textarea
                        value={offerData.description}
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
                        Uaktualnij ogłoszenie
                    </Button>
                </div>
            </div>
        </>
    );
};

export default UpdateOffer;
