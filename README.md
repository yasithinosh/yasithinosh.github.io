# My Portfolio

A professional, modern, and interactive portfolio website built for **Yasith Inosh**.
This project showcases skills, projects, and provides a way for potential clients or employers to make contact.

## 🚀 Features

-   **Modern UI/UX**: Built with **Glassmorphism** design principles and smooth fade-up animations.
-   **Dynamic GitHub Projects**: Automatically fetches and displays your top 6 original repositories from the GitHub API.
-   **Responsive Design**: Fully optimized for desktops, tablets, and mobile devices.
-   **Interactive Contact Form**: Ready-to-use form integrated with **Formspree**.
-   **Automated Testing**: Includes a **Playwright** test suite to ensure site stability.
-   **Profile Customization**: Features a glowing, animated profile picture.

## 🛠️ Technologies

-   **HTML5** & **CSS3** (Custom Variables, Flexbox, Grid)
-   **JavaScript** (ES6+, Fetch API, IntersectionObserver)
-   **Playwright** (for Automated Testing)

## 🏃‍♂️ Getting Started

### Prerequisites

-   Git
-   Node.js (for running tests or local server)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yasithinosh/yasithinosh.github.io.git
    cd yasithinosh.github.io
    ```

2.  **Open `index.html`**:
    Simply open the file in your browser to view the site locally.

    *Or for a better experience, run a local server:*
    ```bash
    npx http-server .
    ```

## ✅ Automated Testing

This repository is equipped with **Playwright** for end-to-end testing.

1.  **Install dependencies**:
    ```bash
    npm install
    npx playwright install chromium
    ```

2.  **Run Tests**:
    ```bash
    npx playwright test
    ```
    This will check:
    -   Homepage loads correctly.
    -   "Download CV" button is present.
    -   GitHub API integration is fetching projects.

## ⚙️ Customization

### 1. Contact Form
The contact form is set up for **Formspree**. To make it functional:
1.  Go to [Formspree](https://formspree.io/) and create a new form.
2.  Copy your unique form endpoint.
3.  Update line 95 in `index.html`:
    ```html
    <form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
    ```

### 2. GitHub Username
To display your own repositories:
1.  Open `js/main.js`.
2.  Update the `githubUsername` variable on line 3:
    ```javascript
    const githubUsername = 'your-username';
    ```

### 3. Profile Picture
To change your profile picture:
1.  Replace `assets/profile_pic.jpeg` with your image.
2.  Ensure the filename matches or update the `src` in `index.html`.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).