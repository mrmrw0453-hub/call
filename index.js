const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// تخزين آخر 50 رسالة
let chatHistory = [];
const MAX_HISTORY = 20;

app.post('/update', (req, res) => {
    const { username, message, jobId, placeId } = req.body;
    
    if (message) {
        const newMessage = {
            id: Date.now() + Math.random(),
            username: username || "Unknown",
            message: message,
            jobId: jobId || null,
            placeId: placeId || null,
            time: new Date().toLocaleTimeString('en-US', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
            })
        };

        chatHistory.push(newMessage);
        if (chatHistory.length > MAX_HISTORY) chatHistory.shift();

        console.log(`[${newMessage.time}] ${newMessage.username}: ${newMessage.message}`);
        if (jobId) {
            console.log(`🚨 HELP REQUEST - Job ID: ${jobId}, Place ID: ${placeId}`);
        }
        
        res.status(200).json({ success: true });
    } else {
        res.status(400).send("Message is required");
    }
});

app.get('/data', (req, res) => {
    res.json(chatHistory);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
