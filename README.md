# Ecomm v2

Full-stack eCommerce application built with React, Vite, and Firebase.

## Features

### Part 1 - Complete ✅
- ✅ Firebase Authentication (Email/Password)
- ✅ User Registration & Login
- ✅ Protected Routes
- ✅ Modular Service Architecture

### Part 2 - Complete ✅
- ✅ User Profile Management (View/Edit)
- ✅ Products Listing Page
- ✅ Shopping Cart with Quantity Controls
- ✅ Order Creation & Checkout
- ✅ Order History Page
- ✅ Reusable Components (ProductCard, CartItem, OrderCard)

### Part 4 - Complete ✅
- ✅ Product Details Page with Quantity Selector
- ✅ Product Search & Category Filtering
- ✅ Enhanced Navigation with Active States
- ✅ Responsive Design & Animations
- ✅ Improved UI/UX Styling
- ✅ Cart Badge with Item Count
- ✅ Loading States & Error Handling

### Part 5 - Complete ✅
- ✅ Wishlist Functionality (Add/Remove/View Favorites)
- ✅ Order Cancellation (Users can cancel pending orders)
- ✅ Error Boundary Component (Graceful error handling)
- ✅ Reusable LoadingSpinner Component
- ✅ EmptyState Component for Better UX
- ✅ Enhanced Product Cards with Wishlist Hearts
- ✅ Wishlist Page with Product Management

## Tech Stack

- **Frontend**: React 18+ with Vite
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Routing**: React Router DOM

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Firebase account

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd Ecommv2
```

2. Install dependencies
```bash
npm install
```

3. Configure Firebase
   - Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Copy your Firebase config
   - Update `src/firebase.js` with your configuration

4. Run the development server
```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── firebase.js              # Firebase configuration
├── main.jsx                 # App entry point
├── App.jsx                  # Root component with routing
├── index.css                # Global styles
├── hooks/
│   └── useAuth.js          # Auth state management
├── services/
│   ├── authService.js      # Authentication operations
│   ├── productService.js   # Product CRUD operations
│   ├── orderService.js     # Order management
│   ├── userService.js      # User profile operations
│   └── wishlistService.js  # Wishlist operations
├── pages/
│   ├── LoginPage.jsx       # Login form
│   ├── RegisterPage.jsx    # Registration form
│   ├── ProfilePage.jsx     # User profile view/edit
│   ├── ProductsPage.jsx    # Products listing & cart
│   ├── ProductDetailsPage.jsx # Individual product view
│   ├── WishlistPage.jsx    # User wishlist
│   └── OrdersPage.jsx      # Order history
└── components/
    ├── ProductCard.jsx     # Reusable product display
    ├── CartItem.jsx        # Cart item component
    ├── OrderCard.jsx       # Order history display
    ├── ErrorBoundary.jsx   # Error handling wrapper
    ├── LoadingSpinner.jsx  # Loading state component
    └── EmptyState.jsx      # Empty state display
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run Jest unit and integration tests

## Testing

The project uses **Jest** and **React Testing Library** for comprehensive testing:

### Test Files
- `src/__tests__/RegisterPage.unit.test.js` - Unit tests for registration page
- `src/__tests__/CartCheckout.unit.test.js` - Unit tests for cart checkout state
- `src/__tests__/CartFlow.integration.test.js` - Integration tests for cart flow

### Running Tests
```bash
npm test                    # Run all tests
npm test -- --coverage     # Run tests with coverage report
```

## CI/CD Pipeline

### GitHub Actions
The project includes automated CI/CD workflows triggered on every push to `main`:

**Build Job** (`.github/workflows/main.yml`)
- Checks out code
- Sets up Node.js 18
- Installs dependencies
- Validates the build

**Test Job** (`.github/workflows/main.yml`)
- Runs Jest unit and integration tests
- Fails the workflow if tests fail (prevents faulty code from being merged)

**View CI Status**: [GitHub Actions](<https://github.com/shaneyk01/Ecommv2/actions>)

### Vercel Deployment
The project is automatically deployed to Vercel on successful CI passing:

**Deployment Job** (`.github/workflows/deploy.yml`)
- Triggered after successful tests
- Deploys to Vercel production
- Project ID: `prj_83VTGePsQjE89226xUe0nR8E8Uti`

**Live Application**: [Vercel Deployment](<https://ecommv2-gray-three.vercel.app>)

## Key Features

### Shopping Experience
- **Product Browsing**: Grid layout with search and category filters
- **Product Details**: Dedicated pages with quantity selection and full descriptions
- **Wishlist**: Save favorite products for later with heart icon
- **Smart Navigation**: Breadcrumbs and intuitive routing between pages
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Loading States**: Smooth loading indicators throughout the app

### User Management
- **Authentication**: Secure login and registration with Firebase Auth
- **Profile Management**: Users can view and update their information
- **Order History**: Complete order tracking with status indicators
- **Order Cancellation**: Users can cancel pending orders

### Data Models

Add a new wishlist collection:on
- **Order History**: Complete order tracking with status indicators

## Firebase Security Rules

Configure these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are readable by all, writable by admins only
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
      // TODO: Add admin role check
    }
    
    
    // Wishlist items
    match /wishlists/{wishlistId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
      allow create: if request.auth != null &&
                       request.resource.data.userId == request.auth.uid;
    }
    // Orders are readable by the order owner only
    match /orders/{orderId} {
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      allow create: if request.auth != null &&
                       request.resource.data.userId == request.auth.uid;
    }
  }
}
```

## Adding Sample Products

To test the app, add some products to Firestore manually:

1. Go to Firebase Console → Firestore Database
2. Create a `products` collection
3. Add documents with this structure:
   ```json
   {
     "title": "Sample Product",
     "description": "Product description here",
     "price": 29.99,
     "category": "Electronics",
     "image": "https://via.placeholder.com/300",
     "createdAt": [Firebase Timestamp]
   }
   ```
