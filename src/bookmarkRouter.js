/* eslint-disable eqeqeq */
const express = require('express');
const bookmarks = require('./bookmarkData');
const logger = require('./logger');
const uuid = require('uuid/v4');

const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter
  .route('/')
  .get((req, res) => {
    res.json(bookmarks);
  })

  .post(bodyParser, (req,res) => {
    const { title, desc, url, rating } = req.body;

    if(!title) {
      logger.error('Title is required');
      return res
        .status(400)
        .send('Title required');
    }
    if(!desc) {
      logger.error('Description is required');
      return res
        .status(400)
        .send('Description required');
    }
    if(!url) {
      logger.error('Bookmark Url is required');
      return res 
        .status(400)
        .send('Bookmark URL required');
    }
    if(!rating) {
      logger.error('Rating is required');
      return res
        .status(400)
        .send('Rating required');
    }

    const ratings = [
      1, 2, 3, 4, 5
    ];

    if(!ratings.includes(rating)) {
      logger.error('A valid rating is required');
      return res
        .status(400)
        .send('Not a valid rating');
    }

    const id = uuid();
    const newBookmark = {
      id,
      title,
      desc,
      url,
      rating
    };
    bookmarks.push(newBookmark);
    logger.info(`Bookmark with id ${id} created`);
    res 
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(newBookmark);

    res.send('All validation passed');
  });

bookmarkRouter
  .route('/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(bm => bm.id == id);

    if(!bookmark) {
      logger.error('Bookmark not found.');

      return res
        .status(404)
        .send('List Not Found');
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(bm => bm.id == id);

    if (bookmarkIndex === -1) {
      logger.error('Bookmark not found');
      return res
        .status(404)
        .send('Not Found');
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info('Bookmark deleted.');
    res
      .status(204)
      .end();
  });

module.exports = bookmarkRouter;