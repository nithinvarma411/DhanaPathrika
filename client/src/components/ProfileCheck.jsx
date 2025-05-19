import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfileCheck = ({ children }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkProfile = async () => {
            try {
                

                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/v1/profile/getProfile`,{withCredentials: true});

                if (!response.data.isProfileComplete) {
                    navigate('/details');
                    return;
                }

                setLoading(false);
            } catch (error) {
                console.error('Profile check failed:', error);
                navigate('/login');
            }
        };

        checkProfile();
    }, [navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return children;
};

export default ProfileCheck;
