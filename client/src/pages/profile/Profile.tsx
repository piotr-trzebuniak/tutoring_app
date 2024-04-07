/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import { useRef, useState, useEffect } from 'react';
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './Profile.module.scss';
import Form from '../../components/UI/Form/Form';
import Input from '../../components/UI/Input/Input';
import Loader from '../../components/Loader/Loader';
import { useAppSelector } from '../../redux/hooks';
import Button from '../../components/UI/Button/Button';
import {
    updateUserStart,
    updateUserFailure,
    updateUserSuccess,
    signInFailure,
    deleteUserStart,
    deleteUserFailure,
    deleteUserSuccess,
} from '../../redux/user/userSlice';

import { app } from '../../firebase';

interface ProfileInterface {
    name: string;
    surname: string;
    email: string;
    password: string;
    repeatPassword: string;
}

// validation
const ProfileSchema = yup.object().shape({
    name: yup.string().required('Pole nie może być puste!'),
    surname: yup.string().required('Pole nie może być puste!'),
    email: yup
        .string()
        .email('Wpisz poprawny adres email!')
        .required('Pole nie może być puste!'),
    password: yup
        .string()
        .required('Pole nie może być puste!')
        .min(8, 'Minimalna długość hasła wynosi 8')
        .max(20, 'Maksymalna długość hasła wynosi 20')
        .matches(/[0-9]/, 'Hasło musi zawierać numer')
        .matches(/[a-z]/, 'Hasło musi zawierać małą literę')
        .matches(/[A-Z]/, 'Hasło musi zawierać dużą literę'),
    repeatPassword: yup
        .string()
        .required('Pole nie może być puste!')
        .oneOf([yup.ref('password')], 'Wprowadzone hasła nie są identyczne!'),
    checkbox: yup.bool().oneOf([true], 'Powyższe pole jest obowiązkowe!'),
});

const Profile = () => {
    const { currentUser, loading } = useAppSelector((state) => state.user);
    const [image, setImage] = useState(undefined);
    const [imagePercent, setImagePercent] = useState(0);
    const [imageError, setImageError] = useState(false);
    const [imageSrc, setImageSrc] = useState(currentUser.profilePicture);

    const fileRef = useRef(null);
    const dispatch = useDispatch();

    const [deleteConfirmation, setDeleteConfirmation] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(ProfileSchema) });

    useEffect(() => {
        if (image) {
            handleFileUpload(image);
        }
    }, [image]);

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

    const onSubmit = async (data: ProfileInterface) => {
        const formData = {
            name: data.name,
            surname: data.surname,
            email: data.email,
            password: data.password,
            profilePicture: imageSrc,
        };

        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(signInFailure(data));
                toast.error('Coś poszło nie tak...');
                return;
            }
            dispatch(updateUserSuccess(data));
            toast.success('Dane zostały zaktualizowane...');
        } catch (error) {
            dispatch(updateUserFailure(error));
            toast.error('Coś poszło nie tak...');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data));
                toast.error('Coś poszło nie tak...');
                return;
            }

            dispatch(deleteUserSuccess(data));
            toast.success('Konto zostało usunięte');
        } catch (error) {
            dispatch(deleteUserFailure(error));
            toast.error('Coś poszło nie tak...');
        }
    };

    return (
        <>
            {loading && <Loader />}
            <div className={styles.profile}>
                <h2 className="heading">Twój profil</h2>
                <p className={styles.profile__text}>
                    Zaktualizuj podstawowe dane Twojego profilu
                </p>

                <input
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />
                <img
                    src={imageSrc || currentUser.profilePicture }
                    alt="avatar"
                    className={styles.profile__avatar}
                    onClick={() => fileRef.current.click()}
                />
                <p className={styles.profile__avatarInfo}>
                    {imageError ? (
                        <span>
                           Błąd ładowania obrazu (Rozmiar pliku nie może przekraczać 2
                            MB)
                        </span>
                    ) : imagePercent > 0 && imagePercent < 100 ? (
                        <span>{`Uploading: ${imagePercent} %`}</span>
                    ) : imagePercent === 100 ? (
                        <span>Ładowanie obrazu zakończone sukcesem!</span>
                    ) : (
                        ''
                    )}
                </p>
                <Form
                    buttonLabel="Zaktualizuj profil"
                    register={register}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                >
                    <Input
                        defaultValue={currentUser.name}
                        name="name"
                        type="text"
                        placeholder="Imię"
                        error={errors.name?.message?.toString()}
                        autoFocus
                    />
                    <Input
                        defaultValue={currentUser.surname}
                        name="surname"
                        type="text"
                        placeholder="Nazwisko"
                        error={errors.surname?.message?.toString()}
                    />
                    <Input
                        defaultValue={currentUser.email}
                        name="email"
                        type="email"
                        placeholder="Email"
                        error={errors.email?.message?.toString()}
                    />
                    <Input
                        name="password"
                        type="password"
                        placeholder="Hasło"
                        error={errors.password?.message}
                    />
                    <Input
                        name="repeatPassword"
                        type="password"
                        placeholder="Powtórz hasło"
                        error={errors.repeatPassword?.message}
                    />
                </Form>
                <Button
                    className={styles.profile__delete}
                    onClick={() => setDeleteConfirmation(true)}
                >
                    Usuń konto
                </Button>

                {deleteConfirmation && (
                    <div className={styles.profile__deleteDiv}>
                        <p>
                            Czy jesteś pewien, że chcesz usunąć permamentnie
                            swoje konto?
                        </p>
                        <div className={styles.profile__deleteBtns}>
                            <Button
                                onClick={handleDeleteAccount}
                                className={styles['profile__deleteBtns-yes']}
                            >
                                Tak
                            </Button>
                            <Button
                                onClick={() => setDeleteConfirmation(false)}
                            >
                                Nie
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Profile;
