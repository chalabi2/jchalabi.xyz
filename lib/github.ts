// Types for our project data
import { Octokit } from "@octokit/rest";

export interface ProjectConfig {
  allowList: string[];
  featured: string[];
  customData: {
    [key: string]: {
      description?: string;
      tags?: string[];
      demoUrl?: string;
      category: ("frontend" | "backend" | "infrastructure" | "AI")[];
    };
  };
}

export interface Project {
  id: string;
  title: string;
  description: string;
  repoUrl: string;
  demoUrl?: string;
  tags: string[];
  date: string;
  featured: boolean;
  owner: string;
  language: string;
  stars: number;
  category: string[];
  isPrivate?: boolean;
}

// Initialize Octokit with your GitHub token
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Configuration for allowed repos and custom data
const projectConfig: ProjectConfig = {
  allowList: [
    "gravity-info-api",
    "chandra-station-app",
    "manifest-app",
    "skip-go-fast-solver-ui",
    "auction-frontend",
    "althea-link",
    "ai-app-template",
    "bg-remover",
    "manifest-ledger",
    "quicksilver",
    "manifestjs",
    "neons-refund",
    "peer-visualizer",
    "ccr-ui",
    "LFP",
    "caddy-blockchain-health",
    "prop-voter",
    "caddy-stateful-jwt-auth",
  ],
  featured: [
    "gravity-info-api",
    "chandra-station-app",
    "manifest-app",
    "skip-go-fast-solver-ui",
    "quicksilver",
     "caddy-blockchain-health",
    "LFP"
  ],
  customData: {
    "gravity-info-api": {
      description: "An API server that computes and provides in-depth info about bridge operations. Including a block indexer, transaction indexer, and a REST API.",
      tags: ["Rust", "Blockchain", "Cosmos"],
      demoUrl: "https://info.gravitychain.io",
      category: ["backend"]
    },
    "manifest-app": {
      tags: ["Typescript", "POA", "Groups"],
      demoUrl: "https://wallet.liftedinit.tech",
      description: "An application to interact with the manifest blockchain. Features support for POA administration, group creation, and token factory.",
      category: ["frontend"]
    },
    "manifestjs": {
      tags: ["Typescript", "Telescope"],
      category: ["frontend"]
    },
    "ai-app-template": {
      description: "A fullstack AI chat app built with Next.js and Python using Flask to serve the LLM. Deployed to Akash for cheap GPU compute.",
      tags: ["Python", "AI", "Akash"],
      demoUrl: "https://chat.jchalabi.xyz",
      category: ["AI"]
    },
    "skip-go-fast-solver-ui": {
      description: "A UI to view the metrics for Chandra Station's Skip Go Fast Solver deployment. Built with Vite and express it features a fullstack dashboard for monitoring the solver's performance and profitability.",
      tags: ["Vite", "Express"],
      demoUrl: "https://solver.chandrastation.com",
      category: ["frontend", "backend"]
    },
    "bg-remover": {
      description: "A tool to efficiently remove the background from images. Built with Next.js and Python and deployed to Akash for cheap GPU compute.",
      tags: ["Python", "AI", "Akash"],
      category: ["AI"],
      demoUrl: "https://rmbg.jchalabi.xyz/"
    },
    "manifest-ledger": {
      description: "A cosmos-sdk chain. Features support for Proof of Authority, groups, token factory, and CosmWasm.",
      tags: ["Go", "Cosmos", "CosmWasm"],
      category: ["backend"]
    },
    "neons-refund": {
      description: "A set of contracts and a that allowed Neons Dao users to send back NFT's in exchange for their locked up $NOTE.",
      tags: ["Solidity", "Canto"],
      category: ["backend"]
    },
    "peer-visualizer": {
      description: "A tool to visualize the peer-to-peer network of a given blockchain.",
      tags: ["Typescript", "Cosmos"],
      demoUrl: "https://visualizer.chandrastation.com",
      category: ["frontend", "backend"]
    },
    "quicksilver": {
      description: "The quicksilver liquid staking web app. Features a dashboard for staking various cosmos tokens with the quicksilver blockchain.",
      tags: ["Typescript", "Cosmos"],
      category: ["frontend"],
      demoUrl: "https://app.quicksilver.zone"
    },
    "ccr-ui": {
      description: "A UI for canto commons registry creation and queries",
      tags: ["Typescript", "EVM", "WAGMI"],
      category: ["frontend"],
      demoUrl: "https://chalabi2.github.io/ccr-ui/"
    },
    "chandra-station-app": {
      description: "Chandra Station's webapp and internal infrastructure to support public and private RPC nodes for both Cosmos and EVM chains.",
      tags: ["Typescript", "Next.js", "Cosmos", "EVM", "Redis", "Postgres", "Caddy"],
      category: ["frontend", "backend"],
      demoUrl: "https://chandra-app.vercel.app/"
    },
    "LFP": {
      description: "Scraper built to find all peers on cosmos L1 chains.",
      tags: ["Rust", "Cosmos"],
      category: ["backend"]
    },
    "caddy-stateful-jwt-auth": {
      description: "A fork of the caddy-jwt-auth module that allows for stateful JWT authentication via redis.",
      tags: ["Go", "Caddy"],
      category: ["backend"]
    },

  }
};

