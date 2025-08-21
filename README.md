### Webapp by which you can create an advertisement for selling your goods and services

Web logic:

- CRUD functionality for users with login, logout, activation process and forgot/reset password
- CRUD functionality for advertisements
- Limiting the number of request to 20 with refilling the bucket with 5 requests every 10 seconds.
- Using refresh/access token for login security. Refresh token is hashed and stored in database on the backend. In the frontend, refresh token is stored in HttpOnly cookie (secured from JS injection), lasts 14 days and is sent with each request. Access token is stored in the memory (zustand state) and lasts 15 minutes. Axios intercepts requests to inject access token for Authorization and calls `/refresh` route if the requests sends 401
- UI is stylized with tailwind and sonner toast messages
