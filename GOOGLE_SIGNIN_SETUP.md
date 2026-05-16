# Google Sign-In Setup (Prakriti Seva)

Agar aapko Google sign-in ka "access blocked" aa raha hai, to issue mostly OAuth config ka hota hai.

## 1) Google Cloud Console me project banao
1. Open: https://console.cloud.google.com/
2. Top project selector se **New Project** banao.
3. Project select karo.

## 2) OAuth Consent Screen configure karo
1. Left menu: **APIs & Services → OAuth consent screen**
2. User type: **External** (ya Internal agar Workspace org hai)
3. App name, support email, developer email fill karo.
4. Save and continue.

## 3) OAuth Client ID banao
1. Left menu: **APIs & Services → Credentials**
2. Click: **Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Name: `Prakriti Seva Web`

### Authorized JavaScript origins me ye add karo:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:5173`

> Redirect URI ki zarurat generally Google One Tap / button flow me nahi hoti.

5. Create pe click karo.
6. Aapko client ID milega format me:
   `xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`

## 4) Project env files me client ID paste karo

### Frontend env
File: `.env`

Set:
`VITE_GOOGLE_CLIENT_ID=PASTE_YOUR_REAL_CLIENT_ID`

### Backend env
File: `backend/.env`

Set:
`GOOGLE_CLIENT_ID=PASTE_YOUR_REAL_CLIENT_ID`

## 5) Servers restart karo
Workspace root se:

```powershell
npm run dev
```

Backend separate chalana ho to:

```powershell
npm start --prefix backend
```

## 6) Agar fir bhi blocked aaye
- Ensure OAuth consent screen **Published/Testing configured** hai.
- Same Google account use karo jo test user me allowed hai (agar app testing mode me hai).
- Origins exactly match karein: `http://localhost:3000` ya `http://localhost:3001` ya `http://localhost:5173`.
- Browser cache clear karke retry karo.

---

## Quick note
Main aapke Google account me login karke credentials create nahi kar sakta. Lekin jaise hi aap client ID bhej doge, main turant `.env` aur `backend/.env` me set karke final run-verify kar dunga.
