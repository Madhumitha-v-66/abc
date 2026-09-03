import React, { useState } from 'react';
import { Post } from '../../types';
import { PostCard } from './PostCard';
import { useAuth } from '../../context/AuthContext';
import { useCaptcha } from '../../context/CaptchaContext';
import { usePopup } from '../../context/PopupContext';
import { sounds } from '../../utils/sound';
import { Sparkles, Image, Video, Calendar, Send, ShieldCheck } from 'lucide-react';

const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    author: {
      name: 'Dr. Archibald V. Turing III',
      headline: 'Distinguished Professor of Ambiguous Locomotive Classification @ MIT',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      badge: 'TOP VOICE (VERIFIED)',
    },
    timeAgo: '12m',
    content: '🚀 I am EXTREMELY thrilled and humbled to announce that after 4 years of intense PhD research and 1,842 failed attempts, I have successfully achieved my Level 5 Certified Ambiguous Vehicle Identification Accreditation! 🎉\n\nIdentifying whether an office chair with wheels is legally a locomotive was the most grueling intellectual hurdle of my career. Never stop hustling! #Blessed #Synergy #CAPTCHAWarrior',
    tagline: 'Fail 7 times, identify a toaster with wheels on the 8th.',
    likes: 412,
    commentsCount: 38,
    repostsCount: 19,
    userLiked: false,
    userReposted: false,
    comments: [
      { id: 'c1', author: 'Elon Tusk', text: 'Huge if true. We are replacing Tesla autopilot with this CAPTCHA algorithm.', timeAgo: '8m' },
      { id: 'c2', author: 'Karen Synergy', text: 'Inspiring. Could you connect? I have an exciting 100% commission opportunity.', timeAgo: '2m' }
    ]
  },
  {
    id: 'post-2',
    author: {
      name: 'Samantha Bytecode',
      headline: 'Founder @ 73Bananas.io | Ex-Google, Ex-Meta, Ex-Human',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      badge: 'THOUGHT LEADER',
    },
    timeAgo: '45m',
    content: 'What 10 hours of entering backwards Atbash passwords taught me about B2B SaaS Sales:\n\n1. When your users type "A", give them "Z". It builds grit.\n2. When your keyboard rearranges itself mid-word, adapt. That is agile pivot mindset.\n3. Every time someone asks for a demo, demand they solve Coffman’s 4 deadlock conditions.\n\nAgree? Thoughts in the comments! 👇',
    tagline: 'Disruption is when the keyboard runs away from your cursor.',
    likes: 884,
    commentsCount: 92,
    repostsCount: 144,
    userLiked: false,
    userReposted: false,
    comments: [
      { id: 'c3', author: 'Chad Bro-grammer', text: 'Agree 100%! I also inverted my sleep schedule to Dvorak.', timeAgo: '30m' }
    ]
  },
  {
    id: 'post-3',
    author: {
      name: 'Gaurav "The Popup Closer" Patel',
      headline: 'Chief Resignation Officer @ Unsubscribe Corp',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      badge: 'SURVIVOR',
    },
    timeAgo: '2h',
    content: 'Proud to announce that after 17 continuous hours, I finally found the 4-pixel transparent close button on the ₹4,72,819 lottery popup! My mouse hand is in a cast, but my professional index has never been higher. Never give up on your dreams.',
    tagline: 'The close button was hidden inside the punctuation mark.',
    likes: 1205,
    commentsCount: 64,
    repostsCount: 88,
    userLiked: false,
    userReposted: false,
    comments: []
  }
];

