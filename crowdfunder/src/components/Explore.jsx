import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Box, Grid, Card, CardContent, CardMedia, LinearProgress, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; 
import Header from './Header';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  height: '250px', 
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  paddingRight: theme.spacing(4),
}));

const RightPanel = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%', 
}));

const RightPanelImage = styled('img')({
  width: '100%',
  height: 'auto',
  maxHeight: '100%', 
  objectFit: 'cover',
});

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%', 
  boxShadow: theme.shadows[3], 
}));

const CardMediaWrapper = styled(CardMedia)(({ theme }) => ({
  height: 180,
}));

const CardContentWrapper = styled(CardContent)(({ theme }) => ({
  flexGrow: 1, 
  padding: theme.spacing(2),
}));

const Explore = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('https://fundraising-platform.onrender.com/api/getAllCampaigns');
        if (response.data.success) {
          setCampaigns(response.data.data);
        } else {
          setError('Failed to fetch campaigns');
        }
      } catch (err) {
        setError('An error occurred while fetching campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleCardClick = (campaignId) => {
    navigate(`/campaignpage?id=${campaignId}`);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
    <Header/>
    <Box sx={{ padding: 4 }}>
      <Container>
        <LeftPanel>
          <Typography variant="h4" gutterBottom>Explore Projects</Typography>
          <Typography variant="body1" paragraph>
            Join thousands of others and start your journey, raising money for the causes, communities, charities and people you care about.
          </Typography>
        </LeftPanel>
        <RightPanel>
          <RightPanelImage src="https://distil.ai/wp-content/uploads/2024/03/crowdfunder.webp" alt="Explore Projects" />
        </RightPanel>
      </Container>
      <Grid container spacing={3}>
        {campaigns.map(campaign => (
          <Grid item xs={12} sm={6} md={4} key={campaign._id}>
            <StyledCard onClick={() => handleCardClick(campaign.campaignId)}>
              <CardMediaWrapper
                component="img"
                image={campaign.image} 
                alt={campaign.title}
              />
              <CardContentWrapper>
                <Typography variant="h6">{campaign.aim}</Typography>
                <Typography variant="body2" color="text.primary">
                  {campaign.remainingDays} days remaining
                </Typography>
                <LinearProgress variant="determinate" value={campaign.percentageRaised} sx={{ marginTop: 2 }} />
                <Typography variant="body2" color="text.primary">
                  {campaign.percentageRaised}% raised of ${campaign.goalAmount}
                </Typography>
              </CardContentWrapper>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
    </>
  );
};

export default Explore;

