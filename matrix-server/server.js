const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
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
const rootDir = path.dirname(__dirname);
const assetsPath = path.join(rootDir, 'assets');

// Serve static files from assets folder
app.use('/assets', express.static(assetsPath));

// Список всех страниц
const pages = [
    'about', 'blog-details', 'blog-grid', 'blog', 'cart', 'checkout',
    'competitor-analysis', 'contact', 'content-marketing', 'creative-approach',
    'error', 'faq', 'guaranteed-success', 'index-2', 'index-3', 'index',
    'keyword-research', 'price', 'product-cart', 'product-details', 'product',
    'seo-counsultancy', 'service-details', 'service', 'team-details', 'team',
    'testimonial', 'branding', 'сorporate', 'online-stores', 'landing-site', 'mobile-applications', 
    'search-engine-promotion', 'contextual-advertising', 'media-advertising', 'advertising-on-social-networks', 
    'website-audit', 'development-strategies', 'increasing-conversion', 
    'reputation-management', 'ideas-and-concepts', 'animation-and-characters', 'web-design'
];

// Главная страница
app.get('/', (req, res) => {
    res.sendFile(path.join(rootDir, 'index.html'));
});

// Динамические маршруты для всех страниц
pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        res.sendFile(path.join(rootDir, `${page}.html`));
    });
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

// Обработчик 404 ошибок - для всех остальных маршрутов
app.use((req, res) => {
    res.status(404).sendFile(path.join(rootDir, 'error.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Express server running on http://localhost:${PORT}`);
    console.log(`📁 Root directory: ${rootDir}`);
    console.log(`📁 Assets path: ${assetsPath}`);
    console.log(`🌐 Home page: http://localhost:${PORT}/`);
    console.log(`📞 Contact page: http://localhost:${PORT}/contact`);
    console.log(`❌ 404 page: http://localhost:${PORT}/any-wrong-url`);
    console.log(`📄 Total pages: ${pages.length + 1} (including home page)`);
});