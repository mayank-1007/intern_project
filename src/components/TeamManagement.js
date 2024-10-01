import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const TeamManagement = () => {
    const [teamName, setTeamName] = useState('');
    const [teamNameId, setTeamNameId] = useState('');
    const [counter, setCounter] = useState(0);
    const userInfo = useSelector((state) => state.user.userInfo);
    
    useEffect(() => {
        // On mount, retrieve user info from local storage if not available in Redux
        const storedUserInfo = localStorage.getItem('user');
        if (!userInfo && storedUserInfo) {
            // Dispatch action to update Redux state from local storage (not shown)
            const parsedUserInfo = JSON.parse(storedUserInfo);
            console.log(parsedUserInfo);
            // setTeamName(parsedUserInfo.team);
            setTeamNameId(parsedUserInfo._id);
        }
    }, [userInfo]);

    const handleCreateTeam = async () => {
        setCounter(counter + 1);
        const userId = userInfo?._id || JSON.parse(localStorage.getItem('user'))?._id;
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://intern-project-backend-fgxq.onrender.com/api/users');
                localStorage.setItem('users', JSON.stringify(response.data)); // Cache in localStorage
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const fetchUsersOne = async () => {
            try {
                const response = await axios.post('https://intern-project-backend-fgxq.onrender.com/api/usersone', {  id: teamNameId });
                localStorage.setItem('user', JSON.stringify(response.data)); // Cache in localStorage
            } catch (error) {
                console.error('Error fetching user:', error.message);
            }
        };

        try {
            const response = await axios.post('https://intern-project-backend-fgxq.onrender.com/api/teams', { name: teamName, userId });
            console.log('Team created:', response.data);
            // localStorage.clear('user');
            fetchUsers();
            fetchUsersOne();

            // Optionally update state with team info after creation
            setTeamName('');
            window.location.reload();
            // Refresh only necessary part instead of full reload
        } catch (error) {
            console.error('Error creating team:', error);
        }
    };

    return (
        <div>
            {!JSON.parse(localStorage.getItem('user')).team ? 
            <div>
                <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter team name"
                />
                <button onClick={handleCreateTeam}>Create Team</button>
            </div>
            :
            null
            }
        </div>
    );
};

export default TeamManagement;
