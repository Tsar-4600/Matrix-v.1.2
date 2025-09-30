const pages = [
    'about', 'checkout', 'competitor-analysis', 'contact', 'content-marketing', 
    'creative-approach', 'error', 'faq', 'guaranteed-success', 'keyword-research', 
    'price', 'product-cart', 'product-details', 'product', 'seo-counsultancy', 
    'service-details', 'service', 'team-details', 'team', 'testimonial', 
    'branding', 'corporate', 'online-stores', 'landing-site', 'mobile-applications',
    'search-engine-promotion', 'contextual-advertising', 'media-advertising', 
    'advertising-on-social-networks', 'website-audit', 'development-strategies', 
    'increasing-conversion', 'reputation-management', 'ideas-and-concepts', 
    'animation-and-characters', 'web-design'
];

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:3000', 'https://gkvertikal.pro', 'https://www.gkvertikal.pro'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Настройка EJS - УБЕДИТЕСЬ ЧТО ПУТЬ ПРАВИЛЬНЫЙ
app.set('view engine', 'ejs');
app.set('views', [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'views/pages'),
    path.join(__dirname, 'views/layouts')
]);

// Правильно определяем пути
const rootDir = path.dirname(__dirname);
const assetsPath = path.join(rootDir, 'assets');
const pagesDir = path.join(rootDir, 'pages');
const viewsDir = path.join(__dirname, 'views');

// Serve static files
app.use('/assets', express.static(assetsPath));
app.use(express.static(path.join(__dirname, 'public')));

// Создаем структуру папок для EJS если их нет
const ejsDirs = [
    'views/layouts',
    'views/pages', 
    'views/partials'
];

ejsDirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    }
});

// ГЛАВНАЯ СТРАНИЦА - ПРАВИЛЬНЫЙ ПУТЬ
app.get('/', (req, res) => {
    // Пробуем разные пути
    const possiblePaths = [
        path.join(viewsDir, 'pages', 'index.ejs'),
        path.join(viewsDir, 'index.ejs'),
        path.join(pagesDir, 'index.html')
    ];
    
    for (const filePath of possiblePaths) {
        if (fs.existsSync(filePath)) {
            console.log(`✅ Found: ${filePath}`);
            if (filePath.endsWith('.ejs')) {
                return res.render('pages/index', {
                    title: 'MarketeX - Digital Marketing Agency',
                    headerClass: 'header___two',
                    currentPage: 'home'
                });
            } else {
                return res.sendFile(filePath);
            }
        }
    }
    
    // Если ничего не найдено
    console.log('❌ No index file found');
    res.status(404).send('Index file not found');
});

// ДИНАМИЧЕСКИЕ МАРШРУТЫ - УПРОЩЕННАЯ ВЕРСИЯ
pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        console.log(`🔄 Processing route: /${page}`);
        
        // Пробуем EJS сначала в pages, потом в корне views
        const ejsPaths = [
            path.join(viewsDir, 'pages', `${page}.ejs`),
            path.join(viewsDir, `${page}.ejs`)
        ];
        
        for (const ejsPath of ejsPaths) {
            if (fs.existsSync(ejsPath)) {
                console.log(`✅ Rendering EJS: ${ejsPath}`);
                return res.render(`pages/${page}`, {
                    title: `${page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, ' ')} - MarketeX`,
                    currentPage: page,
                    headerClass: page === 'contact' ? '' : 'header___two'
                });
            }
        }
        
        // Fallback к HTML
        const htmlPath = path.join(pagesDir, `${page}.html`);
        if (fs.existsSync(htmlPath)) {
            console.log(`✅ Serving HTML: ${htmlPath}`);
            return res.sendFile(htmlPath);
        }
        
        // 404
        console.log(`❌ No file found for: ${page}`);
        res.status(404).render('error', {
            title: 'Page Not Found - MarketeX',
            currentPage: 'error'
        });
    });
});

