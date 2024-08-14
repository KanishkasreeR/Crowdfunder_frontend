import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Box, Button, Container, Tabs, Tab, LinearProgress, Modal, TextField, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from './Header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';


const DetailContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '1200px',
}));

const TopContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: '2rem',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: 2,
  paddingRight: '2rem',
  [theme.breakpoints.down('sm')]: {
    paddingRight: '0',
    marginBottom: '1.5rem',
  },
}));

const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor: '#f9f9f9',
  padding: '1.5rem',
  borderRadius: '8px',
  [theme.breakpoints.down('sm')]: {
    padding: '1rem',
  },
}));

const VideoContainer = styled(Box)({
  width: '100%',
  height: '315px',
  marginBottom: '1.5rem',
});

const SupportButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5, 4),
  borderRadius: '25px',
  backgroundColor: '#E51D70',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#cc1a61',
  },
}));

const FollowButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5, 4),
  borderRadius: '25px',
  backgroundColor: '#2196F3',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#1976D2',
  },
}));

const CustomModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  padding: theme.spacing(4),
  borderRadius: '8px',
  width: '400px',
  boxShadow: theme.shadows[5],
  position: 'relative',
}));

const CloseButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  minWidth: 'auto',
  padding: theme.spacing(1),
}));

const BottomContainer = styled(Box)({
  marginTop: '2rem',
});

const extractVideoId = (url) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|v\/|embed\/|watch\?v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const preprocessDescription = (description) => {
  return description.replace(/<img /g, '<img style="width: 600px; height: 500px; object-fit: cover;" ');
};

