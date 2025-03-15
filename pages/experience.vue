<template>
  <UContainer>
    <div class="w-full pt-10 md:pt-24 lg:pt-32 flex-row pb-10">
      <h1
        class="lg:leading-tighter pb-2 text-4xl font-bold tracking-tighter sm:text-2xl md:text-4xl xl:text-6xl 2xl:text-6xl -mt-8 md:-mt-20"
      >
        Experience
      </h1>
    </div>
    <div class="container mx-auto p-4 -mt-8 mb-20">
      <template v-for="(exp, index) in experiencesList" :key="index">
        <JobExperiences
          :title="exp.title"
          :company="exp.company"
          :location="exp.location"
          :duration="exp.duration"
          :tasks="exp.tasks"
          :skills="exp.skills"
        />
      </template>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const experiencesList = [
  {
    title: "Senior Software Engineer",
    company: "Otani Trading FZCO",
    location: "Dubai, United Arab Emirates",
    duration: "Jun 2024 - Present · 3 months",
    tasks: [
      "Training Junior members",
      "Managing a team and leading front-end development on a new project. Web Mobile Application.",
      "Making important project direction and requirements decisions.",
      "UI/UX design using Figma and shadcn UI design.",
      "Using NuxtJS, VueJS, radix UI and shadcn components.",
      "Urql (graphql client) for data connections",
      "Strawberry types and python graphql for backend.",
    ],
    skills: ["Vue.js", "Nuxt.js", "Radix UI", "Shadcn for Vue", "GraphQL"],
  },
  {
    title: "Software Engineer",
    company: "Otani Trading FZCO",
    location: "Dubai, United Arab Emirates",
    duration: "Sep 2023 - Jul 2024 · 11 months",
    tasks: [
      "Works with VueJS and JavaScript Frontend, Fast API, pydantic, python Backend.",
      "Postgres Database",
      "pytest and cypress testing",
      "test driven programming, pair programming.",
      "worked on given requirements, converting into solutions and working on implementing them, with testing and feedback collection",
    ],
    skills: ["FastAPI", "Python", "VueJS", "JavaScript", "Postgres"],
  },
  {
    title: "Software Engineer",
    company: "Mystro",
    location: "Dubai, United Arab Emirates",
    duration: "Mar 2023 - Jun 2023 · 4 months",
    tasks: [
      "Worked on front-end and back-end changes for a confidential government project.",
      "Implemented APIs and wrote controllers using JavaScript and php-crud-api.",
    ],
    skills: ["Javascript", "MySQL", "PHP", "HTML", "JQuery"],
  },
  {
    title: "Junior Software Engineer",
    company: "RIOT by Preowned Collective Portal FZLLC",
    location: "Dubai, United Arab Emirates",
    duration: "May 2020 - Feb 2023 · 2 years 10 months",
    tasks: [
      "Complete implementation of Network International Payment Gateway and Postpay on the website using PHP.",
      "Hotfixing and resolving issues on live website to prevent downtime and minimize affecting customer experience.",
      "Experience in handling all aspects of e-commerce website, from website hosting to implementing features.",
      "Overseeing website redesign.",
      "Creating technical reports, requirement functionality documents for features and converting ideas into requirement documents and technical reports for implementation and estimating time required.",
      "Managing Live Code of the website using PHP, AJAX and HTML5.",
      "Creating automated journeys using Autopilot.",
      "Creating and drafting requirements using JIRA.",
      "API implementation, creation and testing using Postman.",
      "Implementation of Chat Bot on website using LiveChat - Autopilot integration.",
    ],
    skills: [
      "Requirements Analysis",
      "Fullstack Web Development",
      "JSON Web Token (JWT)",
      "Git",
      "PHP",
      "Jira",
      "Reactjs",
      "Nextjs",
    ],
  },
  {
    title: "Operations and Development Intern",
    company: "RIOT by Retail Forward FZLLC",
    location: "Dubai, United Arab Emirates",
    duration: "Nov 2019 - May 2020 · 7 months",
    tasks: [
      " Working with Vend POS and Vend API development ",
      "Using AWS Lambda and deployment on AWS API Gateway using Python and AWS Tools.",
      "Worked with Airtable database",
      "Website optimisation and working with CMS systems.",
      "E-commerce experience",
      "Managing and monitoring website.",
      "Worked with JIRA, Confluence, Google Analytics, Imgix, Python scripting ",
      "Prototyping and wire-framing using Adobe XD and FIGMA.",
    ],
    skills: [
      "Software Development",
      "Airtable",
      "JIRA",
      "Google Analytics",
      "Confluence",
      "Python",
      "Vend",
    ],
  },
  {
    title: "Software Engineer Intern",
    company: "Alucor Limited",
    location: "Dubai, United Arab Emirates",
    duration: "Jan 2019 - Jul 2019 · 7 months",
    tasks: [
      "Developed Web Application for internal company usage, to transition dependency from MS Excel to databases.",
      "Used Flask, implemented Model View Controller (MVC) architecture for application. Also implemented many libraries, mainly for authentication, authorization and security. Training for Flask was supervised under experienced professionals in company. ",
      "Created DB schema in MySQL and SQLite, and used ORM - SQLAlchemy.",
      "Implemented JSON and CSV parsing to read data into the database. ",
      "Worked extensively with event-driven functions to provide user-friendliness. ",
      "Implemented front-end designs using HTML5/CSS, JavaScript and jQuery. ",
      "Ran checks and audits to optimize performance using Selenium and Chrome Lighthouse.",
      "Developed basic REST APIs to handle the web application.",
      "Used Git VCS, and Agile Programming methodology to gather requirements from the client.",
      "Deployed on company server and implemented LDAP authentication.",
    ],
    skills: [
      "Django",
      "Flask",
      "MySQL",
      "SQLite",
      "Javascript",
      "HTML5/CSS",
      "jQuery",
      "git",
    ],
  },
];
</script>
