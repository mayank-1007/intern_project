import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createTask, updateTask } from '../redux/taskSlice';

const TaskForm = ({ currentTask, setCurrentTask }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    dueDate: '',
    assignedUser: '',
    priority: 'Medium',
  });

  useEffect(() => {
    if (currentTask) {
      setFormData(currentTask);
    }
  }, [currentTask]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentTask) {
      dispatch(updateTask({ id: currentTask._id, task: formData }));
    } else {
      dispatch(createTask(formData));
    }
    setFormData({
      title: '',
      description: '',
      status: 'To Do',
      dueDate: '',
      assignedUser: '',
      priority: 'Medium',
    });
    setCurrentTask(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>
      <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
      <input type="text" name="assignedUser" value={formData.assignedUser} onChange={handleChange} placeholder="Assigned User" />
      <select name="priority" value={formData.priority} onChange={handleChange}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
      <button type="submit">{currentTask ? 'Update Task' : 'Create Task'}</button>
    </form>
  );
};

export default TaskForm;
