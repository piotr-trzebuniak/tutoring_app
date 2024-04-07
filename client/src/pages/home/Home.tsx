/* eslint-disable no-console */
import styles from './Home.module.scss';
import SearchInputs from '../../components/SearchInputs/SearchInputs';

const Home = () => {

    return (
        <div className={styles.home}>
            <div className={styles.home__banner}>
                <h2 className='heading'>
                    Szukasz korepetytora?
                </h2>
                <p>Znajdź go z fajne-korki.pl</p>
                <SearchInputs className={styles.home__form} />
            </div>
        </div>
    );
};

export default Home;