const CampaignPage = () => {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isFollowed, setIsFollowed] = useState(false);
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const campaignId = query.get('id');

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await axios.get(`https://fundraising-platform.onrender.com/api/getCampaignBycampaign/${campaignId}`);
        if (response.data.success) {
          setCampaign(response.data.data);
        } else {
          setError('Failed to fetch campaign details');
        }
      } catch (err) {
        setError('An error occurred while fetching campaign details');
      } finally {
        setLoading(false);
      }
    };

    const checkUserFollowing = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      try {
        console.log(campaignId)
        const response = await axios.get(`https://fundraising-platform.onrender.com/api/isFollowing/${campaignId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success) {
          console.log(response.data.data.isFollowing)
          setIsFollowed(response.data.data.isFollowing);
        }
      } catch (err) {
        console.error('Error checking if user follows the campaign:', err);
      }
    };

    if (campaignId) {
      fetchCampaign();
      checkUserFollowing();
    } else {
      setError('Campaign ID not found in URL');
      setLoading(false);
    }
  }, [campaignId]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
  
    const token = localStorage.getItem('token');
  
    if (!token) {
      toast.error('You must be logged in to add a comment.');
      return;
    }
  
    try {
      const response = await axios.post(
        `https://fundraising-platform.onrender.com/api/addComment/${campaignId}`,
        { text: commentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        console.log(response.data.data.comments)
        setCampaign((prevCampaign) => ({
          ...prevCampaign,
          comments: response.data.data.comments, 
        }));
        setCommentText('');
      } else {
        setError('Failed to add comment');
      }
    } catch (err) {
      setError('An error occurred while adding the comment');
    }
  };

  const handleFollowToggle = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to follow this campaign.');
      return;
    }

    try {
      if (isFollowed) {
        await axios.post(`https://fundraising-platform.onrender.com/api/unfollow`, {
          campaignId:campaignId
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFollowed(false);
        toast.success('You have unfollowed the campaign.');
      } else {
        await axios.post(`https://fundraising-platform.onrender.com/api/follow`, {
          campaignId:campaignId
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFollowed(true);
        toast.success('You are now following the campaign.');
      }
    } catch (err) {
      toast.error('An error occurred while updating the follow status.');
    }
  };
  
  const handlePledge = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAmount('');
    setCustomAmount('');
  };

  const handleAmountChange = (event) => {
    setSelectedAmount(event.target.value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (event) => {
    setSelectedAmount('');
    setCustomAmount(event.target.value);
  };

  const handleEditComment = async (commentId, newText) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to edit a comment.');
      return;
    }
  
    try {
      const response = await axios.put(
        `https://fundraising-platform.onrender.com/api/updateComment/${campaignId}`,
        { commentId:commentId,
          text: newText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.success) {
        setCampaign((prevCampaign) => ({
          ...prevCampaign,
          comments: response.data.data.comments,
        }));
        toast.success('Comment updated successfully!');
      } else {
        setError('Failed to update comment');
      }
    } catch (err) {
      setError('An error occurred while updating the comment');
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to delete a comment.');
      return;
    }
  
    try {
      const response = await axios.delete(
        `https://fundraising-platform.onrender.com/api/deleteComment/${campaignId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { commentId }, 
        }
      );
  
      if (response.data.success) {
        toast.success('Comment deleted successfully!');
        setCampaign((prevCampaign) => ({
          ...prevCampaign,
          comments: response.data.data.comments,
        }));
        // window.location.reload();

       
      } else {
        setError('Failed to delete comment');
      }
    } catch (err) {
      console.error('Error deleting comment:', err); 
      setError('An error occurred while deleting the comment');
    }
  };
  
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleEditButtonClick = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditText(currentText);
  };

  const handleSaveEdit = (commentId) => {
    handleEditComment(commentId, editText);
    setEditingCommentId(null);
  };
  
  const handlePledgeSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to support this campaign.');
      return;
    }
  
    const amountToPledge = parseFloat(selectedAmount || customAmount);
  
    if (isNaN(amountToPledge)) {
      toast.error('Invalid pledge amount');
      return;
    }
  
    try {
      const response = await axios.post(`https://fundraising-platform.onrender.com/api/addPledge/${campaignId}`, {
        amount: amountToPledge,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data.success) {
        const {  updatedAmount, pledges } = response.data.data;
  
        setCampaign((prevCampaign) => ({
          ...prevCampaign,
          currentAmount: updatedAmount,
          pledges: pledges,
        }));
        
        setModalOpen(false);
        toast.success('Pledge added successfully!');
      } else {
        setError('Failed to create pledge');
      }
    } catch (err) {
      setError('An error occurred while creating the pledge');
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const remainingDays = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));
  const percentageRaised = ((campaign.currentAmount / campaign.goalAmount) * 100).toFixed(0);
  const videoId = extractVideoId(campaign.video);

  return (
    <>
    <Header/>
    <DetailContainer>
      <TopContainer>
        <LeftPanel>
          <Typography variant="h3" gutterBottom>{campaign.title}</Typography>
          <VideoContainer>
            {videoId && (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Campaign Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </VideoContainer>
        </LeftPanel>

        <RightPanel>
          <Typography variant="body1" gutterBottom>{campaign.aim}</Typography>
          <Typography variant="h4" gutterBottom>Rs. {campaign.currentAmount.toLocaleString()}</Typography>
          <Typography variant="body1" gutterBottom>Rs. {campaign.goalAmount.toLocaleString()} target</Typography>
          <Typography variant="body1" gutterBottom>{remainingDays} days left</Typography>
          <LinearProgress variant="determinate" value={percentageRaised} sx={{ marginBottom: '1rem' }} />
          <Typography variant="body2" gutterBottom>{percentageRaised}% raised</Typography>
          <SupportButton variant="contained" onClick={handlePledge}>
            Support Us
          </SupportButton>
          <FollowButton
            variant="outlined"
            onClick={handleFollowToggle}
            sx={{ marginTop: '1rem' }}
          >
            {isFollowed ? 'Unfollow' : 'Follow'}
          </FollowButton>
        </RightPanel>
      </TopContainer>

      <CustomModal open={modalOpen} onClose={handleCloseModal}>
        <ModalContent>
          <CloseButton onClick={handleCloseModal}>X</CloseButton>
          <Typography variant="h6" gutterBottom>Select or Enter Amount</Typography>
          <RadioGroup value={selectedAmount} onChange={handleAmountChange}>
            <FormControlLabel value="500" control={<Radio />} label="₹500" />
            <FormControlLabel value="1000" control={<Radio />} label="₹1000" />
            <FormControlLabel value="2000" control={<Radio />} label="₹2000" />
          </RadioGroup>
            <TextField
              fullWidth
              variant="outlined"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="Enter custom amount"
              type="number"
              inputProps={{ min: "1" }}
              sx={{ marginTop: '1rem' }}
            />
          <Button
            variant="contained"
            fullWidth
            sx={{ marginTop: '1rem' }}
            onClick={handlePledgeSubmit}
            disabled={!selectedAmount && !customAmount}
          >
            Confirm Pledge
          </Button>
        </ModalContent>
      </CustomModal>

      <BottomContainer>
        <Tabs value={tabIndex} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          <Tab label="Overview" />
          <Tab label="Comments" />
          <Tab label="Supporters" />
        </Tabs>

        {tabIndex === 0 && (
          <Box mt={2}>
            {/* <div dangerouslySetInnerHTML={{ __html: campaign.description }} /> */}
            <div dangerouslySetInnerHTML={{ __html: preprocessDescription(campaign.description) }} />
          </Box>
        )}

{tabIndex === 1 && (
  
  <Box mt={2}>
      <form onSubmit={(e) => e.preventDefault()}>
        <Box mb={2}>
          <textarea
            rows="4"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            required
          />
        </Box>
        <Button type="submit" variant="contained" color="primary" onClick={handleCommentSubmit}>
          Post Comment
        </Button>
      </form>

      {campaign.comments && campaign.comments.length > 0 ? (
        campaign.comments.map((comment) => (
          <Box key={comment._id} mb={2} p={2} border="1px solid #ddd" borderRadius="8px" position="relative">
            {editingCommentId === comment._id ? (
              <>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  variant="outlined"
                  margin="normal"
                />
                <Button
                  onClick={() => handleSaveEdit(comment._id)}
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ marginRight: 1 }}
                >
                  Save
                </Button>
                <Button
                  onClick={() => setEditingCommentId(null)}
                  variant="outlined"
                  color="secondary"
                  size="small"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body1" gutterBottom>{comment.text}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Posted by {comment.userName} on {new Date(comment.createdAt).toLocaleDateString()}
                </Typography>
                <Box position="absolute" top="8px" right="8px" display="flex" gap="8px">
                  <Button
                    onClick={() => handleEditButtonClick(comment._id, comment.text)}
                    variant="outlined"
                    color="primary"
                    size="small"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </Button>
                  <Button
                    onClick={() => handleDeleteComment(comment._id)}
                    variant="outlined"
                    color="secondary"
                    size="small"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </Button>
                </Box>
              </>
            )}
          </Box>
        ))
      ) : (
        <Typography>No comments yet.</Typography>
      )}
    </Box>
)}

        {tabIndex === 2 && (
  <Box mt={2}>
    {campaign.pledges && campaign.pledges.length > 0 ? (
      campaign.pledges.map((pledge, index) => (
        <Box key={index} mb={2} p={2} border="1px solid #ddd" borderRadius="8px">
          <Typography variant="body1" gutterBottom>₹{pledge.amount}</Typography>
          <Typography variant="caption" color="textSecondary">
            Posted by {pledge.backerName || 'Anonymous'} on {pledge.createdAt ? new Date(pledge.createdAt).toLocaleDateString() : 'Unknown Date'}
          </Typography>
        </Box>
      ))
    ) : (
      <Typography>No Supporters yet.</Typography>
    )}
  </Box>
)}
      </BottomContainer>
    </DetailContainer>
    </>
  );
};

export default CampaignPage;



