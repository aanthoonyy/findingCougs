const express = require('express');
const router = express.Router();
const Community = require('../models/community');

// GET /communities - list all communities
router.get('/network', async (req, res) => {
  try {
    const communities = await Community.find({});
    res.json(communities);
  } catch (err) {
    console.error('Error fetching communities:', err);
    res.status(500).send('Something Went Wrong');
  }
});

// POST /communities - create a new community
router.post('/network', async (req, res) => {
  try {
    const { name, description } = req.body;
    const community = new Community({ name, description });
    await community.save();
    res.json(community);
  } catch (err) {
    console.error('Error creating community:', err);
    res.status(500).send('Something Went Wrong');
  }
});

// DELETE /communities/:communityId - delete a community
router.delete('/network/:communityId', async (req, res) => {
    try {
      const { communityId } = req.params;
      await Community.findByIdAndDelete(communityId);
      res.json({ success: true });
    } catch (err) {
      console.error("Error deleting community:", err);
      res.status(500).send("Something Went Wrong");
    }
  });

// POST /communities/:communityId/join - join a community
router.post('/network/:communityId/join', async (req, res) => {
  try {
    const { communityId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'UserId is required' });
    }

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    if (!community.members.includes(userId)) {
      community.members.push(userId);
      await community.save();
    }
    // const hold = community.members.find(userId);
    // const hold = community.members.findIndex((element) => element === userId);
    // console.log(hold);

    res.json({ success: true, community });
  } catch (err) {
    console.error('Error joining community:', err);
    res.status(500).send('Something Went Wrong');
  }
});

// Leave a community: POST /communities/:communityId/leave
router.post('/network/:communityId/leave', async (req, res) => {
    try {
      const { communityId } = req.params;
      const { userId } = req.body;
      console.log("Leave community request body:", req.body);
  
      if (!userId) {
        return res.status(400).json({ error: 'UserId is required' });
      }
  
      const community = await Community.findById(communityId);
      if (!community) {
        return res.status(404).json({ error: 'Community not found' });
      }
  
      community.members = community.members.filter(
        (memberId) => memberId.toString() !== userId.toString()
      );
      await community.save();
  
      res.json({ success: true, community });
    } catch (err) {
      console.error('Error leaving community:', err);
      res.status(500).send('Something Went Wrong');
    }
  });

  //gets the community information given the community id
router.post('/network/community', async (req, res) => {
  try {
      const {userId, communityId } = req.body;
      //const query = req.query.query;
      if (!userId) {
        return res.status(400).json({ error: 'UserId is required' });
      }
      const community = await Community.findById(communityId);
      if (!community) {
        return res.status(404).json({ error: 'Community not found' });
      }
  
      res.json({ success: true, community });
    } catch (err) {
      console.error('Error searching communities:', err);
      res.status(500).send('Something Went Wrong');
    }
    
})
  

module.exports = router;
