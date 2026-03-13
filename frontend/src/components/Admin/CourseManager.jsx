import { useState, useEffect } from 'react';
import { coursesAPI } from '../../services/api';
import ConfirmDialog from '../ConfirmDialog';
import Toast from '../Toast';

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null });
  const [toast, setToast] = useState(null);
  const [currentCourse, setCurrentCourse] = useState({
    title: '',
    description: '',
    duration: '',
    price: '',
    class: '10',
    medium: 'Both',
    features: [],
    subjects: [],
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await coursesAPI.getAll();
      setCourses(res.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    const { id } = deleteDialog;
    try {
      await coursesAPI.delete(id);
      fetchCourses();
      setToast({ message: 'Course deleted successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Error deleting course.', type: 'error' });
    } finally {
      setDeleteDialog({ isOpen: false, id: null });
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, id: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await coursesAPI.update(currentCourse._id, currentCourse);
        setToast({
          message: 'Course updated successfully!',
          type: 'success',
        });
      } else {
        await coursesAPI.create(currentCourse);
        setToast({ message: 'Course added successfully!', type: 'success' });
      }

      setIsEditing(false);
      setCurrentCourse({
        title: '',
        description: '',
        duration: '',
        price: '',
        class: '10',
        medium: 'Both',
        features: [],
        subjects: [],
      });
      fetchCourses();
    } catch (error) {
      setToast({
        message: 'Error saving course. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <div className="admin-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="question-manager-header">
        <h2 className="admin-header-title">Course Manager</h2>
      </div>

      <form onSubmit={handleSubmit} className="admin-card question-form-card">
        <h3 className="question-form-title">
          {isEditing ? 'Edit Course' : 'Add New Course'}
        </h3>

        <div className="question-form-grid">
          <div className="form-group">
            <label className="form-label">Course Title</label>
            <input
              type="text"
              name="title"
              value={currentCourse.title}
              onChange={handleInputChange}
              placeholder="Enter course title"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={currentCourse.description}
              onChange={handleInputChange}
              placeholder="Enter course description"
              required
              className="form-input question-textarea"
              rows="4"
            />
          </div>

          <div className="select-filters-grid">
            <div className="form-group">
              <label className="form-label">Class</label>
              <select
                name="class"
                value={currentCourse.class}
                onChange={handleInputChange}
                required
                className="form-input"
              >
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Medium</label>
              <select
                name="medium"
                value={currentCourse.medium}
                onChange={handleInputChange}
                required
                className="form-input"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Both">Both</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Duration</label>
              <input
                type="text"
                name="duration"
                value={currentCourse.duration}
                onChange={handleInputChange}
                placeholder="e.g., 1 Year"
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={currentCourse.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {isEditing ? 'Update Course' : 'Save Course'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentCourse({
                    title: '',
                    description: '',
                    duration: '',
                    price: '',
                    class: '10',
                    medium: 'Both',
                    features: [],
                    subjects: [],
                  });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="admin-card">
        <div className="questions-list-header">
          <h3 className="questions-list-title">All Courses</h3>
        </div>

        <div className="enrollment-list-mobile">
          {courses.map((course) => (
            <div key={course._id} className="enrollment-card-mobile">
              <div className="enrollment-card-header">
                <div>
                  <div className="enrollment-student-name question-card-text">
                    {course.title}
                  </div>
                  <div className="enrollment-date">
                    Class {course.class} • {course.medium} • {course.duration} • ₹{course.price}
                  </div>
                  <div className="enrollment-date" style={{ marginTop: '5px' }}>
                    {course.description.length > 80
                      ? course.description.substring(0, 80) + '...'
                      : course.description}
                  </div>
                </div>
              </div>
              <div className="question-card-actions">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setCurrentCourse(course);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-action btn-view"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    setDeleteDialog({ isOpen: true, id: course._id })
                  }
                  className="btn-action btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-table-wrapper enrollment-table-desktop">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Course Title</th>
                <th>Class</th>
                <th>Medium</th>
                <th>Duration</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td className="question-table-chapter">{course.title}</td>
                  <td>Class {course.class}</td>
                  <td>{course.medium}</td>
                  <td>{course.duration}</td>
                  <td>₹{course.price}</td>
                  <td className="question-table-text">
                    {course.description.length > 60
                      ? course.description.substring(0, 60) + '...'
                      : course.description}
                  </td>
                  <td>
                    <div className="question-table-actions">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setCurrentCourse(course);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="btn-action btn-view"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setDeleteDialog({ isOpen: true, id: course._id })
                        }
                        className="btn-action btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default CourseManager;