// Обработчик контактной формы
app.post('/contact', (req, res) => {
    const { username, email, subject, message, agree } = req.body;

    console.log('📧 New contact form submission:');
    console.log('Name:', username);
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

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        server: 'HTTPS Express with EJS',
        timestamp: new Date().toISOString(),
        templateEngine: 'EJS',
        viewsDirectory: viewsDir
    });
});

// 404 handler
app.use((req, res) => {
    const errorPath = path.join(viewsDir, 'pages', 'error.ejs');
    if (fs.existsSync(errorPath)) {
        res.status(404).render('pages/error', {
            title: 'Page Not Found - MarketeX',
            currentPage: 'error'
        });
    } else {
        res.status(404).sendFile(path.join(pagesDir, 'error.html'));
    }
});

// Конфигурация домена
const DOMAIN = 'gkvertikal.pro';

// // Функция запуска HTTPS сервера
// function startHttpsServer() {
//     try {
//         const certDir = `/etc/letsencrypt/live/${DOMAIN}`;
//         const options = {
//             key: fs.readFileSync(path.join(certDir, 'privkey.pem')),
//             cert: fs.readFileSync(path.join(certDir, 'fullchain.pem'))
//         };

//         // HTTPS сервер на порту 443
//         https.createServer(options, app).listen(443, () => {
//             console.log(`🔒 HTTPS server running on port 443`);
//             console.log(`🌐 Secure URL: https://${DOMAIN}/`);
//             console.log(`📞 Contact page: https://${DOMAIN}/contact`);
//             console.log(`❤️ Health check: https://${DOMAIN}/health`);
//             console.log(`🎨 Template engine: EJS`);
//             console.log(`📁 EJS views: ${viewsDir}`);
//         });

//     } catch (error) {
//         console.error('❌ Error starting HTTPS server:', error.message);
//         console.log('💡 Run this command first to get SSL certificates:');
//         console.log('sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com --agree-tos -m you@yourdomain.com');
//         process.exit(1);
//     }
// }

// // HTTP редирект сервер на порту 80
// function startHttpRedirectServer() {
//     http.createServer((req, res) => {
//         const host = req.headers.host?.replace(/:\d+$/, '') || DOMAIN;
//         res.writeHead(301, { 
//             Location: `https://${host}${req.url}` 
//         });
//         res.end();
//     }).listen(80, () => {
//         console.log('🔄 HTTP redirect server running on port 80');
//     });
// }

// // Запуск серверов
// console.log(`🚀 Starting HTTPS Express Server with EJS...`);
// console.log(`📁 Root directory: ${rootDir}`);
// console.log(`📁 Assets path: ${assetsPath}`);
// console.log(`📁 Pages directory: ${pagesDir}`);
// console.log(`📁 EJS views directory: ${viewsDir}`);

// startHttpRedirectServer();
// startHttpsServer();

function startHttpServer() {
    try {
        const PORT = 3000;

        // HTTP сервер на порту 3000 для dev среды
        http.createServer(app).listen(PORT, () => {
            console.log(`🚀 HTTP server running on port ${PORT}`);
            console.log(`🌐 Local URL: http://localhost:${PORT}/`);
            console.log(`🌐 Network URL: http://127.0.0.1:${PORT}/`);
            console.log(`📞 Contact page: http://localhost:${PORT}/contact`);
            console.log(`❤️ Health check: http://localhost:${PORT}/health`);
            console.log(`🎨 Template engine: EJS`);
            console.log(`📁 EJS views: ${viewsDir}`);
            console.log(`⚡ Environment: development`);
        });

    } catch (error) {
        console.error('❌ Error starting HTTP server:', error.message);
        process.exit(1);
    }
}

// Запуск сервера
console.log(`🚀 Starting HTTP Express Server for Development...`);
console.log(`📁 Root directory: ${rootDir}`);
console.log(`📁 Assets path: ${assetsPath}`);
console.log(`📁 Pages directory: ${pagesDir}`);
console.log(`📁 EJS views directory: ${viewsDir}`);

startHttpServer();