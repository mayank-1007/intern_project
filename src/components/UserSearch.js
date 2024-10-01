import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import '../App.css';

const UserSearch = () => {
    const [name, setName] = useState('');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentTeamm, setCurrentTeam] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://intern-project-backend-fgxq.onrender.com/api/users');
                setUsers(response.data);
                setFilteredUsers(response.data);
                localStorage.setItem('users', JSON.stringify(response.data)); // Cache in localStorage
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        

        
        fetchUsers();
        
        const currentTeam = localStorage.getItem('user');
        setCurrentTeam(currentTeam);
        if(currentTeam){
            const currentTeamId = JSON.parse(currentTeam).team;
            setSelectedUser(currentTeamId);
            console.log(currentTeamId);
        }
    }, []);

    const debouncedSearch = _.debounce((searchTerm) => {
        if (searchTerm) {
            const filtered = users.filter(user =>
                user.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, 300);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setName(value);
        debouncedSearch(value);
    };

    const handleUserSelect = async (user) => {
        if (user.team) {
            alert('User is already in a team, not possible to add.');
            return;
        }
        console.log(user._id, selectedUser);

        try {
            const response = await axios.post('https://intern-project-backend-fgxq.onrender.com/api/teams/update', {
                userId: user._id,
                teamId: selectedUser
            });
            console.log('User added to team:', response.data);
            window.location.reload();
            // Optionally, update local state or show success message
        } catch (error) {
            console.error('Error updating team:', error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={name}
                onChange={handleInputChange}
                placeholder="Search for users and select the user name to add to team"
                className="search-input"
            />
            {loading ? <p>Loading...</p> : (
                <ul className="search-results">
                    {filteredUsers.map((user) => (
                        <li key={user._id} onClick={() => handleUserSelect(user)} className="user-item">
                            {user.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default UserSearch;
