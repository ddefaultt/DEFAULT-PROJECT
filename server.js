
const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// تقديم الملفات الثابتة
app.use(express.static(__dirname));

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 الموقع يعمل على المنفذ ${PORT}`);
  console.log(`📱 افتح الرابط: http://localhost:${PORT}`);
});
