import model from './model';
import pages from './pages';
import profilePage from './profilePage';
import commentsTemplate from './commentsTemplate.html.hbs';

export default {

  async getNextPhoto() {
    try {
      const { friend, id, url } = await model.getNextPhoto();
      const photoStats = await model.photoStats(id);
      this.setFriendAndPhoto(friend, id, url, photoStats);
    } catch (e) {
      this.getNextPhoto();
    }
    
  },

  setFriendAndPhoto(friend, id, url, stats) {
    const friendPhoto = document.querySelector('.component-photo');
    const friendAvatar = document.querySelector('.component-header-photo');
    const friendName = document.querySelector('.component-header-name');
    const userPhoto = document.querySelector('.component-footer-photo');

    this.friend = friend;
    this.photoID = id;

    friendPhoto.style.backgroundImage = `url(${url})`;
    friendAvatar.style.backgroundImage = `url(${friend.photo_50})`;
    friendName.textContent = `${friend.first_name ?? ''} ${friend.last_name ?? ''}`;
    userPhoto.style.backgroundImage = `url(${model.me.photo_50})`;
    this.setLikes(stats.likes, stats.liked);
    this.setComments(stats.comments);
  },

  async loadComments(photo) {
    const comments = await model.getComments(photo);
    const commentsElements = commentsTemplate({
      list: comments.map((comment) => {
        return {
          name: `${comment.user.first_name ?? ''} ${comment.user.last_name ?? ''}`,
          photo: comment.user.photo_50,
          text: comment.text
        };
      })
    });

    document.querySelector('.component-comments-container-list').innerHTML = '';
    document.querySelector('.component-comments-container-list').append(commentsElements);;
    this.setComments(comments.length);
  },

  setLikes(total, liked) {
    const likesCount = document.querySelector('.component-footer-container-social-likes');

    likesCount.textContent = total;

    if (liked) {
      likesCount.classList.add('liked');
    } else {
      likesCount.classList.remove('liked');
    }
  },

  setComments(total) {
    const commentsCount = document.querySelector('.component-footer-container-social-comments');

    commentsCount.textContent = total;
  },

  handleEvents() {
    const photo = document.querySelector('.component-photo');
    const friendProfileLinkBtn = document.querySelector('.component-header-profile-link');
    const userProfileLinkBtn = document.querySelector('.component-footer-container-profile-link');
    const likesIcon = document.querySelector('.component-footer-container-social-likes');
    const commentsIcon = document.querySelector('.component-footer-container-social-comments');
    const comments = document.querySelector('.component-comments');
    const commentInput = document.querySelector('.component-comments-container-form-input');
    const commentSend = document.querySelector('.component-comments-container-form-send');
    let startFrom;

    photo.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startFrom = e.pageY;
    });

    photo.addEventListener('mouseup', async (e) => {
      if (e.pageY - startFrom < 0) {
        await this.getNextPhoto();
      }
    });

    photo.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startFrom = e.changedTouches[0].pageY;
    });

    photo.addEventListener('touchend', async (e) => {
      if (e.changedTouches[0].pageY - startFrom < 0) {
        await this.getNextPhoto();
      }
    });

    friendProfileLinkBtn.addEventListener('click', async () => {
      await profilePage.setUser(this.friend);
      pages.openPage('profile');
    });

    userProfileLinkBtn.addEventListener('click', async () => {
      await profilePage.setUser(model.me);
      pages.openPage('profile');
    });

    likesIcon.addEventListener('click', async () => {
      const { likes, liked } = await model.like(this.photoID);
      this.setLikes(likes, liked);
    });

    commentsIcon.addEventListener('click', async () => {
      comments.classList.remove('hidden');
      await this.loadComments(this.photoID);
    });

    comments.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        comments.classList.add('hidden');
      }
    });

    commentSend.addEventListener('click', async () => {
      if (commentInput.value.trim().length) {
        await model.postComment(this.photoID, commentInput.value.trim());
        commentInput.value = '';
        await this.loadComments(this.photoID);
      }
    });
    
  },
};
