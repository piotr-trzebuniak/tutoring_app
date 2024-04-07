/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import { GoLocation } from 'react-icons/go';
import styles from './OfferCard.module.scss';
import Button from '../../../components/UI/Button/Button';


type Props = {
    subject?: string;
    location?: string;
    imageUrl?: string;
    price?: number;
    offers?:any;
};
const OfferCard: React.FC<Props> = ({
    subject = '',
    location = '',
    imageUrl = 0,
    price = '',
    offers
}) => {
    const subjectTransform = subject[0].toUpperCase() + subject.slice(1);

    // console.log(offers)

    return (
        <div className={styles.offer}>
            <img
                className={styles.offer__photo}
                src={imageUrl}
                alt="Avatar"
            />
            <div className={styles.offer__info}>
                <h4 className={styles.offer__heading}>{subjectTransform}</h4>
                <p className={styles.offer__text}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Proin arcu elit, semper ac vulputate nec, malesuada sed
                    quam. Maecenas euismod nec orci at feugiat. Quisque lacinia
                    eleifend congue. Fusce blandit, velit ac imperdiet
                    ullamcorper, lorem mauris eleifend orci, rutrum pulvinar
                    mauris ante nec magna.
                </p>
                <div className={styles.offer__location}>
                    <GoLocation size={20} />
                    <span>{location}</span>
                </div>
            </div>
            <div className={styles.offer__info2}>
                <p>{price}zł / 60min</p>
                <Link to={`/offer-details/${offers}`}>
                    <Button>Zobacz więcej</Button>{' '}
                </Link>
            </div>
        </div>
    );
};

export default OfferCard;
