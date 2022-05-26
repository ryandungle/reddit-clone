import { gql } from '@apollo/client'

export const GET_ALL_POSTS = gql`
  query MyQuery {
    getPostList {
      comments {
        username
        text
        id
        created_at
      }
      body
      title
      username
      created_at
      id
      image
      subreddit_id
      subreddit {
        topic
      }
    }
  }
`
export const GET_POST_BY_POST_ID = gql`
  query MyQuery($post_id: ID!) {
    getPostByPostId(post_id: $post_id) {
      comments {
        username
        created_at
        text
        id
      }
      body
      title
      username
      created_at
      id
      image
      subreddit_id
      subreddit {
        topic
      }
    }
  }
`
export const GET_ALL_POSTS_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getPostListByTopic(topic: $topic) {
      comments {
        username
        text
        id
        created_at
      }
      body
      title
      username
      created_at
      id
      image
      subreddit_id
      subreddit {
        topic
      }
    }
  }
`
//subreddit
export const GET_SUBREDDIT_BY_TOPIC = gql`
  query MyQuery($topic: String!) {
    getSubredditListByTopic(topic: $topic) {
      id
      created_at
      topic
    }
  }
`
export const GET_SUBREDDIT_WITH_LIMIT = gql`
  query MyQuery($limit: Int!) {
    getSubredditListLimit(limit: $limit) {
      id
      created_at
      topic
    }
  }
`

//vote
export const GET_ALL_VOTE_BY_POST_ID = gql`
  query MyQuery($post_id: ID!) {
    getVotesByPostId(post_id: $post_id) {
      created_at
      id
      post_id
      upvote
      username
    }
  }
`
