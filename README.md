# TaskFlow

TaskFlow is a task management app built using React Native, Expo and TypeScript. It supports creating, editing, searching, filtering, completing and deleting tasks. Tasks are stored locally using AsyncStorage.

## Setup

Requirements: Node 20+, and either Expo Go on a device, an Android emulator, or the iOS simulator.

```bash
npm install
npx expo install --fix   # only if Expo reports version mismatches
npm start                # then press i (iOS), a (Android), or scan the QR code
npm test                 # Jest + React Native Testing Library
npm run android
npm run ios


## Features

Task list with title, description, status, priority and due date.

Search by title and filter by status and priority.

Clear all filters with one tap.

Create and edit tasks using a modal form with validation.

Mark tasks as completed or pending.

Delete tasks with confirmation.

Tasks persist across app restarts using AsyncStorage.


## Architecture

```
src/

types/ Domain types (Task, TaskInput, TaskFilters)

services/ TaskService interface + mock API backed by AsyncStorage

store/ Zustand store: state + actions (all business logic)

utils/ Pure helpers: filterTasks, validation, dates

components/ Reusable presentational components (TaskItem, Filter , SearchBar, TaskFormModal, StateViews)

screens/ TaskListScreen (composes store + components)

tests/ Unit and component tests

## Technical Decisions

1. State Management – Zustand

I used Zustand to manage tasks, filters and application state. Since this application has a relatively small state structure, Zustand keeps things simple without requiring much boilerplate. I also used selectors to avoid unnecessary component re-renders.

2. Service Layer

I separated task operations from the store using a TaskService interface. The current implementation is a mock API backed by AsyncStorage, and storage errors are converted into a TaskServiceError with a readable message.

3. Code Structure

I separated the application into screens, reusable components, services, store, utilities and types. Filtering and form validation are handled outside the UI components to keep them focused on rendering and user interactions.

4. Local Persistence

AsyncStorage is used to save tasks between app restarts. The service handles reading and writing data, while Zustand maintains the in-memory state.

5. Performance

I used FlatList for rendering tasks, React.memo for reusable components, useMemo for filtered data and useCallback for screen callbacks. Zustand selectors are also used to limit unnecessary updates.
