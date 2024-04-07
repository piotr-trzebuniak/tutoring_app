import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';


const PrivateRouteTeacher = () => {
    const {currentUser} = useAppSelector(state => state.user)
  return currentUser.accountType === "teacher" ? <Outlet /> : <Navigate to='/' />
}

export default PrivateRouteTeacher