import { useState, useEffect } from 'react';
import { demoBookingsAPI } from '../../services/api';

const DemoBookingManager = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await demoBookingsAPI.getAll();
            setBookings(data.bookings || []);
        } catch (error) {
            console.error('Failed to fetch demo bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await demoBookingsAPI.updateStatus(id, { status });
            fetchBookings();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                await demoBookingsAPI.delete(id);
                fetchBookings();
            } catch (error) {
                console.error('Failed to delete booking:', error);
            }
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        return booking.status === filter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#ffc107';
            case 'contacted': return '#17a2b8';
            case 'confirmed': return '#28a745';
            case 'cancelled': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="admin-section">
                <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i> Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2><i className="fas fa-calendar-check"></i> Demo Bookings</h2>
                <div className="filter-buttons">
                    <button 
                        className={filter === 'all' ? 'active' : ''} 
                        onClick={() => setFilter('all')}
                    >
                        All ({bookings.length})
                    </button>
                    <button 
                        className={filter === 'pending' ? 'active' : ''} 
                        onClick={() => setFilter('pending')}
                    >
                        Pending ({bookings.filter(b => b.status === 'pending').length})
                    </button>
                    <button 
                        className={filter === 'contacted' ? 'active' : ''} 
                        onClick={() => setFilter('contacted')}
                    >
                        Contacted ({bookings.filter(b => b.status === 'contacted').length})
                    </button>
                    <button 
                        className={filter === 'confirmed' ? 'active' : ''} 
                        onClick={() => setFilter('confirmed')}
                    >
                        Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
                    </button>
                </div>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="empty-state">
                    <i className="fas fa-calendar-times"></i>
                    <p>No demo bookings found</p>
                </div>
            ) : (
                <div className="table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Preferred Date</th>
                                <th>Preferred Time</th>
                                <th>Booking Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td>{booking.name}</td>
                                    <td>
                                        <a href={`tel:${booking.phone}`} className="phone-link">
                                            <i className="fas fa-phone"></i> {booking.phone}
                                        </a>
                                    </td>
                                    <td>{formatDate(booking.preferredDate)}</td>
                                    <td>{booking.preferredTime}</td>
                                    <td>{formatDate(booking.createdAt)}</td>
                                    <td>
                                        <span 
                                            className="status-badge" 
                                            style={{ backgroundColor: getStatusColor(booking.status) }}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            {booking.status === 'pending' && (
                                                <button
                                                    className="btn-action btn-contacted"
                                                    onClick={() => handleStatusUpdate(booking._id, 'contacted')}
                                                    title="Mark as Contacted"
                                                >
                                                    <i className="fas fa-phone-alt"></i>
                                                </button>
                                            )}
                                            {booking.status === 'contacted' && (
                                                <button
                                                    className="btn-action btn-confirm"
                                                    onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                                                    title="Mark as Confirmed"
                                                >
                                                    <i className="fas fa-check"></i>
                                                </button>
                                            )}
                                            {booking.status !== 'cancelled' && (
                                                <button
                                                    className="btn-action btn-cancel"
                                                    onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                                                    title="Cancel Booking"
                                                >
                                                    <i className="fas fa-times"></i>
                                                </button>
                                            )}
                                            <button
                                                className="btn-action btn-delete"
                                                onClick={() => handleDelete(booking._id)}
                                                title="Delete Booking"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DemoBookingManager;
