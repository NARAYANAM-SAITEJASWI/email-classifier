// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const verifyBtn = document.getElementById('verifyBtn');
const verifyEmailInput = document.getElementById('verifyEmail');
const verifyResult = document.getElementById('verifyResult');
const sendForm = document.getElementById('sendForm');
const sendResult = document.getElementById('sendResult');
const refreshAnalyticsBtn = document.getElementById('refreshAnalytics');
const recentEmailsContainer = document.getElementById('recentEmails');

// Analytics elements
const sentCountEl = document.getElementById('sentCount');
const validCountEl = document.getElementById('validCount');
const openCountEl = document.getElementById('openCount');
const openRateEl = document.getElementById('openRate');

// State management
let recentEmails = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeEventListeners();
    loadAnalytics();
    loadRecentEmails();
});

// Tab functionality
function initializeTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

function switchTab(tabId) {
    // Remove active class from all tabs and buttons
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and button
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
    
    // Load data when switching to analytics tab
    if (tabId === 'analytics') {
        loadAnalytics();
    }
}

// Event listeners
function initializeEventListeners() {
    // Verify email
    verifyBtn.addEventListener('click', handleVerifyEmail);
    verifyEmailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleVerifyEmail();
        }
    });
    
    // Send email
    sendForm.addEventListener('submit', handleSendEmail);
    
    // Refresh analytics
    refreshAnalyticsBtn.addEventListener('click', loadAnalytics);
}

// API Functions
async function makeRequest(url, options = {}) {
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request failed:', error);
        throw error;
    }
}

