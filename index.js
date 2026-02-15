const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// تخزين آخر 20 رسالة فقط للحفاظ على الذاكرة
let chatHistory = []; 
const MAX_HISTORY = 20;

app.post('/update', (req, res) => {
    // أضفنا جميع البيانات المطلوبة
    const { username, userId, message, jobId, placeId, playerCount, gameName, isHelpRequest } = req.body;
    
    if (message) {
        const newMessage = {
            id: Date.now() + Math.random(),
            username: username || "Unknown",
            userId: userId || 0,
            message: message,
            jobId: jobId || null,
            placeId: placeId || null,
            playerCount: playerCount || 0, // عدد اللاعبين في السيرفر
            gameName: gameName || "لعبة غير معروفة", // اسم اللعبة
            isHelpRequest: isHelpRequest || false, // تحديد إذا كانت طلب فزعه
            time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        };

        chatHistory.push(newMessage);
        if (chatHistory.length > MAX_HISTORY) chatHistory.shift();

        console.log(`[${newMessage.time}] ${newMessage.username} (${newMessage.userId}): ${newMessage.message} ${isHelpRequest ? '🚨 طلب فزعه' : ''}`);
        res.status(200).json({ success: true });
    } else {
        res.status(400).send("Message is required");
    }
});

app.get('/data', (req, res) => {
    res.json(chatHistory);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
