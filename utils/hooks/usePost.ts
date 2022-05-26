import { useMutation, useLazyQuery } from '@apollo/client'
import { ADD_POST, ADD_SUBREDDIT } from '../../graphql/mutations'
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from '../../graphql/queries'

type Post = {
  body: string
  image: string
  subreddit_id: string
  title: string
  username: string
}

export const usePost = () => {
  const [addPost] = useMutation(ADD_POST, {
    refetchQueries: [GET_ALL_POSTS, 'getPostList'],
  })
  const [addSubreddit] = useMutation(ADD_SUBREDDIT)
  const [getSubredditListByTopic] = useLazyQuery(GET_SUBREDDIT_BY_TOPIC, {
    fetchPolicy: 'no-cache',
  })

  let actions: any = {}

  actions.getSubredditListByTopic = async (topic: string) => {
    const { data } = await getSubredditListByTopic({
      variables: { topic },
    }).catch((err) => {
      console.debug(err)
      return { data: { getSubredditListByTopic: [] } }
    })
    return data.getSubredditListByTopic
  }

  actions.addSubreddit = async (topic: string) => {
    const {
      data: { insertSubreddit: newSubreddit },
    } = await addSubreddit({
      variables: {
        topic,
      },
    }).catch((err) => {
      console.debug('add subreddit err:', err)
      return { data: {} }
    })
    return newSubreddit
  }

  actions.addPost = async (post: Post) => {
    const {
      data: { insertPost: newPost },
    } = await addPost({
      variables: {
        body: post.body,
        image: post.image,
        subreddit_id: post.subreddit_id,
        title: post.title,
        username: post.username,
      },
    }).catch((err) => {
      console.debug('insert post err: ', err)
      return { data: {} }
    })
    return newPost
  }

  return { ...actions }
}
