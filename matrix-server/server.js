const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:3000'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Правильно определяем пути
const rootDir = path.dirname(__dirname); // Поднимаемся на уровень выше matrix-server
const assetsPath = path.join(rootDir, 'assets');

// Serve static files from assets folder
app.use('/assets', express.static(assetsPath));

// Serve HTML files with correct paths
app.get('/', (req, res) => {
    res.sendFile(path.join(rootDir, 'index-2.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(rootDir, 'contact.html'));
});

// Простые маршруты без параметров
app.get('/index-2.html', (req, res) => {
    res.sendFile(path.join(rootDir, 'index-2.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(rootDir, 'contact.html'));
});

// Обработчик контактной формы
app.post('/contact', (req, res) => {
    const { name, email, subject, message, agree } = req.body;
    
    console.log('📧 New contact form submission:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('Agreed to terms:', agree);
    
    res.json({
        success: true,
        message: 'Message received successfully!',
        timestamp: new Date().toISOString()
    });
});

// Простой fallback без параметров
app.use((req, res) => {
    res.sendFile(path.join(rootDir, 'index-2.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Express server running on http://localhost:${PORT}`);
    console.log(`📁 Root directory: ${rootDir}`);
    console.log(`📁 Assets path: ${assetsPath}`);
    console.log(`🌐 Home page: http://localhost:${PORT}/`);
    console.log(`📞 Contact page: http://localhost:${PORT}/contact`);
});