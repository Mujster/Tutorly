const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const User = require('./models/userModel');
const auth = require('./middleware');
const { sendVerificationEmail } = require('./utils/emailService');

dotenv.config();

const inMemoryUsers = new Map();
let useInMemoryStore = true;

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

function cleanupExpiredSessions() {
  if (useInMemoryStore) {
    console.log('Cleaning up expired sessions...');
    const now = new Date();
    for (const [email, userData] of inMemoryUsers.entries()) {
      try {
        jwt.verify(userData.token, process.env.JWT_SECRET);
      } catch (err) {
        console.log(`Removing expired session for ${email}`);
        inMemoryUsers.delete(email);
      }
    }
  }
}

// Run cleanup every hour
setInterval(cleanupExpiredSessions, 60 * 60 * 1000);

app.post('/login',async (req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password){ 
            return res.status(400).json({error: 'Please enter all fields'});
        }
        
        let user = null;
        if (useInMemoryStore) {
            const memUser = inMemoryUsers.get(email);
            if (memUser && memUser.password === password) {
                user = memUser;
            }
        } else {
            user = await User.findOne({email:email, password:password});
        }
        
        if(!user){
            return res.status(400).json({error: 'Authentication failed'});
        }
        
        const token = jwt.sign({email:email},process.env.JWT_SECRET,{expiresIn:'3h'});
        
        if (useInMemoryStore) {
            user.token = token;
            inMemoryUsers.set(email, user);
        } else {
            user.token = token;
            await user.save();
        }
        
        if(!user.isVerified){
            return res.status(200).json({error: 'Please verify your email',token:token});
        }
        
        res.cookie('jwt', token, { httpOnly: true, secure: true });
        return res.status(200).json({message: 'Login successful', token,isVerified: user.isVerified});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal server error'});
    }
});

