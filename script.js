
document.getElementById('webhookForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const webhookUrl = document.getElementById('webhookUrl').value;
  const message = document.getElementById('message').value;
  const count = parseInt(document.getElementById('count').value);
  
  const sendBtn = document.getElementById('sendBtn');
  const btnText = document.getElementById('btnText');
  const btnLoader = document.getElementById('btnLoader');
  const statusDiv = document.getElementById('status');
  const logsDiv = document.getElementById('logs');
  const logsContent = document.getElementById('logsContent');
  
  // تعطيل الزر وإظهار اللودر
  sendBtn.disabled = true;
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');
  
  // إخفاء الحالة السابقة
  statusDiv.classList.add('hidden');
  
  // إظهار سجل الإرسال
  logsDiv.classList.remove('hidden');
  logsContent.innerHTML = '';
  
  let successCount = 0;
  let errorCount = 0;
  
  // بدء الإرسال
  addLog('info', `🚀 بدء إرسال ${count} رسالة...`);
  
  for (let i = 1; i <= count; i++) {
    try {
      addLog('info', `📤 محاولة إرسال الرسالة ${i}/${count}...`);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message
        })
      });
      
      if (response.ok || response.status === 204) {
        successCount++;
        addLog('success', `✓ تم إرسال الرسالة ${i}/${count} بنجاح!`);
      } else {
        errorCount++;
        const errorText = await response.text();
        addLog('error', `✗ فشل إرسال الرسالة ${i}: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      errorCount++;
      addLog('error', `✗ خطأ في إرسال الرسالة ${i}: ${error.message}`);
    }
    
    // انتظار ثانية بين كل رسالة (ماعدا الأخيرة)
    if (i < count) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // إعادة تفعيل الزر
  sendBtn.disabled = false;
  btnText.classList.remove('hidden');
  btnLoader.classList.add('hidden');
  
  // عرض الحالة النهائية
  statusDiv.classList.remove('hidden');
  if (errorCount === 0) {
    statusDiv.className = 'status success';
    statusDiv.textContent = `✅ تم الإرسال بنجاح! (${successCount}/${count})`;
  } else if (successCount === 0) {
    statusDiv.className = 'status error';
    statusDiv.textContent = `❌ فشل الإرسال! (${errorCount}/${count})`;
  } else {
    statusDiv.className = 'status info';
    statusDiv.textContent = `⚠️ اكتمل الإرسال مع بعض الأخطاء (نجح: ${successCount}, فشل: ${errorCount})`;
  }
  
  addLog('info', '✅ انتهى الإرسال!');
});

function addLog(type, message) {
  const logsContent = document.getElementById('logsContent');
  const logEntry = document.createElement('div');
  logEntry.className = `log-entry ${type}`;
  logEntry.textContent = message;
  logsContent.appendChild(logEntry);
  logsContent.scrollTop = logsContent.scrollHeight;
}

const sendBtn = document.getElementById('sendBtn');
sendBtn.addEventListener('mousemove', (e) => {
  const rect = sendBtn.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  
  sendBtn.style.setProperty('--x', `${x}%`);
  sendBtn.style.setProperty('--y', `${y}%`);
});
