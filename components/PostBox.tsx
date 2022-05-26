import { LinkIcon, PhotographIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import React from 'react'
import Avatar from './Avatar'
import { usePost } from '../utils/hooks/usePost'
import { isEmpty } from 'lodash'
import toast from 'react-hot-toast'

type FormData = {
  postTitle: string
  postBody: string
  postImage: string
  subreddit: string
}

type Props = {
  subreddit?: string
}

export default function PostBox({ subreddit }: Props) {
  const { data: session } = useSession()
  const [imageBoxOpen, setImageBoxOpen] = React.useState(false)
  const { addPost, addSubreddit, getSubredditListByTopic } = usePost()

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (formData: FormData) => {
    const notification = toast.loading('Creating new post ...')
    const subredditList = await getSubredditListByTopic(
      subreddit || formData.subreddit
    )
    const image = formData.postImage || ''
    const postToAdd = {
      body: formData.postBody,
      image,
      subreddit_id: '',
      title: formData.postTitle,
      username: session?.user?.name || '',
    }
    if (isEmpty(subredditList)) {
      console.debug('add new subreddit')
      const newSubreddit = await addSubreddit(formData.subreddit)
      postToAdd.subreddit_id = newSubreddit.id
    } else {
      console.debug('use old subreddit')
      postToAdd.subreddit_id = subredditList[0].id
    }
    const newPost = await addPost(postToAdd)
    toast.success('New post created', {
      id: notification,
    })
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="sticky top-16 z-50 rounded-md border border-gray-300 bg-white p-2"
    >
      <div className=" flex items-center space-x-3">
        <Avatar large />
        <input
          {...register('postTitle', { required: 'Title is required' })}
          disabled={!session}
          type="text"
          placeholder={
            session
              ? subreddit
                ? `Create a post in r/${subreddit}`
                : 'Create a post by entering a title'
              : 'Sign in to post'
          }
          className=" flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none"
        />
        <PhotographIcon
          className={`h-6 cursor-pointer text-gray-300 ${
            imageBoxOpen ? 'text-blue-300' : ''
          }`}
          onClick={() => setImageBoxOpen(!imageBoxOpen)}
        />
        <LinkIcon className="h-6 cursor-pointer text-gray-300" />
      </div>
      {!!watch('postTitle') ? (
        <div className="flex flex-col py-2">
          <div className="flex items-center px-2">
            <p className=" min-w-[90px]">Body:</p>
            <input
              {...register('postBody')}
              className=" m-2 flex-1 bg-blue-50 p-2 outline-none"
              type="text"
              placeholder="Text (Optional)"
            />
          </div>

          {subreddit ? null : (
            <div className="flex items-center px-2">
              <p className=" min-w-[90px]">Subreddit:</p>
              <input
                {...register('subreddit', {
                  required: 'A subreddit is required',
                })}
                className=" m-2 flex-1 bg-blue-50 p-2 outline-none"
                type="text"
                placeholder="i.e. reactjs"
              />
            </div>
          )}

          {imageBoxOpen ? (
            <div className="flex items-center px-2">
              <p className=" min-w-[90px]">Image URL:</p>
              <input
                {...register('postImage')}
                className=" m-2 flex-1 bg-blue-50 p-2 outline-none"
                type="text"
                placeholder="Optional..."
              />
            </div>
          ) : null}
          {Object.keys(errors).length > 0 ? (
            <div>
              <div className=" space-y-2 p-2 text-red-500">
                {errors.postTitle?.type ? (
                  <p>{errors.postTitle?.message}</p>
                ) : null}
                {errors.subreddit?.type ? (
                  <p>{errors.subreddit?.message}</p>
                ) : null}
              </div>
            </div>
          ) : null}

          {!!watch('postTitle') && (
            <button
              type="submit"
              className="w-full rounded-full bg-blue-400 p-2 text-white"
            >
              Create Post
            </button>
          )}
        </div>
      ) : null}
    </form>
  )
}
