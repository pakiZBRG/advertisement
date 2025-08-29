### Webapp by which you can create advertisements for selling your goods and services

Web logic:

- CRUD functionality for users with login, logout, activation process and forgot/reset password
- CRUD functionality for advertisements
- Sending mails with `nodemailer`
- Limiting the number of request to 20 with refilling the bucket with 5 requests every 10 seconds with `arcjet`.
- Using refresh/access token for login security. Refresh token is hashed and stored in database on the backend. In the frontend, refresh token is stored in `HttpOnly cookie` (secured from JS injection), lasts 14 days and is sent with each `axios` request. Access token is stored in the memory (`zustand` state) and lasts 15 minutes. Axios intercepts requests to inject access token for authorization and calls `/refresh` route if the requests anwsers 401
- UI is stylized with `tailwind` and `sonner` toast messages
- Google login flow
- Infinite scroll pagination
