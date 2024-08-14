import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/MyCampaign.css';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link } from 'react-router-dom';
import Header from './Header';

const EditModal = ({ isOpen, onClose, onSave, editData, handleInputChange }) => {
    if (!isOpen) return null;

    const handleDescriptionChange = (value) => {
        handleInputChange({ target: { name: 'description', value } });
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Edit Campaign</h2>
                <input
                    type="text"
                    name="title"
                    value={editData.title}
                    onChange={handleInputChange}
                    className="campaign-input"
                    placeholder="Campaign Title"
                />
                <textarea
                    name="aim"
                    value={editData.aim}
                    onChange={handleInputChange}
                    className="campaign-input"
                    placeholder="Campaign Aim"
                />
                <input
                    type="text"
                    name="image"
                    value={editData.image}
                    onChange={handleInputChange}
                    className="campaign-input"
                    placeholder="Image URL"
                />
                <input
                    type="text"
                    name="video"
                    value={editData.video}
                    onChange={handleInputChange}
                    className="campaign-input"
                    placeholder="Video URL"
                />
                <ReactQuill
                    value={editData.description}
                    onChange={handleDescriptionChange}
                    className="campaign-input"
                    placeholder="Campaign Description"
                />
                <input
                    type="date"
                    name="startDate"
                    value={editData.startDate}
                    onChange={handleInputChange}
                    className="campaign-input"
                />
                <input
                    type="date"
                    name="endDate"
                    value={editData.endDate}
                    onChange={handleInputChange}
                    className="campaign-input"
                />
                <div className="modal-actions">
                    <button onClick={onSave} className="save-button">Save</button>
                    <button onClick={onClose} className="cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    );
};

const MyCampaign = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [editData, setEditData] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await axios.get('https://fundraising-platform.onrender.com/api/getUserCampaign', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCampaigns(response.data.data);
            } catch (error) {
                console.error('Error fetching campaigns:', error.response?.data?.message || error.message);
            }
        };

        fetchCampaigns();
    }, []);

    const handleEditClick = (campaign) => {
        setEditMode(campaign.campaignId);
        setEditData({
            title: campaign.title,
            aim: campaign.aim,
            image: campaign.image,
            video: campaign.video,
            description: campaign.description,
            startDate: new Date(campaign.startDate).toISOString().split('T')[0],
            endDate: new Date(campaign.endDate).toISOString().split('T')[0],
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({
            ...prevData,
            [name]: name === 'startDate' || name === 'endDate' ? new Date(value).toISOString().split('T')[0] : value,
        }));
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`https://fundraising-platform.onrender.com/api/updateCampaign/${editMode}`, editData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCampaigns((prevCampaigns) =>
                prevCampaigns.map((campaign) =>
                    campaign.campaignId === editMode ? response.data.data : campaign
                )
            );
            setEditMode(null);
            setIsModalOpen(false);
            toast.success("Campaign Updated Successfully");
        } catch (error) {
            console.error('Error updating campaign:', error.response?.data?.message || error.message);
            toast.error("Failed to update Campaign");
        }
    };

    const handleCancel = () => {
        setEditMode(null);
        setEditData({});
        setIsModalOpen(false);
    };

    const handleDelete = async (campaignId) => {
        try {
            await axios.delete(`https://fundraising-platform.onrender.com/api/deleteCampaign/${campaignId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCampaigns(campaigns.filter((campaign) => campaign.campaignId !== campaignId));
            toast.success("Campaign deleted successfully");
        } catch (error) {
            console.error('Error deleting campaign:', error.response?.data?.message || error.message);
            toast.error("Failed to delete Campaign");
        }
    };

    return (
        <>
            <Header />
            <ToastContainer />
            <div className="my-campaigns">
                <h2>My Campaigns</h2>
                {campaigns.length > 0 ? (
                    <div className="campaign-list">
                        {campaigns.map((campaign) => (
                            <div key={campaign.campaignId} className="campaign-card">
                                <img src={campaign.image} alt={campaign.title} className="campaign-cover" />
                                <div className="campaign-info">
                                    <h3>{campaign.title}</h3>
                                    <p>{campaign.aim}</p>
                                    <div className="campaign-actions">
                                        <button onClick={() => handleEditClick(campaign)}> <i className="fas fa-edit"></i>Edit</button>
                                        <button
                                            style={{
                                                padding: '10px 20px',
                                                border: 'none',
                                                borderRadius: '5px',
                                                cursor: 'pointer',
                                                backgroundColor: '#f44336', 
                                                color: 'white', 
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px'
                                            }}
                                            onClick={() => handleDelete(campaign.campaignId)}
                                        >
                                            <i className="fas fa-trash"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-campaigns">
                         <div className="illustration">
            <i className="fas fa-clipboard"></i>
                 </div>
                        <p className="no-campaigns-message">You haven't created any campaigns yet!</p>
                        <Link  to = "/createcampaign" className="create-campaign-button">Create Your First Campaign</Link>
                    </div>
                )}
            </div>
            <EditModal
                isOpen={isModalOpen}
                onClose={handleCancel}
                onSave={handleSave}
                editData={editData}
                handleInputChange={handleInputChange}
            />
        </>
    );
};

export default MyCampaign;

