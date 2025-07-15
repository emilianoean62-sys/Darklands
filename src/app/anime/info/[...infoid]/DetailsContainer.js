"use client"
import React,{useState,useEffect} from 'react'
import { getUserLists } from '@/lib/AnilistUser';
import NetflixStyleDetails from '@/components/details/NetflixStyleDetails';
import Characters from '@/components/details/Characters';
import Animecards from '@/components/CardComponent/Animecards'
import DetailsEpisodeList from '@/components/DetailsEpisodeList';

function DetailsContainer({data, id, session}) {
    const [list,setList] = useState(null);
    const [url, setUrl] = useState(null);

    useEffect(() => {
        const fetchlist = async()=>{
            const data =await getUserLists(session?.user?.token, id);
            setList(data);
        }
        fetchlist();
    }, []);

    const progress = list!==null ? list?.status==='COMPLETED' ? 0 : list?.progress : 0

  return (
    <>
      <NetflixStyleDetails data={data} id={id} session={session} list={list} setList={setList} url={url} />
      
      {/* Episodes Section - Netflix Style */}
      <div className="px-4 sm:px-8 md:px-12 py-4 sm:py-6 md:py-8 border-b border-[#333]">
        <h2 className="text-base sm:text-lg md:text-xl font-medium text-white mb-3 sm:mb-4 md:mb-6">Episodes</h2>
        <DetailsEpisodeList data={data} id={id} setUrl={setUrl} progress={progress}/>
      </div>
      
      {/* Characters & Voice Actors - Netflix Style */}
      {data?.characters?.edges?.length > 0 && (
        <div className="px-4 sm:px-8 md:px-12 py-4 sm:py-6 md:py-8 border-b border-[#333]">
          <h2 className="text-base sm:text-lg md:text-xl font-medium text-white mb-3 sm:mb-4 md:mb-6">Cast</h2>
          <Characters data={data?.characters?.edges} />
        </div>
      )}
      
      {/* Recommendations - Netflix Style */}
      {data?.recommendations?.nodes?.length > 0 && (
        <div className="px-4 sm:px-8 md:px-12 py-4 sm:py-6 md:py-8">
          <h2 className="text-base sm:text-lg md:text-xl font-medium text-white mb-3 sm:mb-4 md:mb-6">More Like This</h2>
          <div className="relative">
            <Animecards 
              data={data.recommendations.nodes} 
              cardid={"Recommendations"} 
              showViewMore={false} 
              show={false}
            />
          </div>
        </div>
      )}
    </>
  )
}

export default DetailsContainer
