<template>
  <PageContainer>
    <PageHeader title="EXPERIENCES" title-class="-mt-8 md:-mt-20" />
    
    <div class="container mx-auto px-4 mb-8 text-center">
      <p class="text-lg text-gray-900 dark:text-white font-semibold">
        <TypingEffect 
          :strings="[`${totalYears}+ years of professional experience`]" 
          :loop="false"
          :type-speed="50"
        />
      </p>
    </div>

    <div class="container mx-auto p-4 mb-20">
      <div class="space-y-6">
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
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
// Function to parse duration and calculate months
const calculateMonths = (duration: string): number => {
  const now = new Date();
  const parts = duration.split(' - ');
  
  if (parts.length !== 2) return 0;
  
  const parseDate = (dateStr: string): Date => {
    if (dateStr === 'Present') {
      return now;
    }
    const [month, year] = dateStr.split(' ');
    const monthMap: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    return new Date(parseInt(year), monthMap[month] || 0);
  };
  
  const startDate = parseDate(parts[0]);
  const endDate = parseDate(parts[1]);
  
  const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                 (endDate.getMonth() - startDate.getMonth());
  
  return Math.max(months, 0);
};

const experiencesList = [
  {
    title: "Frontend Engineer",
    company: "Applied AI",
    location: "Abu Dhabi, United Arab Emirates",
    duration: "Jun 2025 - Present",
    tasks: [
        "Contributed to the core development of Opus, specifically within the low-code/no-code **Workflow Builder** feature, empowering users to create and deploy AI-driven processes.",
        "Responsible for the implementation of new features across the frontend stack, enhancing user interaction and the overall usability of the platform.",
        "Applied best practices in cross-browser compatibility and responsive design to ensure a seamless experience for all users.",
        "Contributed to the core development of Opus, specifically within the low-code/no-code **Workflow Builder** feature, empowering users to create and deploy AI-driven processes.",
        "Engineered and maintained reusable, high-performance UI components using modern frameworks (Vue.js, React.js) to ensure a scalable and consistent user experience.",
        "Collaborated cross-functionally to translate complex AI application requirements into intuitive and responsive user interfaces.",
    ],
    skills: ["Vue.js", "React.js", "Tailwind CSS", "TypeScript","Node.js","Express.js","PostgreSQL","Docker","Kubernetes"],
  },
  {
    title: "Senior Software Engineer",
    company: "Otani Trading FZCO",
    location: "Dubai, United Arab Emirates",
    duration: "Jun 2024 - Feb 2025",
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
    duration: "Sep 2023 - Jul 2024",
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
    duration: "Mar 2023 - Jun 2023",
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
    duration: "May 2020 - Feb 2023",
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
    duration: "Nov 2019 - May 2020",
    tasks: [
      "Working with Vend POS and Vend API development",
      "Using AWS Lambda and deployment on AWS API Gateway using Python and AWS Tools.",
      "Worked with Airtable database",
      "Website optimisation and working with CMS systems.",
      "E-commerce experience",
      "Managing and monitoring website.",
      "Worked with JIRA, Confluence, Google Analytics, Imgix, Python scripting",
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
    duration: "Jan 2019 - Jul 2019",
    tasks: [
      "Developed Web Application for internal company usage, to transition dependency from MS Excel to databases.",
      "Used Flask, implemented Model View Controller (MVC) architecture for application. Also implemented many libraries, mainly for authentication, authorization and security. Training for Flask was supervised under experienced professionals in company.",
      "Created DB schema in MySQL and SQLite, and used ORM - SQLAlchemy.",
      "Implemented JSON and CSV parsing to read data into the database.",
      "Worked extensively with event-driven functions to provide user-friendliness.",
      "Implemented front-end designs using HTML5/CSS, JavaScript and jQuery.",
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

// Calculate total years of experience
const totalMonths = computed(() => {
  return experiencesList.reduce((total, exp) => {
    return total + calculateMonths(exp.duration);
  }, 0);
});

const totalYears = computed(() => {
  return Math.floor(totalMonths.value / 12);
});
</script>
