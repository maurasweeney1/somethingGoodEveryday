# Something Good Everyday

Something Good Everyday is a website which acts as a source for positivity and inspiration. Users can add an anonymous post that fits in a given category about anything they want, with text, a link, and/or an image.

## Setup

1.  Clone the Repository

    `git clone https://github.com/maurasweeney1/somethingGoodEveryday.git`

    `cd somethingGoodEveryday`

2.  Install dependencies

    ensuring npm and node.js are installed

    Install backend dependencies

        npm install express cors mongoose bcryptjs validatorjs jwt-simple multer

    Instal frontend dependencies

        npm install react react-router-dom

3.  Set Up the Database

    Install and configure MongoDB if not already installed.

    Start a MongoDB server locally or provide a connection string to a remote MongoDB instance.

4.  Configure Environment Variables

    Create a .env file in the project root with the following variables:

         PORT=5001

         MONGO_URI=your_mongodb_connection_string

         SECRET=your_secret_jwt_key

5.  Start the Backend Server

    `cd backend`

    Start the Express.js server:

        node server.js

6.  Run the React Frontend

Open a new terminal and cd frontend

Start the React development server

       npm start


8. Open in Your Browser

Navigate to http://localhost:3000 to view the application.

## Usage

- Add an uplifting post with text, an image, and/or a link.
- Browse existing posts sorted by category, content, or date posted.
- Edit or delete your posts anonymously.
- Like posts to show appreciation for shared positivity.

## Notes

- The backend is powered by Express.js and MongoDB for efficient data storage and retrieval.
- The frontend is built using React and Node.js for a dynamic user experience.
- Likes, links, and images are all supported for each post, making the content more engaging.

## Contributing

To contribute to the project:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make changes and commit them with clear messages.
4. Push to your branch and open a pull request.

## Credits

Developed by **Maura Sweeney**

## License

This project is licensed under the MIT License. Feel free to use, modify, and share as needed.
