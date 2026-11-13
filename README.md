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

Zustand was chosen to manage tasks, filters and application state. Given the relatively small state structure, it provides a simple solution with minimal boilerplate. Selectors are used to minimize unnecessary component re-renders.

 2. Service Layer

A `TaskService` interface separates task operations from the store. The current implementation uses a mock API backed by AsyncStorage. Storage errors are converted into `TaskServiceError` with readable error messages.

3. Code Structure

The application is organized into screens, reusable components, services, store, utilities and types. Filtering and form validation logic are kept outside UI components to maintain separation of concerns and improve maintainability.

 4. Local Persistence

AsyncStorage provides local persistence across app restarts. The service layer handles reading and writing task data, while Zustand maintains the in-memory application state.

 5. Performance

FlatList is used for efficient task rendering. React.memo, useMemo and useCallback help reduce unnecessary rendering and recalculation. Zustand selectors further limit component updates to relevant state changes.
