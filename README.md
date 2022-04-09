# Trusted Travel Tech
A Node/Express review website where tour operators and attractions can rate the reservation technology they're using. Peers can read the reviews, and choose the rich technology for their business.

- Live demo [_here_](https://www.trustedtraveltech.com)
- Medium Blog [ _here_ ] (https://chrisjcastle93.medium.com/how-i-built-this-a-2-week-node-express-full-stack-app-to-help-tour-operators-choose-their-tech-ca9b8ce1ebac)

## General Information
I work in the travel industry, and know that operators have a hard time choosing technology to help them run their business. Operator forums are chock-full of people asking for advice from their peers about which technology to choose.

This is the problem I selected to solve, and thought a review site specifically for this niche would be a good solution.

I built this in two weeks as part of Ironhack's part-time Web Development Bootcamp as my second project, and is my first full stack app. 

## Technologies Used
- Node 
- Express
- Mongo
- Mongoose
- Handlebars
- Axios
- bcrypt
- Jest
- Nodemailer
- Passport
- Tailwind
- Twitter API
- Heroku

## Features
- **Auth**: Users can sign up and login, either using their email/password (bcrypt) or Google SSO (passport). Users are also able to verify their sign up over email, using Nodemailer.
- **Reviews**: Once logged in, they're able to fill in a form to leave a review about a created company. This requires 3 models (Users, Reviews, Companies).
- **Filters**: Users are able to filter reviews to narrow in on company's that suits their needs, using DOM manipulation.
- **Twitter Bot**: When a review is left, it's tweeted out with a link to the handle @TrustedTravelT
- **Tests**: I used TTD using Jest.

## Usage
You can run this app after cloning by using `npm start`

## Project Status
Project is: _complete_

## Room for Improvement

- **SEO Optimization**: I currently have a lighthouse score of 84 after purging Tailwind, but I could do more in terms of adding alt tags, meta descriptions etc

- **To do**: I had a list of additional features planned and prioritised using RICE framework. You can read more about them [_here_] (https://chrisjcastle93.medium.com/how-i-built-this-a-2-week-node-express-full-stack-app-to-help-tour-operators-choose-their-tech-ca9b8ce1ebac)

## Contact
feel free to [_contact_](mailto:chrisjcastle93@gmail.com) me
