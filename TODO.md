- Create local DB for development
- Create build script to bootstrap with branding. We will want to have some env variables that can handle this. Maybe we inject this from someone secure 

- Example S3 CORS policy

```
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "POST", "PUT"],
    "AllowedOrigins": ["*"],  // Restrict to domain variable for the unique site.
    "ExposeHeaders": []
  }
]
```

- s3 backend is configured in plugins.ts but we will need to set values. Obviously we should abstract those values to someone that can be easily override. Maybe an AWS secret that is injected at build time via CI?

- Create defaults for folder and file uploads
Provide a default configuration with random files to give an example for folks during setup
Ex. TRACKNAME/DATE/DAY => Watkins Glen/10-23-2024/Practice 

- create defaults for notes and setup details in the same format


- Allow offline functionality for when internet access is limited ( common at racetracks) ? 

- Confirm mobile app would sync with web app for persistence

- Custom icons and graphics for things like tire temp, setup, track, etc. 
- Could potenitally build or pull from an existing database for tracks to source these icons and create drop downs to select. EG. can select circuit of the americas and a track icon of COTA is pulled in... Just a thought, maybe not in v1.


- Consider this GPT answer for some template setups


```
Is there some way to script a base configuration of strapi? let's say I launch a new customer and I want to run a build script that builds them an instance, with custom branding ( provided through variables ) - I'll handle the deployment - but as far as the core concept - is this possible?
```

Answer

```
Yes, it’s possible to automate a base configuration for Strapi to set up a new branded instance. You can accomplish this by creating a script that programmatically initializes a new instance with custom branding and pre-configured settings. Here’s a high-level overview of how you can approach this:

1. Set Up Environment Variables

Create a .env file or define environment variables to handle branding and customization dynamically. For example:

CUSTOMER_NAME="MyCustomer"
CUSTOMER_LOGO_URL="https://example.com/logo.png"
CUSTOMER_FAVICON_URL="https://example.com/favicon.ico"
CUSTOMER_PRIMARY_COLOR="#123456"

2. Create a Script for Configuring Strapi

Using Node.js scripts and Strapi’s programmatic API, you can automate parts of the setup, like content types, roles, permissions, and initial branding assets.
	1.	Bootstrap File: Strapi’s config/functions/bootstrap.js file allows you to execute custom logic each time Strapi starts. You can use this to initialize your configuration based on environment variables or other external sources.
In config/functions/bootstrap.js, you might add code like this:

module.exports = async () => {
  if (process.env.CUSTOMER_NAME) {
    // Update branding configurations
    await strapi.query('plugin::users-permissions.role').update({ name: "Authenticated" }, {
      name: `${process.env.CUSTOMER_NAME} User`
    });
    // Additional setup logic
  }
};


	2.	Seed Data with Custom Configurations: Create a seeding script to generate initial data, branding, and permissions using Strapi’s programmatic API.
Create a seed.js file (e.g., in a scripts directory):

const seed = async () => {
  // Set up branding options
  await strapi.plugins['users-permissions'].services.userspermissions.updateRole('authenticated', {
    description: `${process.env.CUSTOMER_NAME} user role`
  });

  // Create other data, content types, roles, etc.
  await strapi.plugins.upload.services.upload.upload({
    files: {
      path: process.env.CUSTOMER_LOGO_URL,
      name: 'logo.png',
      type: 'image/png'
    },
    data: { name: `${process.env.CUSTOMER_NAME} Logo` },
  });
};

seed().then(() => console.log('Seed data created'));

Run this script after each deployment to ensure custom data is populated.

3. Automate Admin Customizations

If you need to replace Strapi’s UI files for things like logos, colors, and other branding:
	1.	Admin Panel Customization with Custom Variables: Use environment variables to customize the src/admin/app.js file or load branding assets dynamically based on the customer:

// src/admin/app.js
export default {
  config: {
    theme: {
      colors: {
        primary100: process.env.CUSTOMER_PRIMARY_COLOR || '#ff5a5f'
      }
    },
    auth: {
      logo: process.env.CUSTOMER_LOGO_URL || '/path/to/default/logo.png'
    },
    head: {
      favicon: process.env.CUSTOMER_FAVICON_URL || '/path/to/default/favicon.ico'
    },
  }
};



4. Dockerfile Customization

If you’re using Docker, modify the Dockerfile to include the environment variables or inject branding assets:

# Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY ./my-project .

# Pass environment variables for custom branding
ENV CUSTOMER_NAME="MyCustomer"
ENV CUSTOMER_LOGO_URL="https://example.com/logo.png"

RUN npm install

# Seed initial data
CMD ["npm", "run", "develop", "&&", "node", "scripts/seed.js"]

5. Execute Initialization on Deployment

To ensure each new customer instance is configured with your base setup and branding:
	1.	Deploy the container or application files.
	2.	Run your seed.js script to initialize the instance with customer-specific branding.
	3.	Confirm that all customizations apply correctly, ensuring that environment variables are propagated.

This approach provides flexibility and efficiency in configuring multiple branded Strapi instances without manual intervention. Let me know if you need a deeper dive into any specific part of this setup!
```