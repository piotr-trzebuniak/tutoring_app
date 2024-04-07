import { useDispatch } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { RiAccountCircleFill } from 'react-icons/ri';
import styles from './Header.module.scss';
import Container from '../UI/Container/Container';
import logoIcon from '../../assets/logo-icon.svg';
import Button from '../UI/Button/Button';
import { useAppSelector } from '../../redux/hooks';
import { signOut } from '../../redux/user/userSlice';


const Header = () => {
    const dispatch = useDispatch();
    const { currentUser } = useAppSelector((state) => state.user);

    const handleSignOut = async () => {
        try {
            await fetch('/api/auth/signout');
            dispatch(signOut());
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <header className={styles.header}>
            <Container className={styles.header__container}>
                <div className={styles.header__logo}>
                    <img src={logoIcon} alt="Logo icon" />
                    <Link to="/">fajne-korki.pl</Link>
                </div>
                {currentUser ? (
                    <div className={styles.header__btns}>
                        {currentUser.accountType === 'student' ? (
                            <Link to="/" className={styles.header__login}>
                                {/* Obserwowane */}
                            </Link>
                        ) : (
                            <Link
                                to="/my-offer"
                                className={styles.header__login}
                            >
                                Moje ogłoszenia
                            </Link>
                        )}
                        <Link
                            to="/"
                            onClick={handleSignOut}
                            className={styles.header__login}
                        >
                            Wyloguj się
                        </Link>
                        <Link to="/profile">
                            <img
                                src={currentUser.profilePicture}
                                alt="avatar"
                                className={styles.header__avatar}
                            />
                        </Link>
                    </div>
                ) : (
                    <div className={styles.header__btns}>
                        <div className={styles.header__icon}>
                            <RiAccountCircleFill size={30} color="#0E0D0D" />
                        </div>
                        <Link to="/login" className={styles.header__login}>
                            Zaloguj się
                        </Link>
                        <NavLink to="/register">
                            <Button className={styles.header__register}>
                                Załóż konto
                            </Button>
                        </NavLink>
                    </div>
                )}
            </Container>
        </header>
    );
};

export default Header;
