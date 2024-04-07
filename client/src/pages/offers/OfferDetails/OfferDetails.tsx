import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './OfferDetails.module.scss';
import Container from '../../../components/UI/Container/Container';
import SearchInputs from '../../../components/SearchInputs/SearchInputs';
import Card from '../../../components/UI/Card/Card';
import fav from '../../../assets/fav.png';
import Form from '../../../components/UI/Form/Form';
import Input from '../../../components/UI/Input/Input';
import Textarea from '../../../components/UI/Textarea/Textarea';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../../../components/Loader/Loader';
import { toast } from 'react-toastify';


interface ResetInterface {
    email: string;
    mess: string;
    phone: string;
}

// validation
const ResetSchema = yup.object().shape({
    email: yup
        .string()
        .email('Wpisz poprawny adres email!')
        .required('Pole nie może być puste!'),
    phone: yup
        .string()
        .required('Pole nie może być puste!')
        .min(9, 'Wpisz poprawny numer telefonu!'),
    mess: yup.string().required('Pole nie może być puste!'),
});

const OfferDetails = () => {
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const params = useParams();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(ResetSchema) });

    const onSubmit = async (data: ResetInterface, e: any) => {
        const message = `${data.mess}%0D%0ANumer telefonu: ${data.phone}%0D%0AAdres email: ${data.email}`
        window.location.href = `mailto:${offer.email}?subject=Zapytanie do ogłoszenia: Korepetycje ${offer.subject} ${offer.location}&body=${message}`;
        e.target.reset();
    };

    useEffect(() => {
        const fetchOffer = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/offer/get/${params.offerId}`);
                const data = await res.json();

                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    toast.error('Coś poszło nie tak...');
                    return;
                }
                setOffer(data);
                setLoading(false);
                console.log(data);
                console.log(data.level.map((el) => el.value).join(', '));
            } catch (error) {
                setError(true);
                setLoading(false);
                toast.error('Coś poszło nie tak...');
            }
        };

        fetchOffer();
    }, [params.offerId]);

    return (
        <>
            {loading && <Loader />}
            <div className={styles.offerDetails}>
                <div className={styles.offerDetails__banner}>
                    <Container>
                        <SearchInputs />
                        <div className={styles.offerDetails__content}>
                            <Card className={styles.offerDetails__main}>
                                <div className={styles.offerDetails__top}>
                                    <img
                                        src={offer && offer.imageUrl}
                                        alt="avatar"
                                        className={
                                            styles['offerDetails__top-avatar']
                                        }
                                    />
                                    <div className={styles.offerDetails__info}>
                                        <h2>
                                        {offer && offer.teacherName},{' '}
                                            {offer && offer.subject}
                                        </h2>
                                        <div
                                            className={
                                                styles[
                                                    'offerDetails__info-details'
                                                ]
                                            }
                                        >
                                            <p>
                                                <b>Lokalizacja:</b>{' '}
                                                {offer && offer.location}
                                            </p>
                                            <p>
                                                <b>Typ zajęć:</b>{' '}
                                                {offer &&
                                                    offer.typeClasses
                                                        .map((el) => el)
                                                        .join(', ')}
                                            </p>
                                            <p>
                                                <b>Cena:</b>{' '}
                                                {offer && offer.price}zł/1h
                                            </p>
                                            <p>
                                                <b>Poziom nauczania: </b>
                                                {offer &&
                                                    offer.level
                                                        .map((el) => el)
                                                        .join(', ')}
                                            </p>
                                            <p>
                                                <b>Adres e-mail:</b>{' '}
                                                {offer && offer.email}
                                            </p>
                                            <p>
                                                <b>Numer telefonu:</b>{' '}
                                                {offer && offer.phoneNumber}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.offerDetails__bottom}>
                                    {/* {offer && offer.description} */}
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit. Curabitur sed laoreet
                                        diam. Nunc nec metus vel magna
                                        scelerisque fringilla. Mauris aliquam
                                        congue odio. Nulla pulvinar diam in
                                        turpis placerat fermentum. Curabitur vel
                                        sapien sit amet ligula imperdiet rutrum
                                        a sit amet dui.
                                    </p>
                                    <p>
                                        Cras ante lorem, dignissim eget urna ut,
                                        viverra tristique elit. Etiam viverra
                                        ultrices quam non lacinia. Nullam
                                        pharetra gravida ante. Vestibulum eget
                                        arcu ornare, pretium lectus eu,
                                        consequat purus. Integer venenatis felis
                                        non nulla dictum aliquet. Donec dictum
                                        augue id lorem porta pellentesque.
                                        Nullam ac cursus ex. Suspendisse sodales
                                        purus nibh, sed accumsan dui
                                        sollicitudin a.
                                    </p>
                                    <p>
                                        Quisque luctus, neque id efficitur
                                        dictum, turpis sapien suscipit lectus,
                                        sit amet elementum est velit vitae leo.
                                        Vestibulum sem metus, accumsan id diam
                                        in, posuere fringilla enim. Proin
                                        dignissim massa ac orci aliquet, et
                                        pulvinar ipsum posuere. Nam pharetra
                                        commodo nulla, quis fringilla magna
                                        convallis sit amet. Fusce quis nisl et
                                        ipsum mattis blandit.
                                    </p>
                                </div>
                                <img
                                    src={fav}
                                    alt="fav"
                                    className={styles.offerDetails__fav}
                                />
                            </Card>
                            <Card className={styles.offerDetails__contact}>
                                <h3>Napisz wiadomość</h3>
                                <Form
                                    buttonLabel="Wyślij"
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
                                        name="phone"
                                        type="phone"
                                        placeholder="Numer telefonu"
                                        error={errors.phone?.message?.toString()}
                                        autoFocus
                                    />
                                    <Textarea
                                        name="mess"
                                        placeholder="Treść wiadomości"
                                        error={errors.mess?.message?.toString()}
                                        autoFocus
                                    />
                                    <p> </p>
                                </Form>
                            </Card>
                        </div>
                    </Container>
                </div>
            </div>
        </>
    );
};

export default OfferDetails;
