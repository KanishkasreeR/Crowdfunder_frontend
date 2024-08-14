import React, { useState, useRef } from 'react';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Header from './Header';

const CreateCampaign = () => {
  const [formData, setFormData] = useState({
    cause: '',
    goalAmount: '',
    title: '',
    aim: '',
    description: '',
    image: '',
    video: '',
    startDate: '',
    endDate: ''
  });
  
  const [key, setKey] = useState(Date.now()); 
  const quillRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDescriptionChange = (value) => {
    setFormData({
      ...formData,
      description: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('You must be logged in to create a campaign.');
      return;
    }

    try {
      const response = await axios.post(
        'https://fundraising-platform.onrender.com/api/createCampaign',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success('Campaign created successfully!');
        if (quillRef.current) {
          quillRef.current.getEditor().setText('');
        }
        setFormData({
          cause: '',
          goalAmount: '',
          title: '',
          aim: '',
          description: '',
          image: '',
          video: '',
          startDate: '',
          endDate: ''
        });
        
        setKey(Date.now());
      } else {
        toast.error('Error creating campaign.');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while creating the campaign.');
    }
  };

  return (
    <>
    <Header/>
    <Box key={key} sx={{ padding: 4, maxWidth: 800, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>Create Your Campaign</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              select
              name="cause"
              value={formData.cause}
              onChange={handleChange}
              fullWidth
              required
              SelectProps={{
                native: true,
              }}
            >
              <option value="" disabled>Select Cause</option>
              <option value="Charity">Charity</option>
              <option value="Education">Education</option>
              <option value="Health">Health</option>
              <option value="Environment">Environment</option>
              <option value="Film and Video Production">Film and Video Production</option>
              <option value="Music and Albums">Music and Albums</option>
              <option value="Books and Publishing">Books and Publishings</option>
              <option value="Art Exhibitions">Art Exhibitions</option>
              <option value="Scholarships">Scholarships</option>
              <option value="Social Justice Initiatives">Social Justice Initiatives</option>
              <option value="Refugee Support">Refugee Support</option>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Goal Amount"
              name="goalAmount"
              type="number"
              value={formData.goalAmount}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{
                min: 0,
                step: 'any',
                style: {
                  MozAppearance: 'textfield',
                  WebkitAppearance: 'none',
                }
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              fullWidth
              required
              multiline
              helperText="This will be the first thing your friends, family and supporters will see, so be clear and concise."
              InputProps={{
                sx: {
                  '& .MuiInputBase-input': {
                    overflowWrap: 'break-word',
                    resize: 'none',
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Aim"
              name="aim"
              value={formData.aim}
              onChange={handleChange}
              fullWidth
              required
              multiline
              helperText="Keep it short and snappy - this is the first bit of info people will see."
              InputProps={{
                sx: {
                  '& .MuiInputBase-input': {
                    overflowWrap: 'break-word',
                    resize: 'none',
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" gutterBottom>
              Description
            </Typography>
            <ReactQuill
              ref={quillRef}
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Tell your story..."
              modules={{
                toolbar: [
                  [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  ['bold', 'italic', 'underline'],
                  [{ 'align': [] }],
                  ['image', 'video']
                ],
                history: {
                  delay: 1000,
                  maxStack: 50,
                  userOnly: true
                }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleChange}
              fullWidth
              required
              helperText="Your image needs to be a JPEG or PNG file, max. 2MB and at least 1600 x 900 px."
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Video URL"
              name="video"
              value={formData.video}
              onChange={handleChange}
              fullWidth
              helperText="You can post a personal video by first uploading it to YouTube or Vimeo and pasting the link here."
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Create Campaign
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </Box>
    </>
  );
};

export default CreateCampaign;


