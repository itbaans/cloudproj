# Authentication (Frontend)

## Background

User authentication is implemented using **JSON Web Tokens (JWT)**.  
Email verification is handled through an actual email sent by a Gmail account configured for this app.

## Changes

- Added routing between login and signup pages  
- Users with valid tokens are redirected to the dashboard instead of login/signup  
- More work to be done for:
  - Logout functionality  
  - Regex-based password strength enforcement  
  - Pop-up and styling for password hint messages  
