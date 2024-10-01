import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, deleteTask } from '../redux/taskSlice';
import { logout, store as storeInfo } from '../features/userSlice';
import TaskForm from './TaskForme';
import TaskItem from './TaskItem';

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);
    const [teamName, setTeamName] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [storedInfo, setStoredInfo] = useState(null);
    const itemsPerPage = 2; // Number of tasks per page
    const [currentPage, setCurrentPage] = useState(1);
    
    const { tasks } = useSelector((state) => state.tasks);
    const [currentTask, setCurrentTask] = useState(null);
    const [filters, setFilters] = useState({ status: '', priority: '', assignedUser: '', page: 1 });
    
    // Filter tasks assigned to the current user
    const filteredTasks = tasks.filter(task => 
        task.assignedUser.includes(storedInfo?.email) // Assuming `storedInfo.email` is the current user's email
    );

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTasks = filteredTasks.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
      };
    useEffect(() => {
        dispatch(fetchTasks(filters));
    }, [dispatch, filters]);

    const handleDelete = (id) => {
        dispatch(deleteTask(id));
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const storedUserInfo = localStorage.getItem('user');
        if (storedUserInfo) {
            const parsedUserInfo = JSON.parse(storedUserInfo);
            dispatch(storeInfo(parsedUserInfo));
            setStoredInfo(parsedUserInfo);
        }
    }, [dispatch]);

    useEffect(() => {
        const fetchTeamData = async () => {
            if (storedInfo?.team) {
                setLoading(true);
                try {
                    const response = await axios.post('http://localhost:5000/api/teamData', { teamId: storedInfo.team });
                    setTeamName(response.data.name);
                    
                    const memberIds = response.data.members;
                    const membersResponse = await Promise.all(
                        memberIds.map(memberId => axios.post(`http://localhost:5000/api/usersone`, { id: memberId }))
                    );

                    const membersData = membersResponse.map(res => res.data);
                    setTeamMembers(membersData);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTeamData();
    }, [storedInfo]); // Trigger fetch whenever storedInfo changes

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
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
                <h3>Team Members of {teamName.toUpperCase()}</h3>
                <ul>
                    {teamMembers.map((member) => (
                        <li key={member._id}>{member.name}</li>
                    ))}
                </ul>
            </div>
            <div>
                <TaskForm currentTask={currentTask} setCurrentTask={setCurrentTask} />
                <div>
                    <input type="text" name="assignedUser" placeholder="Filter by assigned user" onChange={handleFilterChange} />
                    <select name="status" onChange={handleFilterChange}>
                        <option value="">All Status</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <select name="priority" onChange={handleFilterChange}>
                        <option value="">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Task Name</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentTasks.map((task) => (
                                <TaskItem key={task._id} task={task} setCurrentTask={setCurrentTask} onDelete={handleDelete} />
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                        >
                            &lt; Previous
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button 
                                key={index + 1} 
                                onClick={() => handlePageChange(index + 1)} 
                                disabled={index + 1 === currentPage}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                        >
                            Next &gt;
                        </button>
                    </div>
                </div>  
            </div>
        </div>
    );
};

export default Sidebar;