app.post('/register',async (req, res) => {
    try{
        const {name, email, password} = req.body;
        
        if(!name || !email || !password) {
            return res.status(400).json({error: 'Please enter all fields'});
        }
        
        // Check for existing user
        let userExists = false;
        if (useInMemoryStore) {
            userExists = inMemoryUsers.has(email);
        } else {
            const existingUser = await User.findOne({email});
            userExists = !!existingUser;
        }
        
        if(userExists) {
            return res.status(400).json({error: 'User already exists'});
        }
        
        const token = jwt.sign({email:email}, process.env.JWT_SECRET, {expiresIn:'3h'});
        
        if (useInMemoryStore) {
            // Store in memory
            inMemoryUsers.set(email, {
                name,
                email,
                password,
                token,
                isVerified: false,
                createdAt: new Date()
            });
        } else {
            // Store in MongoDB
            const user = new User({
                name,
                email,
                password,
                isVerified: false,
                token
            });
            await user.save();
        }
        
        res.cookie('jwt', token, { httpOnly: true, secure: true });
        
        await sendVerificationEmail(email, name, token);
        
        return res.status(201).json({
            message: 'User created successfully. Please check your email to verify your account.',
            isVerified: false
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal server error'});
    }
});

app.post('/resend-email',async(req,res)=>{
    try{
        const {email,token}=req.body;
        if(!email || !token){
            return res.status(400).json({error: 'Please enter all fields'});
        }
        
        let user = null;
        if (useInMemoryStore) {
            user = inMemoryUsers.get(email);
        } else {
            user = await User.findOne({email:email});
        }
        
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        
        sendVerificationEmail(email,user.name,token);
        return res.status(200).json({message: 'Verification email resent successfully'});   
    }
    catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal server error'});
    }
});

app.get('/tutorly/verify-email', async(req, res) => {
    try {
        const token = req.query.token;
        
        let user = null;
        if (useInMemoryStore) {
            // Find user by token in memory store
            for (const [email, userData] of inMemoryUsers.entries()) {
                if (userData.token === token) {
                    user = userData;
                    break;
                }
            }
        } else {
            user = await User.findOne({token: token});
        }

        const successHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verified - TutorlyAI</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f9fafb;
                    color: #111827;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .container {
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    padding: 3rem;
                    text-align: center;
                    max-width: 500px;
                    width: 100%;
                }
                .success-icon {
                    background-color: #ecfdf5;
                    color: #059669;
                    font-size: 2rem;
                    height: 60px;
                    width: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                }
                h1 {
                    color: #4f46e5;
                    font-size: 1.875rem;
                    margin-bottom: 1rem;
                }
                p {
                    color: #4b5563;
                    margin-bottom: 1.5rem;
                    font-size: 1.1rem;
                }
                .redirect-text {
                    font-size: 0.875rem;
                    color: #6b7280;
                }
                .button {
                    background-color: #4f46e5;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.375rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: inline-block;
                    text-decoration: none;
                    margin-bottom: 1rem;
                }
                .button:hover {
                    background-color: #4338ca;
                }
                .progress {
                    height: 4px;
                    background-color: #e5e7eb;
                    border-radius: 2px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                }
                .progress-bar {
                    height: 100%;
                    background-color: #4f46e5;
                    width: 0%;
                    transition: width 3s linear;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="success-icon">✓</div>
                <h1>Email Verified Successfully!</h1>
                <p>Thank you for verifying your email address. Your account is now active.</p>
                <div class="progress">
                    <div class="progress-bar" id="progressBar"></div>
                </div>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">Go to Dashboard</a>
                <p class="redirect-text">You will be automatically redirected to the dashboard in <span id="countdown">5</span> seconds...</p>
            </div>
            
            <script>
                // Auto redirect after 5 seconds
                let seconds = 5;
                const countdown = document.getElementById('countdown');
                const progressBar = document.getElementById('progressBar');
                
                // Start progress bar animation
                progressBar.style.width = '100%';
                
                const interval = setInterval(() => {
                    seconds--;
                    countdown.textContent = seconds;
                    if (seconds <= 0) {
                        clearInterval(interval);
                        window.location.href = "${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard";
                    }
                }, 1000);
            </script>
        </body>
        </html>
        `;
        
        const alreadyVerifiedHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Already Verified - TutorlyAI</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f9fafb;
                    color: #111827;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .container {
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    padding: 3rem;
                    text-align: center;
                    max-width: 500px;
                    width: 100%;
                }
                .info-icon {
                    background-color: #eff6ff;
                    color: #3b82f6;
                    font-size: 2rem;
                    height: 60px;
                    width: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                }
                h1 {
                    color: #4f46e5;
                    font-size: 1.875rem;
                    margin-bottom: 1rem;
                }
                p {
                    color: #4b5563;
                    margin-bottom: 1.5rem;
                    font-size: 1.1rem;
                }
                .button {
                    background-color: #4f46e5;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.375rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: inline-block;
                    text-decoration: none;
                }
                .button:hover {
                    background-color: #4338ca;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="info-icon">i</div>
                <h1>Email Already Verified</h1>
                <p>Your email address has already been verified. There's no need to verify again.</p>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" class="button">Go to Dashboard</a>
            </div>
        </body>
        </html>
        `;
        
        const notFoundHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>User Not Found - TutorlyAI</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f9fafb;
                    color: #111827;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .container {
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    padding: 3rem;
                    text-align: center;
                    max-width: 500px;
                    width: 100%;
                }
                .error-icon {
                    background-color: #fef2f2;
                    color: #ef4444;
                    font-size: 2rem;
                    height: 60px;
                    width: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                }
                h1 {
                    color: #4f46e5;
                    font-size: 1.875rem;
                    margin-bottom: 1rem;
                }
                p {
                    color: #4b5563;
                    margin-bottom: 1.5rem;
                    font-size: 1.1rem;
                }
                .button {
                    background-color: #4f46e5;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.375rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: inline-block;
                    text-decoration: none;
                }
                .button:hover {
                    background-color: #4338ca;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="error-icon">✕</div>
                <h1>User Not Found</h1>
                <p>We couldn't find a user associated with this verification link. The link may have expired or is invalid.</p>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">Go to Login</a>
            </div>
        </body>
        </html>
        `;

        // Send appropriate HTML based on user status
        if (!user) {
            return res.status(404).send(notFoundHTML);
        } else {
            if (user.isVerified) {
                return res.status(200).send(alreadyVerifiedHTML);
            }
            
            if (useInMemoryStore) {
                user.isVerified = true;
                inMemoryUsers.set(user.email, user);
            } else {
                user.set('isVerified', true);
                await user.save();
            }
            
            return res.status(200).send(successHTML);
        }
    } catch (err) {
        console.log(err);
        
        // Error HTML template
        const errorHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Error - TutorlyAI</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #f9fafb;
                    color: #111827;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                }
                .container {
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                    padding: 3rem;
                    text-align: center;
                    max-width: 500px;
                    width: 100%;
                }
                .error-icon {
                    background-color: #fef2f2;
                    color: #ef4444;
                    font-size: 2rem;
                    height: 60px;
                    width: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                }
                h1 {
                    color: #4f46e5;
                    font-size: 1.875rem;
                    margin-bottom: 1rem;
                }
                p {
                    color: #4b5563;
                    margin-bottom: 1.5rem;
                    font-size: 1.1rem;
                }
                .button {
                    background-color: #4f46e5;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.375rem;
                    font-weight: 600;
                    cursor: pointer;
                    display: inline-block;
                    text-decoration: none;
                }
                .button:hover {
                    background-color: #4338ca;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="error-icon">✕</div>
                <h1>Verification Error</h1>
                <p>Something went wrong while verifying your email address. Please try again later or contact support.</p>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">Go to Login</a>
            </div>
        </body>
        </html>
        `;
        
        return res.status(400).send(errorHTML);
    }
});

app.get('/', (req, res) => {
    return res.json('Tutorly API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}. Connected To Memory Store: ${useInMemoryStore}`);
});