export const FeedView: React.FC = () => {
  const { user, suspicionScore } = useAuth();
  const { requireCaptcha } = useCaptcha();
  const { triggerPopup, showToast } = usePopup();

  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [postDraft, setPostDraft] = useState('');
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const handleLikeUpdate = (id: string, liked: boolean, newCount: number) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, userLiked: liked, likes: newCount } : p
      )
    );
  };

  const handleAddComment = (id: string, commentText: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newComment = {
            id: 'comment-' + Date.now(),
            author: user ? user.name : 'ANONYMOUS VERIFIED HUMAN',
            text: commentText,
            timeAgo: 'Just now',
          };
          return {
            ...p,
            comments: [newComment, ...p.comments],
            commentsCount: p.commentsCount + 1,
          };
        }
        return p;
      })
    );
  };

  const handleStartPostClick = () => {
    sounds.playDing();
    requireCaptcha('Publishing Privilege Assessment', () => {
      setIsCreatingPost(true);
    });
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postDraft.trim()) return;

    sounds.playDing();
    // SECOND CAPTCHA ON POST SUBMIT!
    requireCaptcha(`Publish Post: "${postDraft.slice(0, 15)}..."`, () => {
      const newPost: Post = {
        id: 'post-' + Date.now(),
        author: {
          name: user ? user.name : 'VERIFIED PARODY CITIZEN',
          headline: user ? user.headline : 'Professional CAPTCHA Solver',
          avatar: user ? user.avatar : 'https://api.dicebear.com/7.x/bottts/svg?seed=newpost',
          badge: 'NEW THOUGHT LEADER',
        },
        timeAgo: 'Just now',
        content: postDraft,
        tagline: 'Authored with backwards keyboard dexterity.',
        likes: 1,
        commentsCount: 0,
        repostsCount: 0,
        userLiked: true,
        userReposted: false,
        comments: [],
      };

      setPosts([newPost, ...posts]);
      setPostDraft('');
      setIsCreatingPost(false);
      showToast('🎉 Your post was published to our 0 real users!', 'info');
    });
  };

  return (
    <div className="feed-grid-layout">
      {/* Left Column: User Micro Profile Card */}
      <aside className="feed-sidebar-left">
        <div className="user-micro-summary-card">
          <div className="summary-banner-color" />
          <div className="summary-avatar-holder">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
              alt="Avatar"
              className="summary-cursed-avatar"
            />
          </div>
          <div className="summary-name-box">
            <h3 className="summary-name">{user?.name || 'ZIHSRBZ'}</h3>
            <p className="summary-headline">{user?.headline || 'Junior CAPTCHA Over-thinker'}</p>
          </div>

          <div className="summary-stats-list">
            <div className="summary-stat-row">
              <span className="stat-key">Profile Views:</span>
              <span className="stat-val font-pixel">{user?.profileViews || 9999}</span>
            </div>
            <div className="summary-stat-row">
              <span className="stat-key">Connections:</span>
              <span className="stat-val">{user?.connectionsCount || 2}</span>
            </div>
            <div className="summary-stat-row">
              <span className="stat-key">Suspicion Index:</span>
              <span className="stat-val text-neon-pink font-bold">{suspicionScore}%</span>
            </div>
          </div>

          <div className="summary-card-footer">
            <button
              className="cursed-micro-btn"
              onClick={() => {
                sounds.playBoing();
                triggerPopup({
                  title: 'TRYING TO ENHANCE YOUR CAREER?',
                  subtitle: 'UNLOCKED FOR ONLY ₹99,999/SEC',
                  body: 'See who looked at your silhouette while you slept.',
                  type: 'discount',
                  closeType: 'moving-btn',
                });
              }}
            >
              ⭐ TRY PREMIUM FOR ₹0.00* (*plus tax)
            </button>
          </div>
        </div>

        {/* Cursed Security Metric Box */}
        <div className="cursed-side-widget">
          <div className="widget-header">
            <ShieldCheck size={16} />
            <span>PRIVACY HEALTH CHECK</span>
          </div>
          <p className="widget-text">
            “Your account is currently protected by 4 overlapping popups and 2 inverted keyboards.”
          </p>
          <div className="widget-warning-flag">
            STATUS: 100% BEWILDERING
          </div>
        </div>
      </aside>

      {/* Center Column: Feed Items */}
      <main className="feed-center-stream">
        {/* Post Creation Prompt Box */}
        <div className="create-post-box">
          <div className="create-post-top-row">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
              alt="Avatar"
              className="create-post-user-pic"
            />
            <button
              className="create-post-trigger-btn"
              onClick={handleStartPostClick}
            >
              Start a post, boast about solving a CAPTCHA, or share sadness...
            </button>
          </div>

          <div className="create-post-actions-row">
            <button className="post-media-btn" onClick={handleStartPostClick}>
              <Image size={18} color="#00ffcc" />
              <span>Fake Photo</span>
            </button>
            <button className="post-media-btn" onClick={handleStartPostClick}>
              <Video size={18} color="#ff00bb" />
              <span>Video (Buffered)</span>
            </button>
            <button className="post-media-btn" onClick={handleStartPostClick}>
              <Calendar size={18} color="#ffea00" />
              <span>Event (Cancelled)</span>
            </button>
            <button className="post-media-btn" onClick={handleStartPostClick}>
              <Sparkles size={18} color="#ff5500" />
              <span>Write Synergy</span>
            </button>
          </div>
        </div>

        {/* Modal when drafting a post */}
        {isCreatingPost && (
          <div className="post-composer-modal">
            <div className="composer-card">
              <div className="composer-header">
                <h3>CREATE THOUGHT LEADERSHIP POST</h3>
                <button
                  className="composer-close-btn"
                  onClick={() => setIsCreatingPost(false)}
                >
                  ✖
                </button>
              </div>

              <textarea
                value={postDraft}
                onChange={e => setPostDraft(e.target.value)}
                placeholder="Share your breakthrough in distinguishing a baguette from a scooter..."
                className="composer-textarea"
                rows={5}
              />

              <div className="composer-disclaimer">
                ⚠️ Posting requires passing a university-level computer science verification exam.
              </div>

              <div className="composer-actions">
                <button
                  className="composer-cancel-btn"
                  onClick={() => setIsCreatingPost(false)}
                >
                  Discard Brilliance
                </button>
                <button
                  className="composer-publish-btn"
                  onClick={handlePublishPost}
                >
                  <Send size={14} /> PUBLISH TO SUPERGLUEDIN
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts Stream */}
        <div className="posts-stream-list">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onLikeUpdate={handleLikeUpdate}
              onAddComment={handleAddComment}
            />
          ))}
        </div>
      </main>

      {/* Right Column: Trending Paranoia & Ads */}
      <aside className="feed-sidebar-right">
        <div className="trending-widget-card">
          <div className="trending-title-bar">
            <span>🔥 TRENDING IN BAD UX</span>
          </div>
          <ul className="trending-list">
            <li className="trend-item" onClick={() => sounds.playDing()}>
              <div className="trend-tag">#1 · Software Engineering</div>
              <div className="trend-headline">Why backspace was a UX mistake</div>
              <small className="trend-stat">14,219 confused people</small>
            </li>
            <li className="trend-item" onClick={() => sounds.playDing()}>
              <div className="trend-tag">#2 · Cryptography</div>
              <div className="trend-headline">Atbash cipher adopted as ISO standard</div>
              <small className="trend-stat">8,102 inverted usernames</small>
            </li>
            <li className="trend-item" onClick={() => sounds.playDing()}>
              <div className="trend-tag">#3 · Hardware</div>
              <div className="trend-headline">Computers report 73% national sadness</div>
              <small className="trend-stat">2,419 crying fans</small>
            </li>
            <li className="trend-item" onClick={() => sounds.playDing()}>
              <div className="trend-tag">#4 · Career Advice</div>
              <div className="trend-headline">Is a shopping cart a vehicle on your resume?</div>
              <small className="trend-stat">999 unresolved debates</small>
            </li>
          </ul>
        </div>

        {/* Sponsored Cursed Box */}
        <div className="sidebar-ad-card">
          <div className="ad-micro-label">ADVERTISEMENT • WHY NOT?</div>
          <div className="ad-headline">BECOME A CERTIFIED POPUP CLOSER</div>
          <p className="ad-body-text">
            Our 6-month bootcamp teaches you how to locate 2-pixel "x" icons hidden inside exclamation points!
          </p>
          <button
            className="ad-cta-btn"
            onClick={() => {
              sounds.playDing();
              triggerPopup({
                title: 'BOOTCAMP ENROLLMENT LOCKED',
                subtitle: 'PREREQUISITE: 4,000 POPUPS CLOSED',
                body: 'You must close at least 3,999 more popups before you qualify for this syllabus.',
                type: 'scam',
                closeType: 'double-negative',
              });
            }}
          >
            ENROLL FOR ₹1,82,000
          </button>
        </div>
      </aside>
    </div>
  );
};
