import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';
import Form from '../../components/UI/Form/Form';
import Input from '../../components/UI/Input/Input';
import { signInStart, signInSuccess, signInFailure } from '../../redux/user/userSlice';
import { useAppSelector, useAppDispatch } from '../../redux/hooks'


// interface for form
interface LoginInterface {
    email: string;
    password: string;
    checkbox: boolean;
}

// validation
const EmailSchema = yup.object().shape({
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
    checkbox: yup.bool(),
});

const Login = () => {
    const error = useAppSelector((state) => state.user)
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(EmailSchema) });

    const onSubmit = async (data: LoginInterface, e: any) => {
        const formData = {
            email: data.email,
            password: data.password,
        };


        try {
            dispatch(signInStart())
            

            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const resData = await res.json();


            if (resData.success === false) {
                dispatch(signInFailure(resData))
                toast.error('Coś poszło nie tak...');
                return;
            }
            dispatch(signInSuccess(resData))
            navigate('/');
        } catch (error) {
            dispatch(signInFailure(error))
            toast.error('Coś poszło nie tak...');
        }
        toast.success('Zostałeś zalogowany...');
        e.target.reset();
    };

    const checkboxClasses = errors.checkbox
        ? `${styles.login__checkbox} ${styles['login__checkbox--checked']}`
        : `${styles.login__checkbox} ${styles['login__checkbox--unchecked']}`;

    return (
        <div className={styles.login}>
            <h2 className="heading">Login</h2>
            <p className={styles.login__text}>
                Masz już konto? Wpisz swoje dane poniżej!
            </p>

            <Form
                buttonLabel="Zaloguj się"
                register={register}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
            >
                <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    error={errors.email?.message?.toString()}
                    autoFocus
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="Hasło"
                    error={errors.password?.message}
                />
                <Input
                    name="checkbox"
                    type="checkbox"
                    error={errors.checkbox?.message}
                />
                <div className={checkboxClasses}>
                    <span>Zapamiętaj mnie</span>
                    {/* <Link
                        className={styles['login__checkbox-link']}
                        to="/reset-password"
                    >
                        Nie pamiętasz hasła?{' '}
                    </Link> */}
                </div>
            </Form>
        </div>
    );
};

export default Login;
