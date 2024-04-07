import classNames from 'classnames';
import { v4 as uuidv4 } from 'uuid';
import style from './Offers.module.scss';
import Container from '../../components/UI/Container/Container';
import SearchInputs from '../../components/SearchInputs/SearchInputs';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchComponent from '../../components/SearchComponent/SearchComponent';
import OfferCard from './OfferCard/OfferCard';
import Loader from '../../components/Loader/Loader';
import Button from '../../components/UI/Button/Button';

const Offers = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [searchData, setSearchData] = useState({
        searchSubject: '',
        searchLocation: '',
        typeClasses: '',
        pricePerHour: '',
        gender: '',
    });
    const [offers, setOffers] = useState([]);
    // console.log(searchData)
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchSubjectFromUrl = urlParams.get('searchSubject');
        const searchLocationFromUrl = urlParams.get('searchLocation');
        const typeClassesFromUrl = urlParams.get('typeClasses');
        const pricePerHourFromUrl = urlParams.get('pricePerHour');
        const genderFromUrl = urlParams.get('gender');

        if (
            searchSubjectFromUrl ||
            searchLocationFromUrl ||
            typeClassesFromUrl ||
            pricePerHourFromUrl ||
            genderFromUrl
        ) {
            setSearchData({
                ...searchData,
                searchSubject: searchSubjectFromUrl,
                searchLocation: searchLocationFromUrl,
                typeClasses: typeClassesFromUrl,
                pricePerHour: pricePerHourFromUrl,
                gender: genderFromUrl,
            });
        }

        const fetchOffers = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/offer/getoffers?${searchQuery}`);
            if (!res.ok) {
                setLoading(false);
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setOffers(data);
                setLoading(false);

                if (data.length > 9) {
                    setShowMore(true);
                } else {
                    setShowMore(false);
                }
            }
        };
        fetchOffers();
    }, [location.search]);

    const cleanFilter = () => {
        window.location.reload(false);
        navigate('/offers?searchSubject=&searchLocation=')
    };

    const onShowMoreClick = async () => {
        const numberOfListings = offers.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/offer/getoffers?${searchQuery}`);
        const data = await res.json();
        if (data.length < 4) {
            setShowMore(false);
        }
        setOffers([...offers, ...data]);
    };

    return (
        <div className={style.offers}>
            {loading && <Loader />}
            <div className={style.offers__banner}>
                <Container>
                    <SearchInputs />
                    <SearchComponent />
                    <span className={style.offers__clean} onClick={cleanFilter}>
                        Wyczyść filtry
                    </span>
                </Container>
            </div>
            <Container>
                <div className={style.offers__main}>
                    {loading === false && offers.length === 0 && (
                        <h3
                            className={classNames(
                                style['offers__main-heading']
                            )}
                        >
                            Nie znaleziono żadnych ogłoszeń!
                        </h3>
                    )}
                    {offers.length > 0 && (
                        <h3
                            className={classNames(
                                style['offers__main-heading']
                            )}
                        >
                            Znaleziono {offers.length} ogłoszeń
                        </h3>
                    )}
                </div>

                {!loading &&
                    offers &&
                    offers.map((offers) => (
                        <OfferCard 
                            subject={offers.subject}
                            location={offers.location}
                            imageUrl={offers.imageUrl}
                            price={offers.price}
                            offers={offers._id}
                            key={uuidv4()}
                        />
                    ))}
                {showMore && (
                    <Button
                        onClick={() => {
                            onShowMoreClick();
                        }}
                    >Pokaż więcej</Button>
                )}
            </Container>
        </div>
    );
};

export default Offers;