// Verify email function
async function handleVerifyEmail() {
    const email = verifyEmailInput.value.trim();
    
    if (!email) {
        showResult(verifyResult, 'Please enter an email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showResult(verifyResult, 'Please enter a valid email format', 'error');
        return;
    }
    
    setLoading(verifyBtn, true);
    
    try {
        const result = await makeRequest(`${API_BASE_URL}/verify`, {
            method: 'POST',
            body: JSON.stringify({ email })
        });
        
        displayVerificationResult(result);
    } catch (error) {
        showResult(verifyResult, 'Failed to verify email. Please try again.', 'error');
    } finally {
        setLoading(verifyBtn, false);
    }
}

function displayVerificationResult(result) {
    const { email, valid, reason, checks } = result;
    
    let resultClass = valid ? 'success' : 'error';
    let resultText = valid ? 
        `✅ Email "${email}" is valid!` : 
        `❌ Email "${email}" is invalid.`;
    
    let detailsHtml = `
        <div class="verification-details">
            <h4>Verification Details:</h4>
            <div class="check-item ${checks.formatOk ? 'valid' : 'invalid'}">
                <i class="fas ${checks.formatOk ? 'fa-check' : 'fa-times'}"></i>
                <span>Format: ${checks.formatOk ? 'Valid' : 'Invalid'}</span>
            </div>
            <div class="check-item ${checks.mxOk ? 'valid' : 'invalid'}">
                <i class="fas ${checks.mxOk ? 'fa-check' : 'fa-times'}"></i>
                <span>MX Record: ${checks.mxOk ? 'Found' : 'Not Found'}</span>
            </div>
            <div class="check-item ${!checks.isDisposable ? 'valid' : 'invalid'}">
                <i class="fas ${!checks.isDisposable ? 'fa-check' : 'fa-times'}"></i>
                <span>Disposable: ${checks.isDisposable ? 'Yes' : 'No'}</span>
            </div>
    `;
    
    if (reason.length > 0) {
        detailsHtml += `
            <div style="margin-top: 10px;">
                <strong>Issues:</strong> ${reason.join(', ')}
            </div>
        `;
    }
    
    detailsHtml += '</div>';
    
    showResult(verifyResult, resultText + detailsHtml, resultClass);
}

// Send email function
async function handleSendEmail(e) {
    e.preventDefault();
    
    const email = document.getElementById('sendEmail').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const body = document.getElementById('body').value.trim();
    
    if (!email || !subject || !body) {
        showResult(sendResult, 'Please fill in all fields', 'error');
        return;
    }
    
    const submitBtn = sendForm.querySelector('button[type="submit"]');
    setLoading(submitBtn, true);
    
    try {
        const result = await makeRequest(`${API_BASE_URL}/send`, {
            method: 'POST',
            body: JSON.stringify({ email, subject, body })
        });
        
        if (result.ok) {
            showResult(sendResult, `✅ Email sent successfully! ID: ${result.id}`, 'success');
            sendForm.reset();
            
            // Add to recent emails
            const newEmail = {
                id: result.id,
                email,
                subject,
                body,
                sentAt: new Date(),
                opened: false
            };
            recentEmails.unshift(newEmail);
            updateRecentEmailsDisplay();
            
            // Refresh analytics
            loadAnalytics();
        }
    } catch (error) {
        showResult(sendResult, 'Failed to send email. Please try again.', 'error');
    } finally {
        setLoading(submitBtn, false);
    }
}

// Analytics functions
async function loadAnalytics() {
    try {
        const analytics = await makeRequest(`${API_BASE_URL}/analytics`);
        updateAnalyticsDisplay(analytics);
    } catch (error) {
        console.error('Failed to load analytics:', error);
    }
}

function updateAnalyticsDisplay(analytics) {
    sentCountEl.textContent = analytics.sentCount || 0;
    validCountEl.textContent = analytics.validCount || 0;
    openCountEl.textContent = analytics.openCount || 0;
    openRateEl.textContent = `${analytics.openRate || '0.00'}%`;
}

// Recent emails functions
async function loadRecentEmails() {
    // In a real application, you'd fetch this from an API
    // For now, we'll manage it locally
    updateRecentEmailsDisplay();
}

function updateRecentEmailsDisplay() {
    if (recentEmails.length === 0) {
        recentEmailsContainer.innerHTML = '<p class="no-data">No emails sent yet. Send your first email to see it here!</p>';
        return;
    }
    
    const emailsHtml = recentEmails.map(email => `
        <div class="email-item ${email.opened ? 'opened' : ''}" data-id="${email.id}">
            <div class="email-header">
                <span class="email-address">${email.email}</span>
                <span class="email-status ${email.opened ? 'opened' : 'sent'}">
                    ${email.opened ? 'Opened' : 'Sent'}
                </span>
            </div>
            <div class="email-subject">${email.subject}</div>
            <div class="email-time">${formatDate(email.sentAt)}</div>
            <button class="btn btn-secondary" onclick="simulateOpen('${email.id}')" 
                    ${email.opened ? 'disabled' : ''} style="margin-top: 10px; font-size: 0.9rem;">
                <i class="fas fa-eye"></i> ${email.opened ? 'Already Opened' : 'Mark as Opened'}
            </button>
        </div>
    `).join('');
    
    recentEmailsContainer.innerHTML = emailsHtml;
}

// Simulate email open
async function simulateOpen(emailId) {
    try {
        await makeRequest(`${API_BASE_URL}/open/${emailId}`, {
            method: 'GET'
        });
        
        // Update local state
        const email = recentEmails.find(e => e.id === emailId);
        if (email) {
            email.opened = true;
            email.openedAt = new Date();
        }
        
        updateRecentEmailsDisplay();
        loadAnalytics();
        
        showResult(sendResult, '✅ Email marked as opened!', 'success');
    } catch (error) {
        showResult(sendResult, 'Failed to mark email as opened', 'error');
    }
}

// Utility functions
function showResult(element, message, type) {
    element.innerHTML = message;
    element.className = `result ${type}`;
    element.style.display = 'block';
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function setLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<span class="loading"></span> Loading...';
    } else {
        button.disabled = false;
        // Restore original content based on button context
        if (button.id === 'verifyBtn') {
            button.innerHTML = '<i class="fas fa-check"></i> Verify Email';
        } else if (button.type === 'submit') {
            button.innerHTML = '<i class="fas fa-paper-plane"></i> Send Email';
        } else if (button.id === 'refreshAnalytics') {
            button.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Analytics';
        }
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function formatDate(date) {
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Make simulateOpen globally available
window.simulateOpen = simulateOpen;
