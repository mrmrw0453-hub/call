const express = require('express');
const app = express();

// إعداد التطبيق لاستقبال بيانات JSON
app.use(express.json());

// تحديد المنفذ ديناميكياً ليناسب بيئة Render
const PORT = process.env.PORT || 3000;

let chatData = {
    username: "System",
    message: "بدء المحادثة...",
    time: new Date().toLocaleTimeString()
};

// استقبال التحديثات
app.post('/update', (req, res) => {
    if (req.body && req.body.message) {
        chatData = {
            username: req.body.username || "Unknown",
            message: req.body.message,
            time: new Date().toLocaleTimeString()
        };
        // السطر المصحح باستخدام علامات الباكتيك `
        console.log(`[${chatData.time}] ${chatData.username}: ${chatData.message}`);
        res.status(200).send("Sent successfully");
    } else {
        res.status(400).send("Message is required");
    }
});

// عرض البيانات
app.get('/data', (req, res) => {
    res.json(chatData);
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});          
