# 🎸 Cuerdario — MVP Spec + Codex Prompt

## 🧭 Project Overview

**Cuerdario** is a cross-platform application (iOS, Android, Web) that helps musicians:

1. Tune their guitar in real time  
2. Store and manage a personal library of songs with chords and links  

The product combines a **real-time utility tool (tuner)** with a **personal music workspace (song library)**.

---

# 🎯 MVP Goals

The MVP must allow a user to:

- Open the app and immediately start tuning
- Save and manage songs with chords and links
- Use the app without an account (guest mode)
- Optionally create an account and sync data
- Use the app offline (basic functionality)

---

# 🧱 Core Features

## 1. 🎸 Tuner

### Functional Requirements

- Access device microphone
- Detect pitch in real time
- Display detected musical note
- Show tuning state:
  - In tune
  - Flat (low)
  - Sharp (high)

### Scope (MVP)

- Standard guitar tuning only:
  - E A D G B E

### UI Elements

- Large central note display
- Visual tuning indicator:
  - Needle or horizontal bar
- Continuous feedback (not binary)
- Optional frequency display

### Behavior

- Starts automatically when entering the screen
- Real-time updates (low latency)
- Smooth animations
- Clear visual feedback

### States

- Waiting for input
- Listening
- In tune
- Out of range

---

## 2. 🎵 Songs Library

### Data Model

Each song contains:

- `id`
- `name`
- `artist`
- `notes` (chords / lyrics)
- `link` (optional URL)
- `isFavorite` (boolean)
- `createdAt`
- `updatedAt`

### Functional Requirements

- Create song
- Edit song
- Delete song
- Mark/unmark favorite
- List songs
- Search songs (name + artist)

### UI

#### List View

- Simple cards
- Song name (primary)
- Artist (secondary)
- Favorite indicator
- Optional link indicator

#### Detail View

- Clean reading layout
- Notes/chords prominently displayed
- External link button
- Edit action

---

## 🔐 Authentication (Clerk)

### Modes

#### Guest Mode
- No login required
- Data stored locally

#### Authenticated Mode
- Login via Clerk
- Sync with backend (Convex)

### Behavior

- App works fully without login
- User can sign up later
- Local data should be migratable to account (basic implementation)

---

## 💾 Data & Sync

### Local Storage (Offline-first)

- Songs stored locally
- App usable without internet

### Sync (Convex)

- Sync when authenticated
- Simple conflict resolution:
  - Last write wins (MVP)

---

# ⚙️ Tech Stack

## Frontend

- Expo (React Native)
- TypeScript
- Expo Router
- React Native Web

## Backend

- Convex (database + functions)
- Clerk (authentication)

---

# 🧠 UX Principles

- Zero friction (instant use)
- Immediate clarity
- Fast and responsive
- Minimal cognitive load
- Familiar mobile patterns

---

# 🎨 Design & Branding Guidelines

> ⚠️ IMPORTANT: Follow the provided Design.md and Figma designs strictly.

## Style Direction

- Dark interface
- Warm accent elements
- Minimalist and functional
- Clean typography hierarchy
- No visual clutter

## Tuner Feel

- Central, immersive experience
- Smooth, organic motion
- Feels “alive” (like string vibration)

## Songs Section Feel

- Calm, readable
- Notebook-like experience
- Content-first layout

## Interaction

- Subtle animations
- Immediate feedback
- No aggressive transitions

---

# 🚫 Out of Scope (MVP)

- Multiple tunings
- Metronome
- Audio recording
- Chord detection
- Social features
- Sharing songs
- Advanced sync/conflict handling

---

# 🧭 Navigation Structure

## Tabs

- 🎸 Tuner
- 🎵 Songs

No complex home screen.

---

# 🧩 Codex Implementation Prompt

## 🧠 Context

You are building a production-ready MVP for a cross-platform mobile + web app called **Cuerdario**.

This app includes:
- A real-time guitar tuner
- A personal song/chord library

---

## 📦 Inputs You Will Receive

You will be given:

1. `MVP.md` (this document)
2. `Design.md` (design system and UI rules)
3. Figma design link

👉 You MUST follow Design.md and Figma precisely for UI implementation.

---

## 🛠 Requirements

### General

- Use **Expo + React Native + TypeScript**
- Use **Expo Router**
- Support **iOS, Android, Web**
- Clean, modular architecture

---

### State Management

- Use simple state (React hooks or lightweight solution)
- Avoid over-engineering

---

### Data Layer

- Use **Convex** for backend
- Implement:
  - Songs CRUD
- Use **Clerk** for authentication

---

### Offline Support

- Store songs locally
- Sync when authenticated

---

### Tuner Implementation

- Access microphone via Expo APIs
- Implement real-time pitch detection
- Show:
  - Note
  - Tuning offset (sharp/flat)
- Optimize for low latency

---

### Screens to Implement

#### 1. Tuner Screen
- Real-time pitch detection
- Central visual indicator

#### 2. Songs List Screen
- List of songs
- Search
- Favorites

#### 3. Song Detail Screen
- Full notes view
- Edit button

#### 4. Create/Edit Song Screen
- Form inputs
- Save/update logic

#### 5. Auth (minimal)
- Clerk integration
- Optional login flow

---

### Components

- Reusable UI components
- Follow design system strictly
- Keep components small and focused

---

### Folder Structure (suggested)
/app
/(tabs)
/tuner
/songs
/song
/[id]
/create
/components
/hooks
/lib
/convex
/auth
/store

---


---

### Performance

- Avoid unnecessary re-renders
- Optimize tuner updates
- Use memoization where needed

---

### Code Quality

- Clean, readable code
- Strong typing (TypeScript)
- No unused code
- No console.logs in final

---

### Deliverables

- Fully working Expo project
- Runs on:
  - iOS
  - Android
  - Web
- Functional tuner
- Functional CRUD songs
- Auth optional but integrated

---

## ⚠️ Priorities

1. Functionality > perfection
2. Tuner responsiveness is critical
3. UI must match design system and figma
4. Keep implementation simple and clean

---

## ✅ Success Criteria

- User can open app and tune immediately
- User can create and view songs
- App works offline
- App syncs when logged in
- UI feels smooth and intentional

---

# 🚀 End of Spec