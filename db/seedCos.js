const mongoose = require("mongoose");
const Company = require("../models/company.js");
const User = require("../models/user.js");

const data = [
  {
    profile: {
      name: "bookingkit",
      logo: "https://img1.oastatic.com/img2/23902507/max/bookingkit_logo_02-.png",
      intro: "We make it easy and frictionless, helping you focus on what’s truly important. Running a business is challenging enough without tedious, complicated, often repetitive manual processes. For that there’s bookingkit: the smart, all-in-one software solution especially built for promoting, managing & operating Tours, Activities and Attractions.",
      pricing: "There are three tiers available, each offering different features. Prices start $39 per month plus transaction fees of 3% plus 50¢ per ticket sold.",
      type: "Reservation System",
      usp: ["Native support available in English, Spanish, Italian, French & German", "manage all of your bookings, availabilities and cancellations from one central platform", "Chosen by thousands of European providers."],
      website: "www.bookingkit.com",
    },
  },
  {
    profile: {
      name: "Fareharbor",
      logo: "https://arival.travel/wp-content/uploads/2021/04/Fareharbor-Logo-360x360-01-1.png",
      intro: "Powerful booking software designed to help tour, activity and rental businesses manage and grow their online reservations. \n\nBeyond reservations, FareHarbor is a complete business management platform for tour and activity businesses. From one easy-to-use Dashboard, do everything from manage inventory to staff schedules. Hundreds of flexible features, advanced reporting and a friendly 24/7 support team make FareHarbor the perfect fit for any business. ",
      pricing: "Fareharbor charges 6% for bookings on your own website, and nothing for bookings through other channels.",
      type: "Reservation System",
      usp: ["24/7 support for every aspect of your business.","No setup fee, no monthly fee, no merchant fees","A user-friendly booking process that integrates seamlessly with your website."],
      website: "www.fareharbor.com",
    },
  },
  {
    profile: {
      name: "Bókun",
      logo: "https://irp-cdn.multiscreensite.com/a3bf8d02/dms3rep/multi/bokun-logo.svg",
      intro: "Bokun is Tripadvisor’s leading booking management technology and reservation software built specifically for tours, activities, and attractions operators in the travel industry. It's a booking engine, inventory manager, channel manager, multi-currency price management tool, and more—all rolled into one!",
      pricing: "Bókun offer a free tier with limited features, plus a $49 per month subscription which vastly expands what you can do. There's also 1.5% fee for direct online bookings.",
      type: "Reservation System",
      usp: ["Sell on as many channels as you want","Increase your efficiency and manage your business operations all in one place","Explore opportunities for you to grow your distribution, increase your productivity, and build new revenue streams"],
      website: "www.bókun.io",
    },
  },
  {
    profile: {
      name: "Prioticket",
      logo: "https://prioticket.com/assets/img/navbar/brand.png",
      intro: "PrioTicket connects operators with local and global reseller channels to create this unified customer solution. It enables experience operators to accept bookings in a single system, creating frictionless bookings, reservations, payments and redemption across online, mobile and instore.",
      pricing: "PrioTicket only offices pricing upon request.",
      type: "Ticketing System",
      usp: ["Sell your ticket to global leaders as well to local niche players","Increase sales by allocating capacity, and the use of pricing tools","Broaden your product portfolio with cross-selling and packaging"],
      website: "www.prioticket.com",
    },
  },
  {
    profile: {
      row_id: 4,
      name: "Rezdy",
      logo: "https://techboard.com.au/wp-content/uploads/2017/08/Rezdy-logo-blue-on-transparent-copy.png",
      intro: "Rezdy is on a mission: to power the growth of the experience industry with tools and connections to make it easier for you to run and grow your business. We help you get more bookings, save time on tedious admin and improve your customer experience.",
      pricing: "Rezdy offers three different pricing tiers between $49 to $249 p/month (AUD), plus a cost per booking - upto 2% for online bookings and $1 for offline bookings",
      type: "Reservation System",
      usp: ["Winner of Capterra’s Best Ease of Use award.","Rezdy powers the largest independent supply and distribution network for tours, activities and attractions.","No lock-in contracts plus unlimited products, users and connections on all plans"],
      website: "www.rezdy.com",
    },
  },
  {
    profile: {
      name: "Travelotopos",
      logo: "https://travelotopos.com/wp-content/uploads/2021/11/logo_site-1.png",
      intro: "Travelotopos Ltd is the most innovative software solution company in tourism. Our goal is to transform small businesses, that provide tourist services, in modern, digital companies which can stand out and compete with large companies in the industry. This can be achieved with a personalized approach. Each type of tourist service has its own reservation system which serves the needs of the business. All systems however can be linked together.",
      pricing: "After a €250 set up cost, there are transaction fees of 3% for website and OTA bookings, or 1.5% for offline bookings.",
      type: "Reservation System",
      usp: ["Create your booking engine within minutes","Accept online payments","Translated in 6 languages"],
      website: "www.travelotopos.com",
    },
  },
  {
    profile: {
      name: "Regiondo",
      logo: "https://financesonline.com/uploads/2020/05/Regiondo-logo1.png",
      intro: "Regiondo is a cloud-based appointment scheduling solution for businesses in the leisure industry. The solution can be integrated into users’ websites.\n\nThe ticket shop module can be used by mobile devices, computers, smartphones and tablets. Regiondo's booking solution manages the entire booking process, from order placement to order payment and finally order delivery.\n",
      pricing: "There are three tiers available, each offering different features. Prices start $49 per month, plus transaction fees of 3% and 49¢ per ticket. The highest priced plan is €199 per month with a 2% and 39c per ticket transaction fee.",
      type: "Reservation System",
      usp: ["Make your offers bookable 24/7 and reach more customers through OTAs","a central system to manage operations digitally so you have more time for customers and business-critical tasks.","Accept payments, manage products and connect with your customers in one place"],
      website: "www.regiondo.com",
    },
  },
  {
    profile: {
      name: "Ventrata",
      logo: "https://assets.ventrata.com/assets/img/logo-b73c9992c5c845cf586aa30b7192b35c5c871b7ab9d685d06fcaaff427c6725f.png",
      intro: "Ventrata is a proven and versatile booking platform built for high volume tours and attractions. With contactless booking, payment and check-in solutions we can provide the perfect solution to all your booking needs.",
      pricing: "Ventrata do not publicly disclose their pricing.",
      type: "Ticketing System",
      usp: ["Direct online sales can be set up quickly with our checkout widget","Increase distribution with ease through API connectivity to all the major OTA’s.","24/7 support from a global team!"],
      website: "www.ventrata.com",
    },
  },
  {
    profile: {
      name: "TourCMS",
      logo: "https://cdn.adventuretravelnews.com/wp-content/uploads/2010/10/squarelogo.gif",
      intro: "TourCMS is designed for Tours & Activity operators and offers proven solutions for Online and Offline Bookings, Distribution and Channel Management as well as CRM.\n",
      pricing: "TourCMS offers five different plans, based on how many users you have, channels you connect with, and bookings you receive. These range from free to €499 p/month. There is also a 2.9% transaction fee.",
      type: "Channel Manager",
      usp: ["TourCMS connects with many services out of the box","Offering education and consulting to their users","service availability has absolute priority - never miss a sale"],
      website: "www.tourcms.com",
    },
  },
];

const createCompanies = () => {
  Company.insertMany(data)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

module.exports = createCompanies;
