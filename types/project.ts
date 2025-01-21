export interface Project {
    id: number;
    created_at: string;
    live_demo: string | null;
    githubusername: string | null;
    description: string;
    category: string;
    repo_name: string;
    repo_source: string;
    images: string;
    bookmark_status: boolean;
  }
  
  export interface ProjectImage {
    src: string;
    repo_name: string;
  }