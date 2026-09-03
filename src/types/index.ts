export interface UserExperienceItem {
  title: string;
  company: string;
  period: string;
  desc: string;
}

export interface User {
  id: string;
  name: string;
  originalName?: string;
  headline: string;
  avatar: string;
  about?: string;
  location?: string;
  skills?: string[];
  education?: string;
  experience?: UserExperienceItem[];
  connectionsCount: number;
  profileViews: number;
  suspicionScore: number;
  isLoggedIn: boolean;
}

export interface Post {
  id: string;
  author: {
    name: string;
    headline: string;
    avatar: string;
    badge: string;
  };
  timeAgo: string;
  content: string;
  likes: number;
  commentsCount: number;
  repostsCount: number;
  userLiked: boolean;
  userReposted: boolean;
  comments: Comment[];
  image?: string;
  tagline?: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  timeAgo: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  postedAgo: string;
  applicants: number;
  description: string;
  requirements: string[];
  applied: boolean;
}

export interface Connection {
  id: string;
  name: string;
  headline: string;
  avatar: string;
  mutualConnections: number;
  status: 'none' | 'pending' | 'connected' | 'emotionally_pending';
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timeAgo: string;
  read: boolean;
  type: 'urgent' | 'useless' | 'alarming' | 'scam';
}

export interface CaptchaQuestion {
  id: string;
  question: string;
  topic: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

export interface CaptchaImageCard {
  id: number;
  label: string;
  isVehicle: boolean;
  svgIcon: string;
  description: string;
}

export interface PopupAd {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  primaryAction: string;
  secondaryAction?: string;
  styleVariant: 'pink-green' | 'yellow-purple' | 'black-neon' | 'red-cyan';
  closePosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center' | 'moving';
}

export interface RegisteredAccount {
  username: string;
  password: string; // Plaintext original for demo checking
  secretDrawing: {
    strokes: { x: number; y: number }[][];
    timestamp: number;
  };
  fullName?: string;
  jobTitle?: string;
  employabilityScore?: number;
  createdAt: number;
}

