/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../../components/UI/Button/Button';
import styles from './Register.module.scss';
import Form from '../../components/UI/Form/Form';
import Input from '../../components/UI/Input/Input';
import Loader from '../../components/Loader/Loader';


interface RegisterInterface {
    name: string;
    surname: string;
    email: string;
    password: string;
    repeatPassword: string;
}

// validation
const RegisterSchema = yup.object().shape({
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

const Register = () => {
    const [accountType, setAccountType] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(RegisterSchema) });

    const onSubmit = async (data: RegisterInterface, e: any) => {
        const formData = {
            name: data.name,
            surname: data.surname,
            email: data.email,
            password: data.password,
            accountType: accountType,
        };

        try {
            setLoading(true);
            setError(false);
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const resData = await res.json();
            console.log(resData)
            
            setLoading(false);
            
            if (resData.success === false) {
                setError(true);
                toast.error("Coś poszło nie tak...");
                return;
            }
            navigate('/login')
        } catch (error) {
            setLoading(false);
            setError(true);
            toast.error("Coś poszło nie tak...");
        }
        toast.success("Konto zostało zarejestrowane...");
        e.target.reset();
    };

    const checkboxClasses = errors.checkbox
        ? `${styles.register__checkbox} ${styles['register__checkbox--checked']}`
        : `${styles.register__checkbox} ${styles['register__checkbox--unchecked']}`;

    return (
        <>
            {loading && <Loader />}
            <div className={styles.register}>
                <h2 className="heading">Rejestracja</h2>
                <p className={styles.register__text}>
                    Jaki typ konta Cie interesuje?
                </p>
                <div className={styles.register__btns}>
                    <Button
                        className={
                            accountType === 'student'
                                ? `${styles['register__btns--checked']}`
                                : ''
                        }
                        onClick={() => setAccountType('student')}
                    >
                        Konto ucznia
                    </Button>
                    <Button
                        className={
                            accountType === 'teacher'
                                ? `${styles['register__btns--checked']}`
                                : ''
                        }
                        onClick={() => setAccountType('teacher')}
                    >
                        Konto korepetytora
                    </Button>
                </div>

                {accountType && (
                    <Form
                        buttonLabel="Zaloguj się"
                        register={register}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                    >
                        <Input
                            name="name"
                            type="text"
                            placeholder="Imię"
                            error={errors.name?.message?.toString()}
                            autoFocus
                        />
                        <Input
                            name="surname"
                            type="text"
                            placeholder="Nazwisko"
                            error={errors.surname?.message?.toString()}
                        />
                        <Input
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
                        <Input
                            name="checkbox"
                            type="checkbox"
                            error={errors.checkbox?.message}
                        />
                        <div className={checkboxClasses}>
                            <span>
                                Przeczytałem i akceptuję <u>regulamin</u> oraz{' '}
                                <u>politykę prywatności</u>
                            </span>
                        </div>
                    </Form>
                )}
            </div>
        </>
    );
};

export default Register;
