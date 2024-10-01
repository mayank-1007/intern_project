import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, store as storeInfo } from '../features/userSlice';

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);
    const [teamName, setTeamName] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [storedInfo, setStoredInfo] = useState(null);

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('user');
        


        if (storedUserInfo) {
            try {
                const parsedUserInfo = JSON.parse(storedUserInfo);
                dispatch(storeInfo(parsedUserInfo));
                setStoredInfo(parsedUserInfo);
            } catch (error) {
                console.error('Error parsing user info:', error);
                setError('Failed to load user data.');
            }
        }
    }, [dispatch]);

    useEffect(() => {
        const fetchTeamData = async () => {
            if (!storedInfo?.team) {
                console.error('No team information available in storedInfo:', storedInfo);
                setLoading(false);
                return; // Early return if team info is missing
            }
        
            setLoading(true);
            try {
                const response = await axios.post('https://intern-project-backend-fgxq.onrender.com/api/teamData', { teamId: storedInfo.team });
                setTeamName(response.data.name);
                
                const memberIds = response.data.members;
                const membersResponse = await Promise.all(
                    memberIds.map(memberId => axios.post(`https://intern-project-backend-fgxq.onrender.com/api/usersone`, { id: memberId }))
                );
        
                const membersData = membersResponse.map(res => res.data);
                setTeamMembers(membersData);
            } catch (err) {
                console.error('Error fetching team data:', err); // Log detailed error
                if(err.response.status===404){
                    setLoading(false);
                    return;
                }
                else setError(err.message);
            } finally {
                console.log("Finished fetching team data"); // Log this to confirm the finally block is executed
                setLoading(false);
            }
        };
        
        if(storedInfo?.team){
            console.log("storedInfo-----", storedInfo);
            fetchTeamData();
        }
        setLoading(false);

    }, [storedInfo]); // Trigger fetch whenever storedInfo changes

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="sidebar">
            <h2>{storedInfo?.name ? `${storedInfo.name}'s Profile` : "Profile"}</h2>
            <button onClick={() => {
                dispatch(logout(storedInfo));
                localStorage.clear('user');
                sessionStorage.clear('user'); 
                Cookies.remove('cookieName'); 
                console.log("User logged out!");
                navigate('/login');
            }}>Logout</button>
            <button onClick={() => navigate('/addtask')}>Add and assign tasks</button>
            {teamName ? <h3>Team Members of {teamName.toUpperCase()}</h3> : <h3>No team Found</h3>}
            <ul>
                {teamMembers.map((member) => (
                    <li key={member._id}>{member.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
