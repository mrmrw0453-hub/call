const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// تخزين آخر 20 رسالة فقط للحفاظ على الذاكرة
let chatHistory = []; 
const MAX_HISTORY = 20;

app.post('/update', (req, res) => {
    const { username, message, jobId, placeId } = req.body;
    
    if (message) {
        const newMessage = {
            id: Date.now() + Math.random(), // معرف فريد للرسالة
            username: username || "Unknown",
            message: message,
            jobId: jobId || null, // معرف السيرفر للانضمام
            placeId: placeId || null, // معرف اللعبة
            time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        };

        chatHistory.push(newMessage);
        if (chatHistory.length > MAX_HISTORY) chatHistory.shift(); // حذف القديم

        console.log(`[${newMessage.time}] ${newMessage.username}: ${newMessage.message}`);
        res.status(200).json({ success: true });
    } else {
        res.status(400).send("Message is required");
    }
});

app.get('/data', (req, res) => {
    res.json(chatHistory); // إرسال كل السجل وليس رسالة واحدة
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
