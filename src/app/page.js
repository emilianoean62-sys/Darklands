"use server"
import Animecard from '@/components/CardComponent/Animecards'
import Herosection from '@/components/home/Herosection'
import Navbarcomponent from '@/components/navbar/Navbar'
import { 
  TrendingAnilist,
  Top100Anilist, 
  SeasonalAnilist, 
  UpcomingAnilist, 
  CurrentlyAiringAnilist,
  TopRatedAnilist,
  GenreSpecificAnilist,
  RecentlyUpdatedAnilist,
  RandomRecommendationsAnilist
} from '@/lib/Anilistfunctions'
import React from 'react'
import { MotionDiv } from '@/utils/MotionDiv'
import ContinueWatching from '@/components/home/ContinueWatching'
import Greeting from '@/components/Greeting';
import { getAuthSession } from './api/auth/[...nextauth]/route'
import { redis } from '@/lib/rediscache'
import HomeNewsCard from '@/components/home/HomeNewsCard'
import { fetchHomePageNews } from '@/lib/AnilistNewsFunctions'
import UpcomingAnimeSection from '@/components/home/UpcomingAnimeSection'
import CurrentlyAiringSection from '@/components/home/CurrentlyAiringSection'
import TopRatedSection from '@/components/home/TopRatedSection'
import GenreSection from '@/components/home/GenreSection'
import RecentlyUpdatedSection from '@/components/home/RecentlyUpdatedSection'
import RandomRecommendationsSection from '@/components/home/RandomRecommendationsSection'
// import { getWatchHistory } from '@/lib/EpHistoryfunctions'

async function getHomePage() {
  try {
    let cachedData;
    if (redis) {
      cachedData = await redis.get(`homepage`);
      if (!JSON.parse(cachedData)) {
        await redis.del(`homepage`);
        cachedData = null;
      }
    }
    if (cachedData) {
      const { 
        herodata, 
        top100data, 
        seasonaldata, 
        upcomingData, 
        airingData, 
        topRatedData,
        actionAnimeData,
        recentlyUpdatedData,
        randomRecsData
      } = JSON.parse(cachedData);
      return { 
        herodata, 
        top100data, 
        seasonaldata, 
        upcomingData, 
        airingData, 
        topRatedData,
        actionAnimeData,
        recentlyUpdatedData,
        randomRecsData
      };
    } else {
      const [
        herodata, 
        top100data, 
        seasonaldata, 
        upcomingData, 
        airingData, 
        topRatedData,
        actionAnimeData,
        recentlyUpdatedData,
        randomRecsData
      ] = await Promise.all([
        TrendingAnilist(),
        Top100Anilist(),
        SeasonalAnilist(),
        UpcomingAnilist(),
        CurrentlyAiringAnilist(),
        TopRatedAnilist(),
        GenreSpecificAnilist("Action"),
        RecentlyUpdatedAnilist(),
        RandomRecommendationsAnilist()
      ]);
      const cacheTime = 60 * 60 * 2;
      if (redis) {
        await redis.set(`homepage`, JSON.stringify({ 
          herodata, 
          top100data, 
          seasonaldata, 
          upcomingData, 
          airingData, 
          topRatedData,
          actionAnimeData,
          recentlyUpdatedData,
          randomRecsData
        }), "EX", cacheTime);
      }
      return { 
        herodata, 
        top100data, 
        seasonaldata, 
        upcomingData, 
        airingData, 
        topRatedData,
        actionAnimeData,
        recentlyUpdatedData,
        randomRecsData
      };
    }
  } catch (error) {
    console.error("Error fetching homepage from anilist: ", error);
    return null;
  }
}

async function Home() {
  const session = await getAuthSession();
  const { 
    herodata = [], 
    top100data = [], 
    seasonaldata = [], 
    upcomingData = [], 
    airingData = [],
    topRatedData = [],
    actionAnimeData = [],
    recentlyUpdatedData = [],
    randomRecsData = []
  } = await getHomePage();
  const newsData = await fetchHomePageNews(6);
  // const history = await getWatchHistory();
  // console.log(history)

  return (
    <div>
      <Navbarcomponent home={true} />
      <Herosection data={herodata} />
      <div className='sm:max-w-[97%] md:max-w-[95%] lg:max-w-[90%] xl:max-w-[85%] mx-auto flex flex-col md:gap-11 sm:gap-7 gap-5 mt-8'>
        <MotionDiv
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <Greeting session={session} />
        </MotionDiv>
        <MotionDiv
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <ContinueWatching session={session} />
        </MotionDiv>
        <MotionDiv
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <CurrentlyAiringSection animeList={airingData} />
        </MotionDiv>
        <MotionDiv
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <Animecard data={herodata} cardid="Trending Now" />
        </MotionDiv>
        <MotionDiv
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <HomeNewsCard newsItems={newsData?.news} />
        </MotionDiv>
        <MotionDiv
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <TopRatedSection animeList={topRatedData} />
        </MotionDiv>
        <MotionDiv
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <RandomRecommendationsSection animeList={randomRecsData} />
        </MotionDiv>
        <MotionDiv
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <UpcomingAnimeSection animeList={upcomingData} />
        </MotionDiv>
        <MotionDiv
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <GenreSection animeList={actionAnimeData} genre="Action" />
        </MotionDiv>
        <MotionDiv
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <RecentlyUpdatedSection animeList={recentlyUpdatedData} />
        </MotionDiv>
        <MotionDiv
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <Animecard data={seasonaldata} cardid="Seasonal Anime" />
        </MotionDiv>
        <MotionDiv
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
        >
          <Animecard data={top100data} cardid="Top 100 Anime" />
        </MotionDiv>
      </div>
    </div>
  )
}

export default Home
