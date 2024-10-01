import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTask } from '../redux/taskSlice';
import TaskForm from './TaskForme';
import TaskItem from './TaskItem';
import { useNavigate } from 'react-router-dom';

const TaskList = () => {
  const itemsPerPage = 2; // Number of tasks per page
  const [currentPage, setCurrentPage] = useState(1);
  
  

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate the tasks to display for the current page
  const navigate = useNavigate();
  
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const [currentTask, setCurrentTask] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '', assignedUser: '', page: 1 });
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTasks = tasks.slice(startIndex, startIndex + itemsPerPage);


  useEffect(() => {
    dispatch(fetchTasks(filters));
  }, [dispatch, filters]);

  const handleDelete = (id) => {
    dispatch(deleteTask(id));
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };
  const totalPages = Math.ceil(tasks.length / itemsPerPage);

  return (
    <div>
      <button onClick={() => navigate('/')}>Main Page</button>
      <button onClick={() => navigate('/score')}>Check the scores</button>
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
        {/* <button onClick={() => setFilters({ ...filters, page: filters.page + 1 })}>Next Page</button> */}
      </div>
      <div>
      <table>
        <thead>
          <tr>
            <th>Task Name</th>
          </tr>
        </thead>
        <tbody>
          {currentTasks.map((task) => (
            <TaskItem key={task._id} task={task} setCurrentTask={setCurrentTask} onDelete={handleDelete} />
          ))}
        </tbody>
      </table>

      <div className="">
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
  );
}

export default TaskList;