// Define private projects that aren't available on GitHub
export const privateProjects: Project[] = [
  {
    id: "Chandra Station App",
    title: "chandra-station-app",
    description: "Chandra Station's webapp and internal infrastructure to support public and private RPC nodes for both Cosmos and EVM chains.",
    repoUrl: "#", // Placeholder URL
    tags: ["Typescript", "Next.js", "Cosmos", "EVM", "Redis", "Postgres", "Caddy"],
    date: new Date().toISOString(),
    featured: true,
    owner: "chalabi2",
    language: "Typescript",
    stars: 0,
    category: ["frontend", "backend"],
    demoUrl: "https://www.chandrastation.com/",
    isPrivate: true
  },
  {
    id: "althea-link-frontend",
    title: "althea-link-frontend",
    description: "Althea link is the webapp for the Althea L1. Cosmos and Evm signing allowing users to interact with the iFi dex, bridge, governance, staking and more.",
    repoUrl: "#", // Placeholder URL
    tags: ["Viem", "Typescript", "Cosmos", "Evm"],
    date: new Date().toISOString(),
    featured: true,
    owner: "chalabi2",
    language: "Typescript",
    stars: 0,
    category: ["frontend"],
    demoUrl: "https://althea.link",
    isPrivate: true
  },
  {
    id: "althea-link-backend",
    title: "althea-link-backend",
    description: "Althea link backend powers the frontend providing a REST API that contains the data for the frontend to display. It also enables gasless Ambient dex transactions.",
    repoUrl: "#", // Placeholder URL
    tags: ["Rust", "Cosmos", "Redis"],
    date: new Date().toISOString(),
    featured: true,
    owner: "chalabi2",
    language: "Rust",
    stars: 0,
    category: ["backend"],
    isPrivate: true
  },
  {
    id: "playmos",
    title: "playmos",
    description: "A set of solidity contracts and a frontend for a play-to-earn game on the base chain.",
    repoUrl: "#", // Placeholder URL
    tags: ["Solidity", "EVM", "Thirdweb"],
    date: new Date().toISOString(),
    featured: false,
    owner: "chalabi2",
    language: "Solidity",
    stars: 0,
    category: ["backend", "frontend"],
    isPrivate: true
  }
];

export async function fetchGitHubProjects(): Promise<Project[]> {
  const users = ["chalabi2", "chandrastation"];
  let allProjects: Project[] = [];

  for (const username of users) {
    try {
      const { data: repos } = await octokit.repos.listForUser({
        username,
        sort: "updated",
        per_page: 100,
      });

      const filteredRepos = repos
        .filter(repo => projectConfig.allowList.includes(repo.name))
        .map(repo => {
          const customData = projectConfig.customData[repo.name] || {};
          
          return {
            id: repo.id.toString(),
            title: repo.name,
            description: customData.description || repo.description || "",
            repoUrl: repo.html_url,
            demoUrl: customData.demoUrl,
            tags: customData.tags || [repo.language].filter(Boolean) as string[],
            date: repo.created_at || new Date().toISOString(),
            featured: projectConfig.featured.includes(repo.name),
            owner: repo.owner?.login || username,
            language: repo.language || "Unknown",
            stars: repo.stargazers_count || 0,
            category: customData.category || ["frontend"],
            isPrivate: false
          };
        });

      allProjects = [...allProjects, ...filteredRepos];
    } catch (error) {
      console.error(`Error fetching repos for ${username}:`, error);
    }
  }

  // Add private projects to the list
  allProjects = [...allProjects, ...privateProjects];

  return allProjects.sort((a, b) => 
    b.featured === a.featured ? new Date(b.date).getTime() - new Date(a.date).getTime() : b.featured ? 1 : -1
  );
} 