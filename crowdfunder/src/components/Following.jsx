import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Following.css';
import Header from './Header';

const Following = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchFollowingCampaigns = async () => {
            try {
                const response = await axios.get('https://fundraising-platform.onrender.com/api/getFollowingCampaigns', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.success) {
                    if (response.data.data && response.data.data.campaignIds) {
                        const campaignIds = response.data.data.campaignIds;
                        fetchCampaignDetails(campaignIds);
                    } 
                } else {
                    setError('Failed to fetch following campaigns.');
                }
            } catch (err) {
                setError('An error occurred while fetching campaigns.');
            }
        };

        const fetchCampaignDetails = async (campaignIds) => {
            try {
                const campaignDetails = await Promise.all(campaignIds.map(id =>
                    axios.get(`https://fundraising-platform.onrender.com/api/getCampaignBycampaign/${id}`)
                ));
                setCampaigns(campaignDetails.map(response => response.data.data));
            } catch (err) {
                setError('An error occurred while fetching campaign details.');
            }
        };

        fetchFollowingCampaigns();
    }, [token]);

    const handleUnfollow = async (campaignId) => {
        try {
            await axios.post(`https://fundraising-platform.onrender.com/api/unfollow`, {
                campaignId: campaignId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCampaigns(campaigns.filter(campaign => campaign.campaignId !== campaignId));
            toast.success('Successfully unfollowed the campaign.');
        } catch (err) {
            toast.error('Failed to unfollow the campaign.');
        }
    };

    return (
        <>
            <Header />
            <ToastContainer />
            <div className="following">
                {error && <p className="error">{error}</p>}
                {campaigns.length === 0 ? (
                    <div className="no-following">
                        <div className="illustration">
                            <i className="fas fa-heart-broken"></i>
                        </div>
                        <h2>No Following Campaigns</h2>
                        <p>You're not following any campaigns at the moment.</p>
                    </div>
                ) : (
                    <div className="campaign-list">
                        {campaigns.map(campaign => (
                            <div key={campaign._id} className="campaign-item">
                                <img src={campaign.image} alt={campaign.title} />
                                <h3>{campaign.title}</h3>
                                <p>{campaign.aim}</p>
                                <button onClick={() => handleUnfollow(campaign.campaignId)}>Unfollow</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Following;

