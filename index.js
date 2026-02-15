const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// تخزين آخر 20 رسالة فقط للحفاظ على الذاكرة
let chatHistory = []; 
const MAX_HISTORY = 20;

// تخزين المتصلين النشطين
let activeUsers = new Map(); // userId -> { username, lastSeen }

// تنظيف المستخدمين غير النشطين كل 30 ثانية
setInterval(() => {
    const now = Date.now();
    for (const [userId, data] of activeUsers.entries()) {
        if (now - data.lastSeen > 10000) { // 10 ثواني بدون تحديث = غير نشط
            activeUsers.delete(userId);
        }
    }
    console.log(`👥 عدد المتصلين حالياً: ${activeUsers.size}`);
}, 30000);

app.post('/update', (req, res) => {
    const { username, userId, message, jobId, placeId, playerCount, gameName, isHelpRequest } = req.body;
    
    // تحديث آخر ظهور للمستخدم
    if (userId) {
        activeUsers.set(userId.toString(), {
            username: username,
            lastSeen: Date.now()
        });
    }
    
    if (message) {
        const newMessage = {
            id: Date.now() + Math.random(),
            username: username || "Unknown",
            userId: userId || 0,
            message: message,
            jobId: jobId || null,
            placeId: placeId || null,
            playerCount: playerCount || 0,
            gameName: gameName || "لعبة غير معروفة",
            isHelpRequest: isHelpRequest || false,
            time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        };

        chatHistory.push(newMessage);
        if (chatHistory.length > MAX_HISTORY) chatHistory.shift();

        console.log(`[${newMessage.time}] ${newMessage.username} (${newMessage.userId}): ${newMessage.message} ${isHelpRequest ? '🚨' : ''}`);
        res.status(200).json({ success: true });
    } else {
        res.status(400).send("Message is required");
    }
});

app.get('/data', (req, res) => {
    res.json(chatHistory);
});

// إضافة مسار جديد للحصول على عدد المتصلين
app.get('/online-count', (req, res) => {
    res.json({ 
        count: activeUsers.size,
        users: Array.from(activeUsers.values()).map(u => u.username)
    });
});

// نقطة تحديث نشاط المستخدم (بدون رسالة)
app.post('/ping', (req, res) => {
    const { userId, username } = req.body;
    if (userId) {
        activeUsers.set(userId.toString(), {
            username: username,
            lastSeen: Date.now()
        });
    }
    res.json({ success: true, onlineCount: activeUsers.size });
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
