import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { assignTask } from '../redux/taskSlice';

const TaskItem = ({ task, setCurrentTask, onDelete }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');

  const handleAssign = (e) => {
    e.preventDefault();
    console.log(email, task._id);
    dispatch(assignTask({ id : task._id, email: email.toString()  }));
    setEmail('');
  }
  return (
    <div>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
      <p>Assigned User: {task.assignedUser}</p>
      <p>Priority: {task.priority}</p>
      <input 
        type="text" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="Enter email"
      />
      <button onClick={handleAssign}>Assign</button>
      <br/>
      <button onClick={() => setCurrentTask(task)}>Edit</button>
      <button onClick={() => onDelete(task._id)}>Delete</button>
    </div>
  );
};

export default TaskItem;
