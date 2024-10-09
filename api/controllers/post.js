import { db } from '../db.js';
import { verifyToken } from './auth.js'; // Import the middleware

// Get all posts
export const getPosts = (req, res) => {
  const q = req.query.cat
    ? 'SELECT * FROM posts WHERE cat=?'
    : 'SELECT * FROM posts';

  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.status(500).send(err);

    return res.status(200).json(data);
  });
};

// Get a specific post
export const getPost = (req, res) => {
  const q =
    'SELECT p.id, `username`, `title`, `desc`, p.img, u.img AS userImg, `cat`,`date` FROM users u JOIN posts p ON u.id = p.uid WHERE p.id = ? ';

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);

    return res.status(200).json(data[0]);
  });
};

// Add a new post (protected route)
export const addPost = (req, res) => {
  const q =
    'INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`, `uid`) VALUES (?)';

  const values = [
    req.body.title,
    req.body.desc,
    req.body.img,
    req.body.cat,
    req.body.date,
    req.userInfo.id, // Use the user ID from verified token (set in verifyToken middleware)
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json('Post has been created.');
  });
};

// Delete a post (protected route)
export const deletePost = (req, res) => {
  const postId = req.params.id;
  const q = 'DELETE FROM posts WHERE `id` = ? AND `uid` = ?';

  db.query(q, [postId, req.userInfo.id], (err, data) => {
    if (err) return res.status(403).json('You can delete only your post!');
    return res.json('Post has been deleted!');
  });
};

// Update a post (protected route)
export const updatePost = (req, res) => {
  const postId = req.params.id;
  const q =
    'UPDATE posts SET `title`=?,`desc`=?,`img`=?,`cat`=? WHERE `id` = ? AND `uid` = ?';

  const values = [req.body.title, req.body.desc, req.body.img, req.body.cat];

  db.query(q, [...values, postId, req.userInfo.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json('Post has been updated.');
  });
};
