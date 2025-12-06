
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
  
  addLog('info', `🚀 بدء إرسال ${count} رسالة بأقصى سرعة ممكنة...`);

let successCount = 0;
let errorCount = 0;

// نخزنو كل الطلبات هنا
const allRequests = [];

for (let i = 1; i <= count; i++) {
  allRequests.push(
    fetch(webhookUrl, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message })
    })
    .then(res => {
      if (res.ok || res.status === 204) {
        successCount++;
        addLog('success', `✓ تم إرسال الرسالة ${i}/${count}`);
      } else {
        errorCount++;
        addLog('error', `✗ فشل إرسال الرسالة ${i}/${count}: ${res.status}`);
      }
    })
    .catch(err => {
      errorCount++;
      addLog('error', `✗ خطأ في الرسالة ${i}: ${err.message}`);
    })
  );
}

// ننتظرو كل الطلبات تكمل (كلها تُرسل في نفس الثانية)
await Promise.all(allRequests);

addLog('info', '✅ انتهى الإرسال بأقصى سرعة!');
  
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
