// Access Key Verification
document.getElementById('accessForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const accessKey = document.getElementById('accessKey').value;
    
    if (accessKey === 'ZANDKAV ADP') {
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid access key!');
    }
});

// Panel Creation
document.getElementById('panelForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const panelData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        ram: document.getElementById('ram').value,
        telegramId: document.getElementById('telegramId').value,
        type: 'panel'
    };
    
    createResource(panelData);
});

// Admin Panel Creation
document.getElementById('adminForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const adminData = {
        username: document.getElementById('adminUsername').value,
        password: document.getElementById('adminPassword').value,
        telegramId: document.getElementById('adminTelegramId').value,
        type: 'admin'
    };
    
    createResource(adminData);
});

// Function to create resource (panel or admin)
function createResource(data) {
    // Add API keys and domain
    data.api_plta = 'ptla_hun3W0WgWP7lED1LlV8LzrTdqrhcCbGuMsL7xi7s7nR';
    data.api_pltc = 'ptlc_Wv1PCBfjTGZdYYvwfMNjJED94mbSRqHpTgSxCdanoP6';
    data.domain = 'https://pinzyprivate.otax.store';
    
    // Send data to backend
    fetch('api/process.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = 'success.html';
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}
