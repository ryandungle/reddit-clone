import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import PostBox from '../components/PostBox'
import Feed from '../components/Feed'
import SubredditRow from '../components/SubredditRow'
import { useQuery } from '@apollo/client'
import { GET_SUBREDDIT_WITH_LIMIT } from '../graphql/queries'

const Home: NextPage = () => {
  const { data } = useQuery(GET_SUBREDDIT_WITH_LIMIT, {
    variables: {
      limit: 10,
    },
  })
  const subreddits: Subreddit[] = data?.getSubredditListLimit
  return (
    <div className=" mx-auto my-7 max-w-5xl">
      <Head>
        <title>Reddit 2.0 Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PostBox />
      <div className="flex">
        <Feed />
        <div
          className="top36 sticky mx-5 mt-5 hidden h-fit min-w-[300px] rounded-md
        border border-gray-300 bg-white lg:inline
        "
        >
          <p className="mb-1 p-4 pb-3 font-bold">Top Communities</p>
          <div>
            {subreddits?.map((subreddit, i) => (
              <SubredditRow
                key={subreddit.id}
                topic={subreddit.topic}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
