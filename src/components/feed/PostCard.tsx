import React, { useState } from 'react';
import { Post } from '../../types';
import { useCaptcha } from '../../context/CaptchaContext';
import { usePopup } from '../../context/PopupContext';
import { sounds } from '../../utils/sound';
import { ConfirmationChainModal } from '../common/ConfirmationChainModal';
import {
  ThumbsUp,
  MessageSquare,
  Repeat,
  Send,
  MoreHorizontal,
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  onLikeUpdate: (postId: string, liked: boolean, newCount: number) => void;
  onAddComment: (postId: string, text: string) => void;
}

type ButtonKey = 'like' | 'comment' | 'repost' | 'send';

const DEFAULT_BUTTON_ORDER: ButtonKey[] = ['like', 'comment', 'repost', 'send'];

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onLikeUpdate,
  onAddComment,
}) => {
  const { requireCaptcha } = useCaptcha();
  const { triggerPopup, showToast } = usePopup();

  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [likeOffset, setLikeOffset] = useState({ x: 0, y: 0 });

  // Self-Rearranging Action Buttons States
  const [buttonOrder, setButtonOrder] = useState<ButtonKey[]>(DEFAULT_BUTTON_ORDER);
  const [rearrangeAttempts, setRearrangeAttempts] = useState(0);

  // Confirmation Chain Modal State
  const [isConfirmChainOpen, setIsConfirmChainOpen] = useState(false);
  const [confirmActionName, setConfirmActionName] = useState('Like');

  // Rearrange handler: shuffles until 6-7 attempts, then permanently freezes in normal order!
  const triggerButtonRearrange = () => {
    if (rearrangeAttempts < 7) {
      const nextAttempt = rearrangeAttempts + 1;
      setRearrangeAttempts(nextAttempt);

      if (nextAttempt >= 7) {
        // Stop moving! Permanently return to intuitive order!
        setButtonOrder(DEFAULT_BUTTON_ORDER);
        showToast('✓ Button alignment stabilized.', 'info');
      } else {
        // Randomly shuffle array
        sounds.playBoing();
        const shuffled = [...DEFAULT_BUTTON_ORDER].sort(() => Math.random() - 0.5);
        setButtonOrder(shuffled);
      }
    }
  };

  // Hover dodges slightly for like button
  const handleLikeHover = () => {
    if (rearrangeAttempts < 7) {
      setLikeOffset({
        x: (Math.random() - 0.5) * 25,
        y: (Math.random() - 0.5) * 15,
      });
    } else {
      setLikeOffset({ x: 0, y: 0 });
    }
  };

  // Click LIKE: Shuffles buttons, and either triggers Confirmation Chain or CAPTCHA session!
  const handleLikeClick = () => {
    triggerButtonRearrange();

    // Alternate between Confirmation Chain and CAPTCHA
    if (Math.random() > 0.45) {
      sounds.playDing();
      setConfirmActionName('Like this post');
      setIsConfirmChainOpen(true);
    } else {
      sounds.playDing();
      requireCaptcha(`Like Post by ${post.author.name}`, () => {
        const nextLiked = !post.userLiked;
        const nextCount = post.likes + (nextLiked ? 1 : -1);
        onLikeUpdate(post.id, nextLiked, nextCount);
        showToast(nextLiked ? '👍 Endorsement certified after biometric clearance.' : '💔 Like revoked.', 'info');
      });
    }
  };

  // Click COMMENT: Shuffles buttons and toggles or prompts CAPTCHA
  const handleToggleComments = () => {
    triggerButtonRearrange();
    sounds.playKeypress();
    if (!showComments) {
      requireCaptcha(`Unlock Comments for Post #${post.id}`, () => {
        setShowComments(true);
      });
    } else {
      setShowComments(false);
    }
  };

  // Submit COMMENT
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    sounds.playDing();
    requireCaptcha(`Submit Comment: "${commentInput.slice(0, 10)}..."`, () => {
      onAddComment(post.id, commentInput);
      setCommentInput('');
      showToast('💬 Your thought leadership comment was published!', 'info');
    });
  };

  // Repost: Shuffles buttons, then confirmation popup
  const handleRepost = () => {
    triggerButtonRearrange();
    sounds.playBoing();
    triggerPopup({
      title: 'REPOST CONFIRMATION #1',
      subtitle: 'DID YOU READ THIS POST CAREFULLY?',
      body: 'Reposting without thorough comprehension may alert the Society of Thought Leaders. Continue?',
      type: 'confirm',
      closeType: 'moving-btn',
    });
  };

  // Send action
  const handleSend = () => {
    triggerButtonRearrange();
    sounds.playDing();
    showToast('📤 Link copied to non-existent clipboard.', 'info');
  };

  // Render individual action buttons based on their key
  const renderActionButton = (key: ButtonKey) => {
    switch (key) {
      case 'like':
        return (
          <button
            key="like"
            type="button"
            className={`post-action-btn like-btn ${post.userLiked ? 'btn-active-liked' : ''}`}
            style={{
              transform: `translate(${likeOffset.x}px, ${likeOffset.y}px)`,
              transition: 'transform 0.1s ease',
            }}
            onMouseEnter={handleLikeHover}
            onClick={handleLikeClick}
            title="Like"
          >
            <ThumbsUp size={16} />
            <span>{post.userLiked ? 'LIKED' : 'LIKE'}</span>
          </button>
        );

      case 'comment':
        return (
          <button
            key="comment"
            type="button"
            className="post-action-btn"
            onClick={handleToggleComments}
            title="Comment"
          >
            <MessageSquare size={16} />
            <span>COMMENT</span>
          </button>
        );

      case 'repost':
        return (
          <button
            key="repost"
            type="button"
            className="post-action-btn"
            onClick={handleRepost}
            title="Repost"
          >
            <Repeat size={16} />
            <span>REPOST</span>
          </button>
        );

      case 'send':
        return (
          <button
            key="send"
            type="button"
            className="post-action-btn"
            onClick={handleSend}
            title="Send"
          >
            <Send size={16} />
            <span>SEND</span>
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <article className="feed-post-card">
      {/* Post Author Header */}
      <div className="post-header-row">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="post-author-avatar"
        />
        <div className="post-author-meta">
          <div className="author-name-line">
            <span className="author-name">{post.author.name}</span>
            <span className="author-badge">{post.author.badge}</span>
            <span className="dot">• 1st</span>
          </div>
          <p className="author-headline">{post.author.headline}</p>
          <span className="post-timestamp">{post.timeAgo} • 🌐 Parody</span>
        </div>
        <button
          type="button"
          className="post-more-options-btn"
          onClick={() => {
            sounds.playBoing();
            triggerPopup({
              title: 'POST OPTIONS REDACTED',
              subtitle: 'PRIVACY SHIELD ENGAGED',
              body: 'You are not authorized to look at more options.',
              type: 'existential',
              closeType: 'tiny-x',
            });
          }}
        >
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Post Content */}
      <div className="post-content-area">
        <p className="post-text-body">{post.content}</p>
        {post.tagline && <blockquote className="post-tagline">“{post.tagline}”</blockquote>}
        {post.image && (
          <div className="post-attached-media">
            <img src={post.image} alt="Post media" />
          </div>
        )}
      </div>

      {/* Social Metrics Bar */}
      <div className="post-metrics-bar">
        <div className="metrics-left">
          <span className="reaction-emojis-cluster">👍🤡🔥</span>
          <span className="metric-text">{post.likes} reactions</span>
        </div>
        <div className="metrics-right">
          <span>{post.commentsCount} comments</span>
          <span>•</span>
          <span>{post.repostsCount} reposts</span>
        </div>
      </div>

      {/* Action Buttons Bar — SELF REARRANGING ORDER */}
      <div className="post-actions-toolbar">
        {buttonOrder.map(key => renderActionButton(key))}
      </div>

      {/* Stabilized Note when 7 attempts reached */}
      {rearrangeAttempts >= 7 && (
        <div className="stabilized-note-row">
          <small className="font-pixel text-neon-green">
            ✓ BUTTON TRAJECTORY STABILIZED (7/7 INTERACTIONS REACHED)
          </small>
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="post-comments-container">
          <form onSubmit={handleSubmitComment} className="comment-input-form">
            <input
              type="text"
              value={commentInput}
              onChange={e => setCommentInput(e.target.value)}
              placeholder="Add your disruptive commentary..."
              className="comment-text-input"
            />
            <button type="submit" className="comment-submit-btn">
              POST
            </button>
          </form>

          <div className="comments-stream">
            {post.comments.map(c => (
              <div key={c.id} className="single-comment-item">
                <div className="comment-author-line">
                  <b>{c.author}</b>
                  <small>{c.timeAgo}</small>
                </div>
                <p className="comment-text">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ridiculous Confirmation Chain Modal */}
      <ConfirmationChainModal
        isOpen={isConfirmChainOpen}
        actionName={confirmActionName}
        onClose={() => setIsConfirmChainOpen(false)}
      />
    </article>
  );
};
