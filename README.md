# Car Wash Booking System Frontend

## Overview

The **Car Wash Booking System Frontend** is a user-friendly web application designed to streamline the car wash booking process. It provides a seamless experience for users to book car wash services, while offering powerful management tools for administrators.

## Features

### Public Pages

1. **Home Page**
   - Navigation Menu: Links to Services, Booking, Login, and other essential sections.
   - Hero/Branding Section: Engaging introduction with branding visuals.
   - Call-to-Action Button: Prominent button for booking a service.
   - Featured Services: Highlight up to six services with descriptions and images.
   - Review Section: Input for feedback with a star-based rating system, display of overall site rating, and recent reviews. Overlay for login if not authenticated.

2. **User Authentication Pages**
   - **Sign Up Page**: Form to create a new account with fields for name, email, password, phone number, and address.
   - **Login Page**: Form for login with email and password fields.

3. **Services Page**
   - List of all car wash services with descriptions, prices, and durations. Includes search, filter, and sort functionality.

4. **Service Details Page**
   - Detailed information about services, display of available time slots, and option to book a slot.

5. **Booking Page**
   - Display selected service and time slot with a form for user information and a "Pay Now" button for payment processing.

6. **Error Pages**
   - Custom 404 page with navigation options.

### Admin Pages

1. **Admin Dashboard**
   - Overview of recent bookings, user management, slot management, and service management.
   - **Service Management**: Add, update, and delete services with real-time updates.
   - **Slot Management**: Create and manage service slots, update slot statuses.
   - **User Management**: View and edit user roles, and manage bookings.

### User Pages

1. **User Dashboard**
   - Overview of bookings and account information, profile updates, and management of personal information.
   - **Past Bookings**: Displayed in tabular format.
   - **Upcoming Bookings**: Displayed in card format with countdown timers.

2. **Service Slot Countdown**
   - Display countdown timers for upcoming bookings in the navbar and on booking cards.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/zibranhasan/Car-wash-booking-system-frontend.git
    ```

2. Navigate to the project directory:

    ```bash
    cd car-wash-booking-system-frontend
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Start the development server:

    ```bash
    npm start
    ```

## Configuration

Ensure you have the necessary environment variables set up. Create a `.env` file in the root directory and add the following:

```env
REACT_APP_API_URL=http://your-api-url

