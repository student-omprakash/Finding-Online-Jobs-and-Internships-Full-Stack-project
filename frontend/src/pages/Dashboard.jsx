import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import RecruiterDashboard from './RecruiterDashboard';

const Dashboard = () => {
    const { user, loading } = useAuth();
    console.log('Dashboard Render:', { user, loading });


    if (loading) {
        console.log('Dashboard: Rendering Spinner');
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
    }

    if (!user) {
        console.log('Dashboard: Rendering Login Prompt (User is null)');
        return (
            <div className="flex justify-center items-center h-64 text-red-500 font-bold">
                Please log in to access the dashboard.
            </div>
        );
    }

    if (user.role === 'recruiter') {
        console.log('Dashboard: Rendering RecruiterDashboard');
        return <RecruiterDashboard />;
    }

    console.log('Dashboard: Rendering StudentDashboard');
    return <StudentDashboard />;
};

export default Dashboard;
