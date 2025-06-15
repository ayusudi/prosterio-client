This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

# Project Structure

```
client-prosterio/
├── .env                      # Environment configuration file (NEXT_PUBLIC_API_URL=http://localhost:3001)
├── .flowbite-react/          # Configuration and patches for Flowbite React
├── components/               # Reusable components
│   ├── default-layout.jsx    # Main layout of the application
│   ├── sidebar.jsx           # Sidebar component for navigation
│   ├── is-auth.jsx           # HOC for user authentication
│   ├── is-admin.jsx          # HOC for admin authentication
│   ├── chat.jsx              # Component for AI chat feature
│   └── toast.jsx             # Notification component
├── pages/                    # Next.js routing structure
│   ├── index.jsx             # Login page
│   ├── _app.jsx              # Main Next.js app component
│   ├── _document.jsx         # Custom HTML document setup
│   ├── dashboard/            # Dashboard pages
│   │   ├── _components/      # Dashboard-specific components
│   │   │   ├── board-chart.jsx      # Data visualization
│   │   │   ├── sankey-chart.jsx     # Sankey diagram
│   │   │   ├── employees.jsx        # Employee table
│   │   │   └── modal-employee.jsx   # Employee detail modal
│   │   └── index.jsx         # Main dashboard page
│   ├── chats/                # AI chat feature
│   │   ├── [id]/index.jsx    # Chat detail page
│   │   ├── index.jsx         # Chat list page
│   │   └── layout.jsx        # Layout for chat pages
│   ├── add-it-talent/        # Add IT talent page
│   │   ├── _components/      # Components for add-it-talent page
│   │   └── index.jsx         # Main page for adding IT talent
│   ├── admin/                # Admin dashboard pages
│   └── add-admin/            # Page for adding new admin
├── public/                   # Static assets (images, favicon, etc.)
├── service/                  # API services
│   └── api.js                # Axios configuration for API calls
├── styles/                   # CSS files
│   └── globals.css           # Global styles using Tailwind CSS
├── package.json              # npm dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
└── README.md                 # Project documentation
```
