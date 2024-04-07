import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './resetPassword.module.scss';
import Form from '../../components/UI/Form/Form';
import Input from '../../components/UI/Input/Input';

// interface for form
interface ResetInterface {
    email: string;
}

// validation
const ResetSchema = yup.object().shape({
    email: yup
        .string()
        .email('Wpisz poprawny adres email!')
        .required('Pole nie może być puste!'),
});

const ResetPasssword = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(ResetSchema) });


    const onSubmit = (data: ResetInterface) => console.log(data);

    return (
        <div className={styles.reset}>
            <h2 className={styles.reset__heading}>Nie pamiętasz hasła?</h2>
            <p className={styles.reset__text}>
                Wpisz swój adres e-mail!
            </p>

            <Form
                buttonLabel="Przypomnij hasło"
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
                <p> </p>
            </Form>
        </div>
    );
};

export default ResetPasssword;
